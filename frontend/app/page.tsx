"use client"
import Link from "next/link"
import { ArrowRight, Users, FileText, Sparkles, Clock, Shield } from "lucide-react"
import NavigationHeader from "@/components/navigation_header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader currentMode="home" />

      

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#1a5a52] to-[#004038] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">Automate Your Hiring Process</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-12 text-pretty">
              Streamline recruitment and applications with our intelligent platform. Save time, reduce complexity, and
              make hiring easier for everyone.
            </p>

            {/* Mode Selection Cards */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
              {/* Applicant Card */}
              <Link href="/applicant/page_1">
                <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">I'm an Applicant</h2>
                    <p className="text-white/80 text-balance">
                      Submit your application with ease. Upload your resume, showcase projects, and verify your email.
                    </p>
                    <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                      Start Application <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Recruiter Card */}
              <Link href="/recruiter/dashboard">
                <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">I'm a Recruiter</h2>
                    <p className="text-white/80 text-balance">
                      Manage applications, review candidates, and streamline your hiring workflow efficiently.
                    </p>
                    <div className="flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all">
                      Access Dashboard <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-foreground">Why Choose Talent Pipeline?</h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              Built to make hiring seamless for both recruiters and applicants
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-navy">Save Time</h3>
                <p className="text-muted-foreground">
                  Automated workflows reduce manual work by up to 70%, letting you focus on what matters most.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-peach/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-orange" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Secure & Reliable</h3>
                <p className="text-muted-foreground">
                  Email verification and secure data handling ensure every application is legitimate and protected.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-navy">Smart Processing</h3>
                <p className="text-muted-foreground">
                  Intelligent forms collect all necessary information in a structured, easy-to-review format.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-b from-[#1a5a52] to-[#004038] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Ready to Transform Your Hiring?</h2>
            <p className="text-xl text-white/90 mb-8">Join hundreds of organizations making hiring simpler and faster</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/applicant/page_1">
                <button className="bg-white hover:bg-white/90 text-[#004038] px-8 py-3 rounded-lg font-semibold transition-colors">
                  Apply Now
                </button>
              </Link>
              <Link href="/recruiter/dashboard">
                <button className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                  Recruiter Access
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p>© 2025 Talent Pipeline. Making hiring easier for everyone.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
