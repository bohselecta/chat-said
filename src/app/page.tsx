'use client';

import React from 'react';
import { ArrowRight, Sparkles, Shield, Users, Brain } from 'lucide-react';
import Link from 'next/link';

export default function ChatSaidLanding() {
  const tools = [
    {
      id: 'kindline',
      name: 'Kindline',
      tagline: 'Say what you mean, kindly',
      description: 'AI-powered relationship communication that transforms raw feelings into aligned messages. Built on Gottman Method science.',
      logo: '/kindline-logo.svg',
      color: 'from-rose-500 to-pink-500',
      lightColor: 'from-rose-50 to-pink-50',
      href: '/kindline',
      features: ['Message alignment', 'Four Horsemen detection', 'Repair suggestions', 'Mood tracking']
    },
    {
      id: 'schema',
      name: 'Schema Explorer',
      tagline: 'Understand your patterns',
      description: 'Young Schema Therapy questionnaire helps identify core emotional patterns and early maladaptive schemas.',
      logo: '/schema-logo.png',
      color: 'from-purple-500 to-indigo-500',
      lightColor: 'from-purple-50 to-indigo-50',
      href: '/schema',
      features: ['18 schema assessment', 'Pattern insights', 'Coping style analysis', 'Growth pathways']
    },
    {
      id: 'mindlight',
      name: 'Mindlight',
      tagline: 'Present moment awareness',
      description: 'ACT-based tool for psychological flexibility, values clarification, and mindful acceptance.',
      logo: '/mindlight-logo.svg',
      color: 'from-blue-500 to-cyan-500',
      lightColor: 'from-blue-50 to-cyan-50',
      href: '/mindlight',
      features: ['Values compass', 'Defusion exercises', 'Acceptance practices', 'Committed action']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/graphic-logo-mark.svg" 
                  alt="ChatSaid Logo" 
                  className="w-8 h-8"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ChatSaid
                </h1>
                <p className="text-xs text-gray-600">AI-powered therapy tools</p>
              </div>
            </div>
            
            <nav className="hidden md:flex gap-6">
              <a href="#tools" className="text-gray-600 hover:text-gray-900 transition-colors">
                Tools
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </a>
              <a href="#learn" className="text-gray-600 hover:text-gray-900 transition-colors">
                Learn
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Origin Story Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-6">
              <Sparkles className="text-indigo-600" size={16} />
              <span className="text-sm font-medium text-indigo-900">
                "Well, chat said..."
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Evidence-based tools
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">
                for your mental health
              </span>
            </h2>

            {/* Subheadline */}
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Science-informed, AI-enhanced tools to support your therapeutic journey. 
              Built with care, guided by research, designed for insight.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="#tools"
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                Explore Tools
                <ArrowRight size={20} />
              </a>
              <a
                href="#about"
                className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all border-2 border-gray-200"
              >
                Learn More
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-600" />
                <span>Privacy-first design</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain size={16} className="text-blue-600" />
                <span>Research-backed</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} className="text-purple-600" />
                <span>Built by therapists</span>
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animate-delay-1000" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animate-delay-2000" />
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Your Toolkit for Growth
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Each tool is designed to complement therapeutic work, not replace it. 
              Use them to deepen self-awareness, practice new skills, and track your progress.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool) => {
              return (
                <div
                  key={tool.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-200 overflow-hidden"
                >
                  {/* Tool Header */}
                  <div className={`bg-gradient-to-br ${tool.lightColor} p-8 border-b border-gray-100`}>
                    <div className="w-14 h-14 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <img 
                        src={tool.logo} 
                        alt={`${tool.name} Logo`}
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                      {tool.name}
                    </h4>
                    <p className="text-sm font-medium text-gray-600 mb-3">
                      {tool.tagline}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <ul className="space-y-2 mb-6">
                      {tool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={tool.href}
                      className={`w-full py-3 px-6 bg-gradient-to-r ${tool.color} text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group-hover:gap-3`}
                    >
                      Launch Tool
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Coming Soon Teaser */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full">
              <Sparkles className="text-gray-600" size={16} />
              <span className="text-sm font-medium text-gray-700">
                More tools in development
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              The "Chat Said" Story
            </h3>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                It started with a conversation between friends. One was working through some difficult mental health challenges, 
                and kept finding helpful insights through thoughtful prompts to ChatGPT. 
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                "Well, <em>chat said</em>..." became their shorthand for evidence-based wisdom, 
                reframed with clarity and compassion. It wasn't therapy—it was a tool that helped 
                them organize their thoughts, understand patterns, and find language for complex feelings.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                We realized AI could be a bridge—not a replacement for human connection or professional help, 
                but a companion for the journey. These tools emerged from that realization: 
                science-backed, thoughtfully designed, and built to complement therapeutic work.
              </p>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200 mt-8">
                <p className="text-lg font-semibold text-indigo-900 mb-2">
                  Our Commitment
                </p>
                <p className="text-gray-700">
                  Every tool is grounded in established therapeutic frameworks—Gottman Method, 
                  Schema Therapy, ACT, and more. We're transparent about what AI can and can't do, 
                  and we always encourage working with trained professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4">
            <Shield className="text-amber-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Important: These Are Learning Tools, Not Therapy
              </h4>
              <p className="text-gray-700 leading-relaxed">
                ChatSaid tools are designed for education, self-reflection, and skill practice. 
                They are <strong>not</strong> a substitute for professional mental health care, diagnosis, or treatment. 
                If you're experiencing a mental health crisis, please contact a crisis helpline or emergency services. 
                For ongoing support, work with a licensed therapist or counselor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/graphic-logo-mark.svg" 
                    alt="ChatSaid Logo" 
                    className="w-6 h-6"
                  />
                </div>
                <span className="font-bold text-white">ChatSaid</span>
              </div>
              <p className="text-sm text-gray-400">
                AI-powered tools for mental health, built with care and guided by science.
              </p>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-4">Tools</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="/kindline" className="hover:text-white transition-colors">Kindline</a></li>
                <li><a href="/schema" className="hover:text-white transition-colors">Schema Explorer</a></li>
                <li><a href="/mindlight" className="hover:text-white transition-colors">Mindlight</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold text-white mb-4">Resources</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Crisis Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find a Therapist</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-500">
            <p>© 2025 ChatSaid. Not a substitute for professional mental health care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
