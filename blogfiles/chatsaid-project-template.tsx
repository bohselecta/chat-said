// components/ProjectTemplate.tsx
// Reusable template for individual project pages
'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, ExternalLink, Github, BookOpen, Play, Code, 
  FileText, Users, Zap, Shield, TrendingUp, CheckCircle,
  MessageCircle, Heart, Download
} from 'lucide-react';
import Link from 'next/link';

interface ProjectTemplateProps {
  // Header
  name: string;
  tagline: string;
  description: string;
  status: 'live' | 'beta' | 'concept' | 'research';
  category: 'therapy' | 'civic' | 'research';
  
  // Hero
  heroImage?: string; // Optional hero image URL
  heroGradient: string; // e.g., 'from-rose-500 to-pink-500'
  icon: React.ComponentType<{ size?: number; className?: string }>;
  
  // Links
  demoUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  paperUrl?: string;
  
  // Content sections
  overview: {
    problem: string;
    solution: string;
    impact: string;
  };
  
  features: Array<{
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }>;
  
  techStack?: Array<{
    category: string;
    items: string[];
  }>;
  
  useCases?: Array<{
    title: string;
    description: string;
    user: string;
  }>;
  
  researchBasis?: Array<{
    framework: string;
    description: string;
    citation?: string;
  }>;
  
  roadmap?: Array<{
    phase: string;
    status: 'complete' | 'in-progress' | 'planned';
    items: string[];
  }>;
  
  team?: Array<{
    role: string;
    description: string;
  }>;
  
  relatedProjects?: Array<{
    name: string;
    href: string;
  }>;
}

export default function ProjectTemplate({
  name,
  tagline,
  description,
  status,
  category,
  heroGradient,
  icon: Icon,
  heroImage,
  demoUrl,
  githubUrl,
  docsUrl,
  paperUrl,
  overview,
  features,
  techStack,
  useCases,
  researchBasis,
  roadmap,
  team,
  relatedProjects
}: ProjectTemplateProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tech' | 'research'>('overview');

  const statusStyles = {
    live: { bg: 'bg-green-100', text: 'text-green-700', label: 'Live' },
    beta: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Beta' },
    concept: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Concept' },
    research: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Research' }
  };

  const categoryColors = {
    therapy: 'from-rose-500 to-pink-500',
    civic: 'from-emerald-500 to-teal-500',
    research: 'from-indigo-500 to-purple-500'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Projects</span>
            </Link>
            
            <div className="flex items-center gap-3">
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-2 bg-gradient-to-r ${heroGradient} text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2`}
                >
                  <Play size={16} />
                  Try Demo
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  title="View on GitHub"
                >
                  <Github size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${heroImage ? 'h-96' : ''}`}>
        {heroImage ? (
          <div className="absolute inset-0">
            <img src={heroImage} alt={name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
          </div>
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${heroGradient} opacity-10`} />
        )}
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-4xl">
            {/* Status & Category Badges */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`${statusStyles[status].bg} ${statusStyles[status].text} text-xs font-semibold px-3 py-1 rounded-full`}>
                {statusStyles[status].label}
              </span>
              <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                {category}
              </span>
            </div>

            {/* Icon & Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 bg-gradient-to-br ${heroGradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                <Icon size={32} className="text-white" />
              </div>
              <div>
                <h1 className={`text-4xl lg:text-5xl font-bold ${heroImage ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {name}
                </h1>
                <p className={`text-xl ${heroImage ? 'text-gray-100' : 'text-gray-600'}`}>
                  {tagline}
                </p>
              </div>
            </div>

            <p className={`text-lg lg:text-xl ${heroImage ? 'text-gray-100' : 'text-gray-700'} leading-relaxed mb-8 max-w-3xl`}>
              {description}
            </p>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3">
              {demoUrl && (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 bg-gradient-to-r ${heroGradient} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2`}
                >
                  <Play size={18} />
                  Launch Demo
                </a>
              )}
              {docsUrl && (
                <a
                  href={docsUrl}
                  className={`px-6 py-3 ${heroImage ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'} rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2`}
                >
                  <BookOpen size={18} />
                  Documentation
                </a>
              )}
              {paperUrl && (
                <a
                  href={paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-6 py-3 ${heroImage ? 'bg-white/10 backdrop-blur-sm text-white' : 'bg-white border-2 border-gray-200 text-gray-900'} rounded-xl font-semibold hover:shadow-md transition-all flex items-center gap-2`}
                >
                  <FileText size={18} />
                  Research Paper
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="text-red-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">The Problem</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {overview.problem}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="text-blue-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">The Solution</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {overview.solution}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">The Impact</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {overview.impact}
            </p>
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const FeatureIcon = feature.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${heroGradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <FeatureIcon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Use Cases */}
        {useCases && useCases.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Use Cases</h2>
            <div className="space-y-4">
              {useCases.map((useCase, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="text-purple-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{useCase.title}</h3>
                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{useCase.user}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{useCase.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Research Basis */}
        {researchBasis && researchBasis.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Research Foundation</h2>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
              <div className="space-y-6">
                {researchBasis.map((basis, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-900 mb-2">{basis.framework}</h3>
                    <p className="text-gray-700 mb-2 leading-relaxed">{basis.description}</p>
                    {basis.citation && (
                      <p className="text-sm text-gray-600 italic">{basis.citation}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tech Stack */}
        {techStack && techStack.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Tech Stack</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
                  <div className="flex items-center gap-2 mb-4">
                    <Code className="text-gray-600" size={20} />
                    <h3 className="font-semibold text-gray-900">{tech.category}</h3>
                  </div>
                  <ul className="space-y-2">
                    {tech.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Roadmap */}
        {roadmap && roadmap.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Roadmap</h2>
            <div className="space-y-4">
              {roadmap.map((phase, idx) => {
                const statusColors = {
                  complete: 'bg-green-100 text-green-700',
                  'in-progress': 'bg-blue-100 text-blue-700',
                  planned: 'bg-gray-100 text-gray-700'
                };
                return (
                  <div key={idx} className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{phase.phase}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[phase.status]}`}>
                        {phase.status.replace('-', ' ')}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {phase.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className={`flex-shrink-0 mt-0.5 ${phase.status === 'complete' ? 'text-green-600' : 'text-gray-400'}`} size={16} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Related Projects */}
        {relatedProjects && relatedProjects.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Projects</h2>
            <div className="flex flex-wrap gap-3">
              {relatedProjects.map((project, idx) => (
                <Link
                  key={idx}
                  href={project.href}
                  className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-900 hover:border-gray-300 hover:shadow-md transition-all flex items-center gap-2"
                >
                  {project.name}
                  <ExternalLink size={16} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className={`bg-gradient-to-br ${heroGradient} rounded-3xl p-12 text-center text-white shadow-xl`}>
          <h2 className="text-3xl font-bold mb-4">Ready to Try {name}?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            {status === 'live' ? 'Start using it today.' : status === 'beta' ? 'Join the beta and help shape its future.' : 'Follow development and get early access.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {demoUrl && (
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Play size={20} />
                {status === 'live' ? 'Launch Now' : 'Try Beta'}
              </a>
            )}
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                <Github size={20} />
                View Source
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
