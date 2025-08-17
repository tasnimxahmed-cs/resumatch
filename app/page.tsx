import React from 'react';
import { ArrowRight, Target, Zap, BarChart3, CheckCircle, ArrowUpRight } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark transition">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-bg-dark/10 dark:border-bg-light/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold [font-family:var(--font-poppins)]">
              <a href="#">Resu<span className="text-brand-light dark:text-brand-dark">Match</span></a>
            </div>
            <div className="[font-family:var(--font-poppins)] text-sm font-medium hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium hover:text-brand-light dark:hover:text-brand-dark transition [font-family: var(--font-inter)]">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium hover:text-brand-light dark:hover:text-brand-dark transition [font-family: var(--font-inter)]">
                How It Works
              </a>
              <a href="#pricing" className="text-sm font-medium hover:text-brand-light dark:hover:text-brand-dark transition [font-family: var(--font-inter)]">
                Pricing
              </a>
              <a href="/coming-soon" className="text-sm font-medium hover:text-brand-light dark:hover:text-brand-dark transition [font-family: var(--font-inter)]">
                Demo
              </a>
              <ThemeToggle />
              <a
                href="/dashboard"
                className="bg-brand-light dark:bg-brand-dark text-text-dark px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-light/90 dark:hover:bg-brand-dark/90 transition"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="[font-family:var(--font-poppins)] inline-flex items-center gap-2 bg-brand-light/10 dark:bg-brand-dark/10 text-brand-light dark:text-brand-dark px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              AI-Powered Job Matching
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight [font-family:var(--font-poppins)] leading-tight">
              Land Your Dream Job with 
              <span className="text-brand-light dark:text-brand-dark"> AI-Optimized</span> Applications
            </h1>
            <p className="text-xl lg:text-2xl text-text-light/80 dark:text-text-dark/80 mb-8 [font-family: var(--font-inter)] leading-relaxed">
              Import job postings, analyze compatibility, and tailor your resume with AI precision. 
              Get targeted insights to maximize your application success rate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/dashboard"
                className="[font-family:var(--font-poppins)] group bg-brand-light dark:bg-brand-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-light/90 dark:hover:bg-brand-dark/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="/coming-soon"
                className="[font-family:var(--font-poppins)] group px-8 py-4 rounded-xl text-lg font-semibold border-2 border-bg-dark/20 dark:border-bg-light/20 hover:border-brand-light dark:hover:border-brand-dark transition-all duration-300 flex items-center gap-2"
              >
                Watch Demo
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-text-light/60 dark:text-text-dark/60">
              <div className="[font-family: var(--font-inter)] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free 14-day trial
              </div>
              <div className="[font-family: var(--font-inter)] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No credit card required
              </div>
              <div className="[font-family: var(--font-inter)] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                95% accuracy rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 [font-family:var(--font-poppins)]">
              Everything You Need to 
              <span className="text-brand-light dark:text-brand-dark"> Optimize</span> Your Job Search
            </h2>
            <p className="text-xl text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto [font-family: var(--font-inter)]">
              From web scraping job postings to AI-powered analysis, we&apos;ve got your entire application process covered.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl bg-bg-dark/5 dark:bg-bg-light/5 hover:bg-bg-dark/10 dark:hover:bg-bg-light/10 transition-all duration-300">
              <div className="w-12 h-12 bg-brand-light/10 dark:bg-brand-dark/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-brand-light dark:text-brand-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-4 [font-family:var(--font-poppins)]">Smart Job Scraping</h3>
              <p className="text-text-light/80 dark:text-text-dark/80 [font-family: var(--font-inter)] leading-relaxed">
                Import job postings from any website with our intelligent scraping system. AI structures unorganized data with 95% accuracy.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-bg-dark/5 dark:bg-bg-light/5 hover:bg-bg-dark/10 dark:hover:bg-bg-light/10 transition-all duration-300">
              <div className="w-12 h-12 bg-brand-light/10 dark:bg-brand-dark/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-brand-light dark:text-brand-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-4 [font-family:var(--font-poppins)]">AI Compatibility Scoring</h3>
              <p className="text-text-light/80 dark:text-text-dark/80 [font-family: var(--font-inter)] leading-relaxed">
                Get precise percentage compatibility scores between your resume and job requirements. Know exactly where you stand.
              </p>
            </div>

            <div className="group p-8 rounded-2xl bg-bg-dark/5 dark:bg-bg-light/5 hover:bg-bg-dark/10 dark:hover:bg-bg-light/10 transition-all duration-300">
              <div className="w-12 h-12 bg-brand-light/10 dark:bg-brand-dark/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-brand-light dark:text-brand-dark" />
              </div>
              <h3 className="text-2xl font-bold mb-4 [font-family:var(--font-poppins)]">Targeted Improvements</h3>
              <p className="text-text-light/80 dark:text-text-dark/80 [font-family: var(--font-inter)] leading-relaxed">
                Receive specific suggestions and keyword gap analysis to optimize your resume for each application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-8 bg-bg-dark/5 dark:bg-bg-light/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 [font-family:var(--font-poppins)]">
              Three Steps to 
              <span className="text-brand-light dark:text-brand-dark"> Success</span>
            </h2>
            <p className="text-xl text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto [font-family: var(--font-inter)]">
              Our streamlined process makes job application optimization simple and effective.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Import Job Posting',
                description: 'Paste any job URL or job description. Our AI extracts and structures all the important details automatically.'
              },
              {
                step: '02',
                title: 'Upload Your Resume',
                description: 'Upload your resume in PDF format. Support for unlimited variations and comprehensive parsing capabilities.'
              },
              {
                step: '03',
                title: 'Get AI Analysis',
                description: 'Receive detailed compatibility scores, improvement suggestions, and keyword gap analysis to optimize your application.'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-brand-light dark:bg-brand-dark text-text-dark rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold mb-4 [font-family:var(--font-poppins)]">{item.title}</h3>
                <p className="text-text-light/80 dark:text-text-dark/80 [font-family: var(--font-inter)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 [font-family:var(--font-poppins)]">
              Choose Your 
              <span className="text-brand-light dark:text-brand-dark"> Plan</span>
            </h2>
            <p className="text-xl text-text-light/80 dark:text-text-dark/80 max-w-2xl mx-auto [font-family: var(--font-inter)]">
              Start free and scale as your job search accelerates. All plans include our AI-powered analysis.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="p-8 rounded-2xl border border-bg-dark/10 dark:border-bg-light/10 bg-bg-dark/5 dark:bg-bg-light/5">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 [font-family:var(--font-poppins)]">Starter</h3>
                <p className="text-text-light/80 dark:text-text-dark/80 mb-4 [font-family: var(--font-inter)]">Perfect for casual job seekers</p>
                <div className="[font-family:var(--font-poppins)] text-4xl font-bold mb-2">Free</div>
                <p className="text-sm text-text-light/60 dark:text-text-dark/60 [font-family: var(--font-inter)]">14-day trial, then $0/month</p>
              </div>
              
              <ul className="[font-family: var(--font-inter)] space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">5 job analyses per month</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Basic compatibility scoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">1 resume upload</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              
              <a
                href="/dashboard"
                className="[font-family:var(--font-poppins)] w-full bg-bg-dark dark:bg-bg-light text-text-dark dark:text-text-light px-6 py-3 rounded-xl font-semibold hover:bg-bg-dark/80 dark:hover:bg-bg-light/80 transition-all duration-300 text-center block"
              >
                Get Started
              </a>
            </div>

            {/* Professional Plan - Most Popular */}
            <div className="p-8 rounded-2xl border-2 border-brand-light dark:border-brand-dark bg-gradient-to-br from-brand-light/5 to-brand-dark/5 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="[font-family:var(--font-poppins)] bg-brand-light dark:bg-brand-dark text-text-dark px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 [font-family:var(--font-poppins)]">Professional</h3>
                <p className="text-text-light/80 dark:text-text-dark/80 mb-4 [font-family: var(--font-inter)]">For active job seekers</p>
                <div className="[font-family:var(--font-poppins)] text-4xl font-bold mb-2">$19<span className="text-xl text-text-light/60 dark:text-text-dark/60">/month</span></div>
                <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-family: var(--font-inter)]">Billed monthly</p>
              </div>
              
              <ul className="[font-family: var(--font-inter)] space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited job analyses</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Advanced AI insights & suggestions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Up to 5 resume variations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Keyword gap analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Application tracking dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Priority email support</span>
                </li>
              </ul>
              
              <a
                href="/dashboard"
                className="[font-family:var(--font-poppins)] w-full bg-brand-light dark:bg-brand-dark text-text-dark px-6 py-3 rounded-xl font-semibold hover:bg-brand-light/90 dark:hover:bg-brand-dark/90 transition-all duration-300 shadow-lg hover:shadow-xl text-center block"
              >
                Start Free Trial
              </a>
            </div>

            {/* Enterprise Plan */}
            <div className="p-8 rounded-2xl border border-bg-dark/10 dark:border-bg-light/10 bg-bg-dark/5 dark:bg-bg-light/5">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2 [font-family:var(--font-poppins)]">Enterprise</h3>
                <p className="text-text-light/80 dark:text-text-dark/80 mb-4 [font-family: var(--font-inter)]">For career coaches & teams</p>
                <div className="[font-family:var(--font-poppins)] text-4xl font-bold mb-2">$49<span className="text-xl text-text-light/60 dark:text-text-dark/60">/month</span></div>
                <p className="text-sm text-text-light/60 dark:text-text-dark/60 [font-family: var(--font-inter)]">Billed monthly</p>
              </div>
              
              <ul className="[font-family: var(--font-inter)] space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Everything in Professional</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Unlimited resume variations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Bulk job analysis (up to 50)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Advanced analytics & reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">Dedicated support</span>
                </li>
              </ul>
              
              <a
                href="/coming-soon"
                className="[font-family:var(--font-poppins)] w-full bg-bg-dark dark:bg-bg-light text-text-dark dark:text-text-light px-6 py-3 rounded-xl font-semibold hover:bg-bg-dark/80 dark:hover:bg-bg-light/80 transition-all duration-300 text-center block"
              >
                Contact Sales
              </a>
            </div>
          </div>

          {/* FAQ or Additional Info */}
          <div className="text-center mt-12">
            <p className="text-text-light/80 dark:text-text-dark/80 mb-4">
              All plans include our 95% accuracy AI analysis and secure data handling
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-text-light/60 dark:text-text-dark/60">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                30-day money-back guarantee
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Data export available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-brand-light/10 to-brand-dark/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 [font-family:var(--font-poppins)]">
            Ready to Optimize Your 
            <span className="text-brand-light dark:text-brand-dark"> Job Applications?</span>
          </h2>
          <p className="text-xl text-text-light/80 dark:text-text-dark/80 mb-8 [font-family: var(--font-inter)]">
            Join thousands of job seekers who&apos;ve improved their success rates with AI-powered optimization.
          </p>
          <div className="flex flex-col gap-4 justify-center items-center">
            <a
              href="/dashboard"
              className="[font-family:var(--font-poppins)] group bg-brand-light dark:bg-brand-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-brand-light/90 dark:hover:bg-brand-dark/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="[font-family: var(--font-inter)] text-sm text-text-light/60 dark:text-text-dark/60">
              Free 14-day trial • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-bg-dark/10 dark:border-bg-light/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold [font-family:var(--font-poppins)] mb-4 md:mb-0">
              <a href="#">Resu<span className="text-brand-light dark:text-brand-dark">Match</span></a>
            </div>
            <div className="flex items-center gap-6 text-sm text-text-light/60 dark:text-text-dark/60">
              <a href="/coming-soon" className="[font-family:var(--font-poppins)] hover:text-text-light dark:hover:text-text-dark transition">Privacy</a>
              <a href="/coming-soon" className="[font-family:var(--font-poppins)] hover:text-text-light dark:hover:text-text-dark transition">Terms</a>
              <a href="/coming-soon" className="[font-family:var(--font-poppins)] hover:text-text-light dark:hover:text-text-dark transition">Contact</a>
            </div>
          </div>
          <div className="[font-family:var(--font-poppins)] text-center mt-8 text-sm text-text-light/60 dark:text-text-dark/60">
            © 2025 ResuMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}