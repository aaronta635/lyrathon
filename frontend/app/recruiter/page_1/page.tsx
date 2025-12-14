import RecruiterPage1Form from "./recruiter_page_1_form"
import NavigationHeader from "@/components/navigation_header"

export default function RecruiterPage1() {
  return (
    <div className="min-h-screen bg-[#f6fefb]">
      <NavigationHeader currentMode="recruiter" />
      <RecruiterPage1Form />
    </div>
  )
}
