"""
GitHub API service for fetching repository data.
Handles smart filtering to avoid fetching hundreds of repos.
"""
import httpx
from typing import Optional, List, Dict, Any
from app.config import settings
from app.services.github_analyzer import extract_github_username


async def get_user_repositories(
    github_url: str,
    max_repos: int = 30,
    max_to_verify: int = 20,
    resume_skills: Optional[List[str]] = None
) -> List[Dict[str, Any]]:
    """
    Fetch user repositories with smart filtering.
    
    Args:
        github_url: GitHub profile URL
        max_repos: Maximum repos to fetch initially (default: 30)
        max_to_verify: Maximum repos to use for verification (default: 20)
        resume_skills: Optional list of skills to filter by (e.g., ["TypeScript", "React"])
    
    Returns:
        List of repository dicts with name, description, url, etc.
    """
    username = extract_github_username(github_url)
    if not username:
        return []
    
    # Fetch repo list (lightweight)
    repos = await _fetch_repo_list(username, max_repos)
    
    if not repos:
        return []
    
    # Filter to most relevant
    filtered_repos = _filter_relevant_repos(repos, resume_skills, max_to_verify)
    
    # Fetch READMEs for top repos only
    detailed_repos = await _fetch_repo_details(filtered_repos)
    
    return detailed_repos


async def _fetch_repo_list(username: str, limit: int = 30) -> List[Dict[str, Any]]:
    """
    Fetch repository list from GitHub API (lightweight, no READMEs yet).
    """
    headers = {}
    if settings.github_api_token:
        headers["Authorization"] = f"token {settings.github_api_token}"
        headers["Accept"] = "application/vnd.github.v3+json"
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Fetch repos: owned only, sorted by updated, limit results
            response = await client.get(
                f"https://api.github.com/users/{username}/repos",
                headers=headers,
                params={
                    "type": "owner",  # Only owned repos, not forks
                    "sort": "updated",  # Most recently updated first
                    "direction": "desc",
                    "per_page": limit,
                    "page": 1
                }
            )
            
            if response.status_code == 404:
                print(f"⚠️  User {username} not found on GitHub")
                return []
            
            if response.status_code != 200:
                print(f"⚠️  GitHub API error: {response.status_code}")
                return []
            
            repos = response.json()
            
            # Extract only what we need (lightweight)
            return [
                {
                    "name": repo.get("name"),
                    "description": repo.get("description") or "",
                    "url": repo.get("html_url"),
                    "stars": repo.get("stargazer_count", 0),
                    "language": repo.get("language"),
                    "topics": repo.get("topics", []),
                    "updated_at": repo.get("updated_at"),
                    "private": repo.get("private", False),
                    "fork": repo.get("fork", False)
                }
                for repo in repos
                if not repo.get("private", False)  # Skip private repos
            ]
            
    except httpx.RequestError as e:
        print(f"⚠️  Error fetching repos: {e}")
        return []


def _filter_relevant_repos(
    repos: List[Dict[str, Any]],
    resume_skills: Optional[List[str]],
    max_count: int = 20
) -> List[Dict[str, Any]]:
    """
    Filter repositories to most relevant ones.
    
    Criteria:
    - Has description (not empty)
    - Not a fork
    - Recent activity (updated in last 2 years)
    - Language matches resume skills (if provided)
    - Sorted by stars + recency
    """
    from datetime import datetime, timedelta
    
    filtered = []
    two_years_ago = (datetime.now() - timedelta(days=730)).isoformat()
    
    # Normalize skills for matching
    resume_languages = set()
    if resume_skills:
        resume_languages = {skill.lower() for skill in resume_skills}
        # Map common variations
        language_map = {
            "js": "javascript",
            "ts": "typescript",
            "py": "python"
        }
        for skill in resume_skills:
            normalized = skill.lower()
            if normalized in language_map:
                resume_languages.add(language_map[normalized])
    
    for repo in repos:
        # Skip forks
        if repo.get("fork"):
            continue
        
        # Don't skip if no description - README might have info
        # Just give lower score
        
        # Skip if too old (optional - comment out if you want to include old repos)
        # if repo.get("updated_at", "") < two_years_ago:
        #     continue
        
        # Score by relevance
        score = repo.get("stars", 0)
        
        # Bonus if has description
        if repo.get("description"):
            score += 5
        
        # Bonus if language matches resume skills
        if resume_languages and repo.get("language"):
            repo_lang = repo.get("language", "").lower()
            if any(lang in repo_lang or repo_lang in lang for lang in resume_languages):
                score += 10  # Bonus for matching language
        
        repo["_score"] = score
        filtered.append(repo)
    
    # Sort by score (stars + language match bonus)
    filtered.sort(key=lambda r: r.get("_score", 0), reverse=True)
    
    return filtered[:max_count]


async def _fetch_repo_details(repos: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Fetch README content for repositories (only for repos we'll verify).
    """
    headers = {}
    if settings.github_api_token:
        headers["Authorization"] = f"token {settings.github_api_token}"
        headers["Accept"] = "application/vnd.github.v3+json"
    
    detailed_repos = []
    
    async with httpx.AsyncClient(timeout=10.0) as client:
        for repo in repos:
            # Try to fetch README
            readme_content = ""
            try:
                # Extract owner from URL: https://github.com/owner/repo
                url_parts = repo["url"].replace("https://github.com/", "").split("/")
                if len(url_parts) >= 2:
                    owner = url_parts[0]
                    repo_name = url_parts[1]
                    
                    response = await client.get(
                        f"https://api.github.com/repos/{owner}/{repo_name}/readme",
                        headers=headers
                    )
                    
                    if response.status_code == 200:
                        readme_data = response.json()
                        # Decode base64 content (first 1500 chars for better context)
                        import base64
                        content = base64.b64decode(readme_data.get("content", "")).decode("utf-8", errors="ignore")
                        readme_content = content[:1500]  # Increased to 1500 chars for better matching
            except Exception as e:
                # Silently skip if README fetch fails
                pass
            
            repo["readme"] = readme_content
            detailed_repos.append(repo)
    
    return detailed_repos

