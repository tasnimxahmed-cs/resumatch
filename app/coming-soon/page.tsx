"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import Link from 'next/link';

export default function ComingSoonPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Countdown timer (set to 30 days from now as example)
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = () => {
    if (email.trim()) {
      setIsSubmitted(true);
      // TODO: Send to backend
      console.log('Email submitted:', email);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark flex flex-col">
      {/* Navigation */}
      <nav className="px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold [font-family:var(--font-poppins)]">
              <Link href="/">Resu<span className="text-brand-light dark:text-brand-dark">Match</span></Link>
            </div>
            <div className="[font-family:var(--font-poppins)] flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-brand-light dark:hover:text-brand-dark transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated dots */}
          <div className="flex justify-center items-center gap-2 mb-8">
            <div className="w-3 h-3 bg-brand-light dark:bg-brand-dark rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-brand-light dark:bg-brand-dark rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-brand-light dark:bg-brand-dark rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight [font-family:var(--font-poppins)]">
            Coming <span className="text-brand-light dark:text-brand-dark">Soon</span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-text-light/80 dark:text-text-dark/80 mb-12 [font-family: var(--font-inter)] leading-relaxed max-w-2xl mx-auto">
            We&apos;re putting the finishing touches on this feature. 
            Get notified when it&apos;s ready to help optimize your job applications.
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 mb-12 max-w-md mx-auto">
            <div className="bg-bg-dark/5 dark:bg-bg-light/5 rounded-xl p-4 border border-bg-dark/10 dark:border-bg-light/10">
              <div className="[font-family:var(--font-poppins)] text-3xl lg:text-4xl font-bold text-brand-light dark:text-brand-dark">
                {timeLeft.days}
              </div>
              <div className="text-sm text-text-light/60 dark:text-text-dark/60 font-medium [font-family: var(--font-inter)]">
                Days
              </div>
            </div>
            <div className="bg-bg-dark/5 dark:bg-bg-light/5 rounded-xl p-4 border border-bg-dark/10 dark:border-bg-light/10">
              <div className="[font-family:var(--font-poppins)] text-3xl lg:text-4xl font-bold text-brand-light dark:text-brand-dark">
                {timeLeft.hours}
              </div>
              <div className="text-sm text-text-light/60 dark:text-text-dark/60 font-medium [font-family: var(--font-inter)]">
                Hours
              </div>
            </div>
            <div className="bg-bg-dark/5 dark:bg-bg-light/5 rounded-xl p-4 border border-bg-dark/10 dark:border-bg-light/10">
              <div className="[font-family:var(--font-poppins)] text-3xl lg:text-4xl font-bold text-brand-light dark:text-brand-dark">
                {timeLeft.minutes}
              </div>
              <div className="text-sm text-text-light/60 dark:text-text-dark/60 font-medium [font-family: var(--font-inter)]">
                Minutes
              </div>
            </div>
            <div className="bg-bg-dark/5 dark:bg-bg-light/5 rounded-xl p-4 border border-bg-dark/10 dark:border-bg-light/10">
              <div className="[font-family:var(--font-poppins)] text-3xl lg:text-4xl font-bold text-brand-light dark:text-brand-dark">
                {timeLeft.seconds}
              </div>
              <div className="text-sm text-text-light/60 dark:text-text-dark/60 font-medium [font-family: var(--font-inter)]">
                Seconds
              </div>
            </div>
          </div>

          {/* Email Signup */}
          {!isSubmitted ? (
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4 [font-family:var(--font-poppins)]">Get Early Access</h3>
              <p className="text-text-light/80 dark:text-text-dark/80 mb-6 [font-family: var(--font-inter)]">
                Be the first to know when this feature launches. No spam, just updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="[font-family: var(--font-inter)] w-full px-4 py-3 rounded-lg border border-bg-dark/20 dark:border-bg-light/20 bg-bg-dark/5 dark:bg-bg-light/5 focus:outline-none focus:ring-2 focus:ring-brand-light dark:focus:ring-brand-dark focus:border-transparent transition"
                  />
                </div>
                <button
                  onClick={handleEmailSubmit}
                  className="[font-family:var(--font-poppins)] cursor-pointer bg-brand-light dark:bg-brand-dark text-text-dark px-6 py-3 rounded-lg font-semibold hover:bg-brand-light/90 dark:hover:bg-brand-dark/90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Mail className="w-4 h-4" />
                  Notify Me
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-2">
                  <CheckCircle className="w-6 h-6" />
                  <span className="text-xl font-semibold [font-family:var(--font-poppins)]">You&apos;re on the list!</span>
                </div>
                <p className="text-text-light/80 dark:text-text-dark/80 [font-family: var(--font-inter)]">
                  We&apos;ll send you an email as soon as this feature is ready.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 lg:px-8 border-t border-bg-dark/10 dark:border-bg-light/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="[font-family:var(--font-poppins)] text-sm text-text-light/60 dark:text-text-dark/60">
            © 2025 ResuMatch. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}