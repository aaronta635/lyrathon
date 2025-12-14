"""
Verification service to match resume "built" claims with GitHub repositories.
Uses keyword matching first (fast, accurate), then AI for semantic matching as fallback.
"""
import json
import logging
from typing import List, Dict, Any, Optional
from openai import OpenAI
from app.config import settings

logger = logging.getLogger(__name__)


async def verify_built_items(
    built_items: List[str],
    repos: List[Dict[str, Any]]
) -> List[Dict[str, Any]]:
    """
    Verify resume "built" claims against GitHub repositories.
    Uses keyword matching first (fast, accurate), then AI as fallback.
    
    Args:
        built_items: List of "built" items from resume
        repos: List of repository dicts from GitHub API
    
    Returns:
        List of verification results, one per built item
    """
    logger.info(f"Verifying {len(built_items)} built items against {len(repos)} repositories")
    
    if not built_items or not repos:
        logger.warning(f"No built items ({len(built_items)}) or repos ({len(repos)}) to verify")
        return [
            {
                "item": item,
                "confidence": 0,
                "matched_repo": None,
                "repo_url": None
            }
            for item in built_items
        ]
    
    verifications = []
    
    for built_item in built_items:
        # Try keyword matching first (fast and accurate)
        verification = _verify_with_keywords(built_item, repos)
        
        # If keyword matching didn't find a good match, try AI
        if verification["confidence"] < 60:
            logger.info(f"Keyword matching found low confidence ({verification['confidence']}) for '{built_item}', trying AI")
            client = OpenAI(api_key=settings.openai_api_key)
            ai_verification = await _verify_with_ai(client, built_item, repos)
            
            # Use AI result if it's better
            if ai_verification["confidence"] > verification["confidence"]:
                logger.info(f"AI found better match: {ai_verification['confidence']}% vs {verification['confidence']}%")
                verification = ai_verification
            else:
                logger.info(f"Keeping keyword match: {verification['confidence']}%")
        
        verifications.append(verification)
    
    return verifications


