// app/page.tsx - ChatSaid.com Full Portfolio Landing
'use client';

import React, { useState } from 'react';
import { 
  Heart, Brain, MessageCircle, Compass, ArrowRight, Sparkles, Shield, Users,
  Scale, Eye, Zap, Network, Lightbulb, BookOpen, Code, Globe, Lock, 
  TrendingUp, Target, Layers, Cpu, Binary, Waypoints, Dog
} from 'lucide-react';
import Link from 'next/link';

type Category = 'all' | 'therapy' | 'civic' | 'research';

export default function ChatSaidLanding() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const projects = [
    // THERAPY TOOLS
    {
      id: 'kindline',
      name: 'Kindline',
      category: 'therapy' as const,
      tagline: 'Say what you mean, kindly',
      description: 'AI-powered relationship communication that transforms raw feelings into aligned messages using Gottman Method science.',
      logo: '/kindline-logo.svg',
      color: 'from-rose-500 to-pink-500',
      lightColor: 'from-rose-50 to-pink-50',
      href: '/kindline',
      status: 'live' as const,
      tags: ['Relationships', 'Communication', 'Gottman Method']
    },
    {
      id: 'schema',
      name: 'Schema Explorer',
      category: 'therapy' as const,
      tagline: 'Understand your patterns',
      description: 'Young Schema Therapy questionnaire for identifying core emotional patterns and early maladaptive schemas.',
      logo: '/schema-logo.png',
      color: 'from-purple-500 to-indigo-500',
      lightColor: 'from-purple-50 to-indigo-50',
      href: '/schema',
      status: 'live' as const,
      tags: ['Schema Therapy', 'Self-awareness', 'Patterns']
    },
    {
      id: 'mindlight',
      name: 'Mindlight',
      category: 'therapy' as const,
      tagline: 'Present moment awareness',
      description: 'ACT-based tool for psychological flexibility, values clarification, and mindful acceptance.',
      logo: '/mindlight-logo.svg',
      color: 'from-blue-500 to-cyan-500',
      lightColor: 'from-blue-50 to-cyan-50',
      href: '/mindlight',
      status: 'live' as const,
      tags: ['ACT', 'Mindfulness', 'Values']
    },

    // CIVIC & DEMOCRACY TOOLS

    // FAR OUT COMPUTING CONCEPTS
    {
      id: 'fractal-tape',
      name: 'Fractal Tape',
      category: 'research' as const,
      tagline: 'Local-first retrieval layer',
      description: 'A tiny, local-first retrieval layer that turns text into glyph tokens and stores them on an addressable "tape" using Sierpiński depth for efficient querying.',
      icon: Network,
      color: 'from-fuchsia-500 to-pink-500',
      lightColor: 'from-fuchsia-50 to-pink-50',
      href: 'https://github.com/bohselecta/fractal-tape',
      status: 'research' as const,
      tags: ['Fractals', 'Retrieval', 'Local-first']
    },
    {
      id: 'glyph-drive-3d',
      name: 'Glyph Drive 3D',
      category: 'research' as const,
      tagline: 'Fractal-addressable memory',
      description: 'A fractal-addressable memory system built on the Császár polyhedron. Triangular glyph cells scale infinitely via subdivision on a toroidal surface.',
      icon: Layers,
      color: 'from-violet-500 to-purple-500',
      lightColor: 'from-violet-50 to-purple-50',
      href: 'https://github.com/bohselecta/glyph-drive-3d',
      status: 'research' as const,
      tags: ['Fractals', 'Memory', '3D Geometry']
    },
    {
      id: 'glyph-core',
      name: 'Glyph Core',
      category: 'research' as const,
      tagline: 'Computational substrate',
      description: 'A new computational substrate: memory, addressing, and computation unified in a single living fractal structure with read/write head scanning.',
      icon: Cpu,
      color: 'from-indigo-500 to-blue-500',
      lightColor: 'from-indigo-50 to-blue-50',
      href: 'https://github.com/bohselecta/glyph-core',
      status: 'research' as const,
      tags: ['Computation', 'Fractals', 'Memory']
    },
    {
      id: 'dr-cursored',
      name: 'DR Cursored',
      category: 'research' as const,
      tagline: 'Development health toolkit',
      description: 'The ultimate debugging and development health toolkit for modern web projects. Universal health checks, smart cleaning, port management, and powerful debugging tools.',
      icon: Shield,
      color: 'from-slate-500 to-zinc-500',
      lightColor: 'from-slate-50 to-zinc-50',
      href: 'https://github.com/bohselecta/dr-cursored',
      status: 'research' as const,
      tags: ['Debugging', 'Development', 'Health Checks']
    },
    {
      id: 'temporal-glyph-operator',
      name: 'Temporal Glyph Operator',
      category: 'research' as const,
      tagline: 'Time-based glyph operations',
      description: 'Advanced TypeScript implementation for temporal operations on glyph-based data structures.',
      icon: Cpu,
      color: 'from-teal-500 to-cyan-500',
      lightColor: 'from-teal-50 to-cyan-50',
      href: 'https://github.com/bohselecta/temporal-glyph-operator',
      status: 'research' as const,
      tags: ['TypeScript', 'Temporal', 'Glyphs']
    },
    {
      id: 'rabbit-hole',
      name: 'Rabbit Hole',
      category: 'research' as const,
      tagline: 'AI-powered exploration tool',
      description: 'A rabbit hole exploration web tool with AI analysis for deep-diving into topics and concepts.',
      icon: Brain,
      color: 'from-purple-500 to-violet-500',
      lightColor: 'from-purple-50 to-violet-50',
      href: 'https://github.com/bohselecta/rabbit-hole',
      status: 'research' as const,
      tags: ['AI', 'Exploration', 'Analysis']
    },
    {
      id: 'middle-ground',
      name: 'Middle Ground',
      category: 'civic' as const,
      tagline: 'Team management for clarity',
      description: 'A team management app built for clarity and efficiency in collaborative environments.',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      lightColor: 'from-blue-50 to-indigo-50',
      href: 'https://github.com/bohselecta/middle-ground',
      status: 'research' as const,
      tags: ['Team Management', 'Collaboration', 'Efficiency']
    },
    {
      id: 'common-sky',
      name: 'Common Sky',
      category: 'civic' as const,
      tagline: 'Tools for new democracy',
      description: 'Website and tools designed for a hypothetical new democracy for Gaza - exploring civic technology.',
      icon: Globe,
      color: 'from-emerald-500 to-teal-500',
      lightColor: 'from-emerald-50 to-teal-50',
      href: 'https://github.com/bohselecta/common-sky',
      status: 'research' as const,
      tags: ['Democracy', 'Civic Tech', 'Governance']
    },
    {
      id: 'hyperfurl',
      name: 'Hyperfurl',
      category: 'research' as const,
      tagline: 'See the sound, hear the image',
      description: 'Experimental multimedia tool that explores synesthetic experiences between sound and visual elements.',
      icon: Eye,
      color: 'from-pink-500 to-rose-500',
      lightColor: 'from-pink-50 to-rose-50',
      href: 'https://github.com/bohselecta/Hyperfurl',
      status: 'research' as const,
      tags: ['Multimedia', 'Synesthesia', 'Experimental']
    },
    {
      id: 'cyberstate',
      name: 'Cyberstate',
      category: 'research' as const,
      tagline: 'Sci-fi style MLS search',
      description: 'A futuristic, sci-fi styled MLS (Multiple Listing Service) search interface experiment.',
      icon: Network,
      color: 'from-cyan-500 to-blue-500',
      lightColor: 'from-cyan-50 to-blue-50',
      href: 'https://github.com/bohselecta/cyberstate',
      status: 'research' as const,
      tags: ['UI/UX', 'Sci-fi', 'Search']
    },
    {
      id: 'good-game',
      name: 'Good Game',
      category: 'research' as const,
      tagline: 'Spoiler-free game reviews',
      description: 'Was the game worth watching? Find out without spoilers! A tool for evaluating entertainment value.',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      lightColor: 'from-amber-50 to-orange-50',
      href: 'https://github.com/bohselecta/good-game',
      status: 'research' as const,
      tags: ['Reviews', 'Entertainment', 'Spoiler-free']
    },
    {
      id: 'paycheck2pay',
      name: 'Paycheck2Pay',
      category: 'civic' as const,
      tagline: 'Contribution calculator',
      description: 'How much do you really contribute? A tool for calculating and visualizing personal economic impact.',
      icon: Scale,
      color: 'from-green-500 to-emerald-500',
      lightColor: 'from-green-50 to-emerald-50',
      href: 'https://github.com/bohselecta/paycheck2pay',
      status: 'research' as const,
      tags: ['Economics', 'Calculator', 'Impact']
    },
    {
      id: 'mechacrew',
      name: 'MechCrew',
      category: 'research' as const,
      tagline: 'Multiplayer AI creation',
      description: 'MechCrew - Multiplayer AI creation engine experiment for collaborative AI development.',
      icon: Cpu,
      color: 'from-violet-500 to-purple-500',
      lightColor: 'from-violet-50 to-purple-50',
      href: 'https://github.com/bohselecta/mechacrew',
      status: 'research' as const,
      tags: ['AI', 'Multiplayer', 'Collaboration']
    },
    {
      id: 'abby',
      name: 'Abby',
      category: 'research' as const,
      tagline: 'Dashboard tool',
      description: 'A dashboard tool for data visualization and management interfaces.',
      icon: Eye,
      color: 'from-slate-500 to-gray-500',
      lightColor: 'from-slate-50 to-gray-50',
      href: 'https://github.com/bohselecta/abby',
      status: 'research' as const,
      tags: ['Dashboard', 'Data', 'Visualization']
    },
    {
      id: 'vibe-cherry',
      name: 'Vibe Cherry',
      category: 'research' as const,
      tagline: 'Make apps in seconds',
      description: 'Vibe Cherry deployment - make your own apps in seconds! Rapid application development tool.',
      icon: Zap,
      color: 'from-red-500 to-pink-500',
      lightColor: 'from-red-50 to-pink-50',
      href: 'https://github.com/bohselecta/vibe-cherry',
      status: 'research' as const,
      tags: ['Rapid Development', 'Apps', 'Tools']
    },
    {
      id: 'strong-sketch',
      name: 'Strong Sketch',
      category: 'research' as const,
      tagline: 'Strategic project planning',
      description: 'Helps you sketch project goals into structured strategies — then proves their integrity with logic packs and code audits.',
      icon: Target,
      color: 'from-indigo-500 to-purple-500',
      lightColor: 'from-indigo-50 to-purple-50',
      href: 'https://github.com/bohselecta/strong-sketch',
      status: 'research' as const,
      tags: ['Strategy', 'Planning', 'Logic']
    },
    {
      id: 'glyphd',
      name: 'Glyphd',
      category: 'research' as const,
      tagline: 'AI workflow management',
      description: 'Purpose-built for complex AI workflows. Maintain project context, track decisions, and preserve memory across large-scale AI-guided projects.',
      icon: Brain,
      color: 'from-violet-500 to-purple-500',
      lightColor: 'from-violet-50 to-purple-50',
      href: 'https://github.com/bohselecta/glyphd',
      status: 'research' as const,
      tags: ['AI Workflows', 'Context', 'Memory']
    },
    {
      id: 'gpt-conversation-miner',
      name: 'GPT Conversation Miner',
      category: 'research' as const,
      tagline: 'Research compilation tool',
      description: 'Windows-first toolkit that mines PDFs and GPT chat exports for verbatim quotes, builds research compilations, and reconstructs app/tool ideas.',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      lightColor: 'from-blue-50 to-cyan-50',
      href: 'https://github.com/bohselecta/gpt-conversation-miner',
      status: 'research' as const,
      tags: ['Research', 'Mining', 'Compilation']
    },
    {
      id: 'crash-rewind',
      name: 'Crash Rewind',
      category: 'research' as const,
      tagline: 'Deterministic crash reproduction',
      description: 'Deterministic crash repro + triage for mobile teams. Turn mobile crashes into one-click, deterministic replays in emulators.',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      lightColor: 'from-orange-50 to-red-50',
      href: 'https://github.com/bohselecta/crash-rewind',
      status: 'research' as const,
      tags: ['Debugging', 'Mobile', 'Reproduction']
    },
    {
      id: 'fractal-video-tape',
      name: 'Fractal Video Tape',
      category: 'research' as const,
      tagline: 'Revolutionary video codec',
      description: 'FVT — Fractal Video Tape: Revolutionary codec using glyph-addressed quadtree tiles with Haar wavelets. Progressive streaming over WebSocket.',
      icon: Eye,
      color: 'from-pink-500 to-rose-500',
      lightColor: 'from-pink-50 to-rose-50',
      href: 'https://github.com/bohselecta/fractal-video-tape',
      status: 'research' as const,
      tags: ['Video Codec', 'Fractals', 'Streaming']
    },
  ];

  const categories = [
    { id: 'all' as const, label: 'All Projects', icon: Layers, count: projects.length },
    { id: 'therapy' as const, label: 'Therapy Tools', icon: Heart, count: projects.filter(p => p.category === 'therapy').length },
    { id: 'civic' as const, label: 'Civic Tech', icon: Scale, count: projects.filter(p => p.category === 'civic').length },
    { id: 'research' as const, label: 'Research', icon: Lightbulb, count: projects.filter(p => p.category === 'research').length }
  ];

  const filteredProjects = activeCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  const statusStyles = {
    live: { bg: 'bg-green-100', text: 'text-green-700', label: 'Live' },
    beta: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Beta' },
    concept: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Concept' },
    research: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Research' }
  };

  return (
    <div className="min-h-screen lg:min-h-[120vh] bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/graphic-logo-mark.svg" 
                  alt="ChatSaid Logo" 
                  className="w-10 h-10"
                />
              </div>
              <div>
                <h1 className="font-display font-semibold text-step-2 tracking-tight-display" style={{ color: '#303B48' }}>
                  ChatSaid
                </h1>
                <p className="font-body text-step--2 text-gray-600 tracking-small-caps">AI-Enhanced Innovation Lab</p>
              </div>
            </div>
            
            <nav className="hidden md:flex gap-6">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-body font-medium text-step-0 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Projects
              </button>
              <button 
                onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-body font-medium text-step-0 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Story
              </button>
              <Link 
                href="/blog"
                className="font-body font-medium text-step-0 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <div className="text-center max-w-5xl mx-auto">
            {/* Origin Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-full mb-6">
              <MessageCircle className="text-indigo-600" size={16} />
              <span className="text-sm font-medium text-gray-900">
                "Well, <em>chat said</em>..." — and the ideas kept coming
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="font-display font-semibold text-step-5 text-gray-900 mb-6 tracking-tight-display leading-display">
              Where AI meets
              <br />
              <img 
                src="/audacious-ideas.png" 
                alt="audacious ideas" 
                className="inline-block w-[50vw] h-auto mt-2 sm:w-[40vw] md:w-[30vw] lg:w-[25vw] xl:w-[20vw] 2xl:w-[15vw] 2xl:max-w-md relative z-10"
                style={{ mixBlendMode: 'normal' }}
              />
            </h2>

            {/* Subheadline */}
            <p className="font-body text-step-1 text-gray-600 mb-8 leading-relaxed">
              A portfolio of AI-enhanced projects spanning mental health, civic technology, 
              democracy tools, and far-out computing concepts.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: '#303B48' }}
              >
                Explore Projects
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all border-2 border-gray-200"
              >
                Read the Story
              </button>
            </div>
          </div>
        </div>

        {/* Animated Background */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animate-delay-1000" />
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow animate-delay-2000" />
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={isActive ? { backgroundColor: '#2767C4' } : {}}
                >
                  <Icon size={18} />
                  {cat.label}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const statusStyle = statusStyles[project.status];
              
              return (
                <div
                  key={project.id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-gray-200 overflow-hidden"
                >
                  {/* Project Header */}
                  <div className={`bg-gradient-to-br ${project.lightColor} p-6 border-b border-gray-100 relative`}>
                    {/* Status Badge */}
                    <div className={`absolute top-3 right-3 ${statusStyle.bg} ${statusStyle.text} text-xs font-semibold px-2 py-1 rounded-full`}>
                      {statusStyle.label}
                    </div>
                    
                    <div className="w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      {project.logo ? (
                        <img 
                          src={project.logo} 
                          alt={`${project.name} Logo`}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <div className={`w-12 h-12 bg-gradient-to-br ${project.color} rounded-xl flex items-center justify-center`}>
                          {project.icon && <project.icon className="text-white" size={24} />}
                        </div>
                      )}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-1">
                      {project.name}
                    </h4>
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {project.tagline}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tags & Launch */}
                  <div className="p-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={project.href}
                      className={`w-full py-2.5 px-4 bg-gradient-to-r ${project.color} text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm group-hover:gap-3`}
                    >
                      {project.status === 'live' ? 'Launch' : project.status === 'beta' ? 'Try Beta' : 'Learn More'}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="font-display font-semibold text-step-4 text-gray-900 mb-4 tracking-tight-heading leading-heading">
              The "Chat Said" Origin
            </h3>
            <p className="font-body text-step-1 text-gray-600">
              From a casual conversation to a portfolio of innovation
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <p className="font-body text-step-0 text-gray-700 leading-relaxed mb-6">
                ChatSaid began as a dialogue — not about one topic, but about everything that connects them.
                Through conversation, ideas found structure. Feelings found language. Research became design.
              </p>
              <p className="font-body text-step-0 text-gray-700 leading-relaxed mb-6">
                At first, it meant exploring how AI could support emotional clarity and mental health.
                That same reflective process soon evolved into an engine for invention — uncovering links between therapy, cognition, computation, and creativity itself.
              </p>
              <p className="font-body text-step-0 text-gray-700 leading-relaxed mb-6">
                Each project here grew from that simple exchange:
                human curiosity meeting machine attention.
                What if we mapped emotion like code?
                What if insight could be rendered as architecture, or empathy as interface?
              </p>
              <p className="font-body text-step-0 text-gray-700 leading-relaxed mb-6">
                ChatSaid is the root system.
                A portfolio of experiments in thinking — spanning psychology, design, and speculative computation — all guided by one principle:
              </p>
              <p className="font-body text-step-1 text-gray-700 leading-relaxed font-medium italic">
                Everything begins with what chat said.
              </p>
              
              <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-indigo-200 mt-8">
                <div className="flex items-start gap-4">
                  <Sparkles className="text-indigo-600 flex-shrink-0 mt-1" size={32} />
                  <div>
                    <p className="font-display font-semibold text-step-2 text-indigo-900 mb-3 tracking-tight-heading">
                      The Philosophy
                    </p>
                    <p className="font-body text-step-0 text-gray-700 leading-relaxed mb-3">
                      AI isn't a replacement for human expertise, creativity, or judgment. It's a thought partner—
                      exceptional at pattern recognition, synthesis, and rapid iteration. Used thoughtfully, 
                      it accelerates exploration and makes ambitious projects tractable for small teams (or individuals).
                    </p>
                    <p className="font-body text-step-0 text-gray-700 leading-relaxed">
                      These projects demonstrate what's possible when human vision meets AI capabilities. 
                      Some are practical tools ready for use today. Others are research provocations, 
                      asking "what if?" Call it a lab, a portfolio, or an ongoing experiment in 
                      AI-enhanced innovation.
                    </p>
                  </div>
                </div>
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
                Important Context
              </h4>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>Therapy tools</strong> are educational resources and skill-practice aids, not substitutes for professional mental health care. 
                If you're in crisis, contact emergency services or a crisis hotline.
              </p>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>Civic/democracy tools</strong> are experimental and should inform—not replace—rigorous policy analysis and community deliberation.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Research projects</strong> are conceptual explorations, not production systems. They're meant to provoke thought and invite collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  <img 
                    src="/graphic-logo-mark.svg" 
                    alt="ChatSaid Logo" 
                    className="w-6 h-6"
                  />
                </div>
                <span className="font-display font-semibold text-white text-step-1">ChatSaid</span>
              </div>
              <p className="font-body text-step--1 text-gray-400 mb-4">
                An AI-enhanced innovation lab exploring therapy tools, civic technology, and far-out computing concepts.
              </p>
              <p className="font-body text-step--2 text-gray-500">
                Projects span mental health, democracy, anti-corruption, NLP research, and alternative computing paradigms.
              </p>
            </div>

            <div>
              <h5 className="font-display font-semibold text-white mb-4 text-step-0">Projects</h5>
              <ul className="space-y-2 font-body text-step--1">
                <li><a href="/kindline" className="hover:text-white transition-colors">Kindline</a></li>
                <li><a href="/schema" className="hover:text-white transition-colors">Schema Explorer</a></li>
                <li><a href="/democracy" className="hover:text-white transition-colors">Democracy Lab</a></li>
                <li><a href="/nlp" className="hover:text-white transition-colors">NLP Frontiers</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-display font-semibold text-white mb-4 text-step-0">Resources</h5>
              <ul className="space-y-2 font-body text-step--1">
                <li><a href="#" className="hover:text-white transition-colors">Crisis Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research Papers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Open Source</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
              
              {/* Portfolio Link */}
              <div className="mt-6 pt-4 border-t border-gray-800">
                <a 
                  href="https://corgfolio.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-body text-step--1 text-gray-400 hover:text-white transition-colors"
                >
                  <Dog size={16} className="text-amber-400" />
                  <span>Hayden's Corg-folio</span>
                  <ArrowRight size={12} className="opacity-60" />
                </a>
                <p className="font-body text-step--2 text-gray-500 mt-1">Full portfolio of MVP demos & projects</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 font-body text-step--2 text-center text-gray-500">
            <p>© 2025 ChatSaid. An exploration in AI-enhanced innovation.</p>
            <p className="mt-1">Therapy tools are not substitutes for professional care. Research projects are conceptual.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