def _verify_with_keywords(
    built_item: str,
    repos: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Fast keyword-based matching. Checks if repo names contain key terms from the claim.
    """
    import re
    
    # Extract key terms
    built_lower = built_item.lower()
    common_words = {"a", "an", "the", "for", "with", "and", "or", "of", "to", "in", "on", "at", "by", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "can", "this", "that", "these", "those", "system", "platform", "application", "full", "stack", "real", "time", "online", "with", "for", "connecting", "achieving", "recognition", "automated", "updates", "prototype"}
    meaningful_short = {"app", "ai", "ui", "cms", "api", "iot", "ml", "db", "blog"}
    
    key_terms = []
    words = re.findall(r'\b\w+\b', built_lower)
    for word in words:
        if (len(word) > 3 and word not in common_words) or (word in meaningful_short):
            key_terms.append(word)
    
    # Extract hyphenated terms
    hyphenated = re.findall(r'\b\w+-\w+\b', built_lower)
    for term in hyphenated:
        parts = term.split('-')
        key_terms.extend([p for p in parts if len(p) > 3])
        key_terms.append(term.replace('-', ''))
    
    logger.debug(f"Key terms extracted from '{built_item}': {key_terms}")
    
    if not key_terms:
        logger.warning(f"No key terms extracted from '{built_item}'")
        return {
            "item": built_item,
            "confidence": 0,
            "matched_repo": None,
            "repo_url": None
        }
    
    # Find best match
    best_match = None
    best_score = 0
    
    for repo in repos:
        repo_name = repo.get("name", "").lower()
        repo_desc = (repo.get("description") or "").lower()
        
        # Score: name matches are worth 10x more than description matches
        name_matches = sum(1 for term in key_terms if term in repo_name)
        desc_matches = sum(1 for term in key_terms if term in repo_desc)
        score = (name_matches * 10) + desc_matches
        
        if score > best_score:
            best_score = score
            best_match = repo
    
    if best_match and best_score > 0:
        # Calculate confidence based on score
        if best_score >= 10:  # Multiple name matches
            confidence = 85
        elif best_score >= 5:  # At least one name match
            confidence = 75
        elif best_score > 0:  # Description matches only
            confidence = 60
        
        logger.info(f"Keyword match found: '{best_match.get('name')}' with score {best_score}, confidence {confidence}%")
        return {
            "item": built_item,
            "confidence": confidence,
            "matched_repo": best_match.get("name"),
            "repo_url": best_match.get("url")
        }
    else:
        logger.info(f"No keyword match found for '{built_item}'")
        return {
            "item": built_item,
            "confidence": 0,
            "matched_repo": None,
            "repo_url": None
        }


async def _verify_with_ai(
    client: OpenAI,
    built_item: str,
    repos: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Use OpenAI to semantically match one "built" item with repositories.
    """
    # Build context with repo information - emphasize name first
    repos_context = []
    for i, repo in enumerate(repos, 1):
        repo_name = repo.get('name', 'Unknown')
        repo_info = f"{i}. NAME: {repo_name}"  # Emphasize name
        
        if repo.get('description'):
            repo_info += f"\n   Description: {repo.get('description')}"
        else:
            repo_info += f"\n   Description: (none)"
        
        if repo.get('topics'):
            topics = ", ".join(repo.get('topics', [])[:5])
            repo_info += f"\n   Topics: {topics}"
        
        if repo.get('readme'):
            readme_snippet = repo.get('readme', '')[:400]  # First 400 chars
            repo_info += f"\n   README: {readme_snippet}"
        
        repos_context.append(repo_info)
    
    repos_text = "\n\n".join(repos_context)
    
    prompt = f"""You are matching a resume claim with GitHub repositories. Be VERY STRICT and ACCURATE.

Resume Claim: "{built_item}"

GitHub Repositories:
{repos_text}

CRITICAL MATCHING RULES (follow strictly):
1. REPO NAME is the PRIMARY signal - if the repo name doesn't contain key terms from the claim, it's likely NOT a match
2. Extract KEY TERMS from the claim:
   - "food-rescue marketplace" → key terms: "food", "marketplace", "rescue"
   - "poker platform" → key terms: "poker"
   - "Notion blog" → key terms: "notion", "blog"
   - "AI community insight" → key terms: "community", "insight", "ai"
3. For a STRONG match (80-100), the repo name MUST contain at least one key term AND description must align
4. For a GOOD match (60-79), repo name should contain key terms OR description clearly matches the claim
5. DO NOT match if:
   - Repo name has NO key terms from claim (e.g., "citysense" does NOT match "food marketplace")
   - Description is about completely different domain (e.g., "selling page" does NOT match "community insight app")
   - Only vague similarity exists (e.g., both are "apps" or "platforms" but different purposes)

EXAMPLES:
✅ GOOD: "poker platform" → matches "poker-game" (name has "poker")
✅ GOOD: "Notion blog" → matches "NotionCMS" (name has "notion", description mentions blog)
✅ GOOD: "food marketplace" → matches "food-rescue-app" (name has "food", description matches)
❌ BAD: "food marketplace" → does NOT match "citysense" (name has no food/marketplace terms)
❌ BAD: "community insight app" → does NOT match "frontend-selling-page" (completely different purpose)

Scoring:
- 80-100: Repo name contains key terms AND description clearly matches
- 60-79: Repo name contains key terms OR description strongly matches (but not both)
- 40-59: Some similarity but not clear match
- 0-39: No match - set matched_repo_index to -1

Return JSON:
{{
    "matched_repo_index": 0,  // Best match index, or -1 if no good match
    "confidence": 85  // 0-100
}}

BE STRICT: Only match if repo name has key terms OR description clearly describes the same project. If unsure, return -1 with low confidence.

Return ONLY valid JSON. No explanations."""
    
    try:
        response = client.chat.completions.create(
            model="gpt-5-mini",
            messages=[
                {
                    "role": "system",
                    "content": "You match resume claims with GitHub repositories using semantic understanding. Return only valid JSON."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        result = json.loads(response.choices[0].message.content)
        
        matched_index = result.get("matched_repo_index", -1)
        confidence = result.get("confidence", 0)
        
        logger.info(f"AI returned match index: {matched_index}, confidence: {confidence}%")
        
        # Return simple response
        if matched_index >= 0 and matched_index < len(repos):
            matched_repo = repos[matched_index]
            logger.info(f"AI matched '{built_item}' with repo '{matched_repo.get('name')}'")
            return {
                "item": built_item,
                "confidence": confidence,
                "matched_repo": matched_repo.get("name"),
                "repo_url": matched_repo.get("url")
            }
        else:
            logger.info(f"AI found no match for '{built_item}' (index: {matched_index})")
            return {
                "item": built_item,
                "confidence": confidence,
                "matched_repo": None,
                "repo_url": None
            }
            
    except Exception as e:
        logger.error(f"AI verification failed for '{built_item}': {str(e)}", exc_info=True)
        return {
            "item": built_item,
            "confidence": 0,
            "matched_repo": None,
            "repo_url": None
        }

