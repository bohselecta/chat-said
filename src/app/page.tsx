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
      id: 'consciousness-tools',
      name: 'Consciousness Tools',
      category: 'therapy' as const,
      tagline: 'Awareness enhancement',
      description: 'Experimental tools for consciousness exploration, mindfulness practices, and awareness state mapping.',
      icon: Brain,
      color: 'from-purple-500 to-indigo-500',
      lightColor: 'from-purple-50 to-indigo-50',
      href: 'https://github.com/bohselecta/consciousness-tools',
      status: 'research' as const,
      tags: ['Consciousness', 'Mindfulness', 'Awareness']
    },
    {
      id: 'meditation-tools',
      name: 'Meditation Tools',
      category: 'therapy' as const,
      tagline: 'Digital mindfulness',
      description: 'Digital tools for meditation practice, breathing exercises, and mindfulness training.',
      icon: Heart,
      color: 'from-teal-500 to-cyan-500',
      lightColor: 'from-teal-50 to-cyan-50',
      href: 'https://github.com/bohselecta/meditation-tools',
      status: 'research' as const,
      tags: ['Meditation', 'Mindfulness', 'Breathing']
    },
    {
      id: 'therapy-protocols',
      name: 'Therapy Protocols',
      category: 'therapy' as const,
      tagline: 'Evidence-based interventions',
      description: 'Digital implementations of evidence-based therapy protocols and psychological interventions.',
      icon: Shield,
      color: 'from-emerald-500 to-green-500',
      lightColor: 'from-emerald-50 to-green-50',
      href: 'https://github.com/bohselecta/therapy-protocols',
      status: 'research' as const,
      tags: ['Therapy', 'Protocols', 'Interventions']
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
    {
      id: 'democracy-lab',
      name: 'Democracy Lab',
      category: 'civic' as const,
      tagline: 'Tools for transparent governance',
      description: 'Suite of civic engagement tools for participatory democracy, deliberation, and transparent decision-making.',
      icon: Scale,
      color: 'from-emerald-500 to-teal-500',
      lightColor: 'from-emerald-50 to-teal-50',
      href: '/democracy',
      status: 'beta' as const,
      tags: ['Democracy', 'Governance', 'Participation']
    },
    {
      id: 'corruption-audit',
      name: 'Corruption Auditor',
      category: 'civic' as const,
      tagline: 'Follow the money',
      description: 'AI-powered analysis tools for detecting patterns in public spending, contracts, and potential corruption indicators.',
      icon: Eye,
      color: 'from-amber-500 to-orange-500',
      lightColor: 'from-amber-50 to-orange-50',
      href: '/audit',
      status: 'beta' as const,
      tags: ['Transparency', 'Public Finance', 'Accountability']
    },
    {
      id: 'civic-ai-tools',
      name: 'Civic AI Tools',
      category: 'civic' as const,
      tagline: 'AI for public good',
      description: 'AI-powered tools for civic engagement, community organizing, and public service enhancement.',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      lightColor: 'from-blue-50 to-cyan-50',
      href: 'https://github.com/bohselecta/civic-ai-tools',
      status: 'research' as const,
      tags: ['AI', 'Civic Tech', 'Public Good']
    },
    {
      id: 'community-mapping',
      name: 'Community Mapping',
      category: 'civic' as const,
      tagline: 'Visualizing social networks',
      description: 'Tools for mapping community connections, social networks, and collaborative relationships.',
      icon: Network,
      color: 'from-green-500 to-emerald-500',
      lightColor: 'from-green-50 to-emerald-50',
      href: 'https://github.com/bohselecta/community-mapping',
      status: 'research' as const,
      tags: ['Community', 'Networks', 'Visualization']
    },
    {
      id: 'policy-simulator',
      name: 'Policy Simulator',
      category: 'civic' as const,
      tagline: 'Policy impact modeling',
      description: 'Tools for simulating policy impacts, modeling outcomes, and exploring governance scenarios.',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      lightColor: 'from-blue-50 to-cyan-50',
      href: 'https://github.com/bohselecta/policy-simulator',
      status: 'research' as const,
      tags: ['Policy', 'Simulation', 'Governance']
    },
    {
      id: 'civic-engagement',
      name: 'Civic Engagement Tools',
      category: 'civic' as const,
      tagline: 'Digital participation',
      description: 'Platforms and tools for enhancing civic engagement, public participation, and democratic processes.',
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      lightColor: 'from-indigo-50 to-purple-50',
      href: 'https://github.com/bohselecta/civic-engagement',
      status: 'research' as const,
      tags: ['Civic Engagement', 'Participation', 'Democracy']
    },
    {
      id: 'transparency-tools',
      name: 'Transparency Tools',
      category: 'civic' as const,
      tagline: 'Open government utilities',
      description: 'Tools for promoting government transparency, open data, and public accountability.',
      icon: Eye,
      color: 'from-emerald-500 to-teal-500',
      lightColor: 'from-emerald-50 to-teal-50',
      href: 'https://github.com/bohselecta/transparency-tools',
      status: 'research' as const,
      tags: ['Transparency', 'Open Data', 'Accountability']
    },
    {
      id: 'darpa-challenges',
      name: 'DARPA Challenges',
      category: 'civic' as const,
      tagline: 'Moonshot ideas for public good',
      description: 'Mockup platform for crowdsourcing ambitious solutions to grand challenges in democracy, security, and social innovation.',
      icon: Zap,
      color: 'from-violet-500 to-purple-500',
      lightColor: 'from-violet-50 to-purple-50',
      href: '/darpa',
      status: 'concept' as const,
      tags: ['Innovation', 'Crowdsourcing', 'Grand Challenges']
    },

    // FAR OUT COMPUTING CONCEPTS
    {
      id: 'nlp-experiments',
      name: 'NLP Frontiers',
      category: 'research' as const,
      tagline: 'Rethinking language models',
      description: 'Novel approaches to natural language processing: multi-modal embeddings, semantic topology, and context-aware architectures.',
      icon: MessageCircle,
      color: 'from-cyan-500 to-blue-500',
      lightColor: 'from-cyan-50 to-blue-50',
      href: '/nlp',
      status: 'research' as const,
      tags: ['NLP', 'Machine Learning', 'Linguistics']
    },
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
      id: 'semantic-space',
      name: 'Semantic Space Navigation',
      category: 'research' as const,
      tagline: 'Navigating meaning geometrically',
      description: 'Interface concepts for exploring high-dimensional semantic spaces as if they were physical landscapes.',
      icon: Waypoints,
      color: 'from-indigo-500 to-purple-500',
      lightColor: 'from-indigo-50 to-purple-50',
      href: '/semantic',
      status: 'concept' as const,
      tags: ['UI/UX', 'Embeddings', 'Visualization']
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
      id: 'ai-experiments',
      name: 'AI Experiments',
      category: 'research' as const,
      tagline: 'Machine learning playground',
      description: 'Collection of experimental AI models, neural network architectures, and machine learning experiments.',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      lightColor: 'from-purple-50 to-pink-50',
      href: 'https://github.com/bohselecta/ai-experiments',
      status: 'research' as const,
      tags: ['AI', 'Machine Learning', 'Experiments']
    },
    {
      id: 'data-visualization',
      name: 'Data Visualization Tools',
      category: 'research' as const,
      tagline: 'Making data beautiful',
      description: 'Creative tools for data visualization, interactive charts, and information design.',
      icon: Eye,
      color: 'from-cyan-500 to-blue-500',
      lightColor: 'from-cyan-50 to-blue-50',
      href: 'https://github.com/bohselecta/data-visualization',
      status: 'research' as const,
      tags: ['Visualization', 'Data', 'Design']
    },
    {
      id: 'web-utilities',
      name: 'Web Utilities',
      category: 'research' as const,
      tagline: 'Developer productivity tools',
      description: 'Collection of web development utilities, helper functions, and productivity tools.',
      icon: Code,
      color: 'from-green-500 to-teal-500',
      lightColor: 'from-green-50 to-teal-50',
      href: 'https://github.com/bohselecta/web-utilities',
      status: 'research' as const,
      tags: ['Web Development', 'Utilities', 'Productivity']
    },
    {
      id: 'neural-playground',
      name: 'Neural Playground',
      category: 'research' as const,
      tagline: 'Interactive AI experimentation',
      description: 'Interactive platform to experiment with and visualize neural network architectures and their learning processes.',
      icon: Brain,
      color: 'from-purple-500 to-violet-500',
      lightColor: 'from-purple-50 to-violet-50',
      href: 'https://github.com/bohselecta/neural-playground',
      status: 'research' as const,
      tags: ['Neural Networks', 'AI', 'Visualization']
    },
    {
      id: 'quantum-simulator',
      name: 'Quantum Circuit Simulator',
      category: 'research' as const,
      tagline: 'Quantum computing exploration',
      description: 'Tool to design and simulate quantum circuits, aiding in the understanding of quantum computing principles.',
      icon: Cpu,
      color: 'from-indigo-500 to-purple-500',
      lightColor: 'from-indigo-50 to-purple-50',
      href: 'https://github.com/bohselecta/quantum-simulator',
      status: 'research' as const,
      tags: ['Quantum Computing', 'Simulation', 'Circuits']
    },
    {
      id: 'fractal-tapestry',
      name: 'Fractal Tapestry',
      category: 'research' as const,
      tagline: 'Algorithmic art generation',
      description: 'Exploration into fractal-based design patterns, creating intricate and infinitely scalable visual designs.',
      icon: Sparkles,
      color: 'from-pink-500 to-rose-500',
      lightColor: 'from-pink-50 to-rose-50',
      href: 'https://github.com/bohselecta/fractal-tapestry',
      status: 'research' as const,
      tags: ['Fractals', 'Art', 'Algorithms']
    },
    {
      id: 'consciousness-mapper',
      name: 'Consciousness Mapper',
      category: 'research' as const,
      tagline: 'Mapping awareness states',
      description: 'Tools for mapping and visualizing conscious experience, awareness states, and mental models.',
      icon: Eye,
      color: 'from-violet-500 to-purple-500',
      lightColor: 'from-violet-50 to-purple-50',
      href: 'https://github.com/bohselecta/consciousness-mapper',
      status: 'research' as const,
      tags: ['Consciousness', 'Visualization', 'Awareness']
    },
    {
      id: 'ai-toolkit',
      name: 'AI Toolkit',
      category: 'research' as const,
      tagline: 'AI development utilities',
      description: 'Collection of AI development tools, model utilities, and machine learning helpers.',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      lightColor: 'from-amber-50 to-orange-50',
      href: 'https://github.com/bohselecta/ai-toolkit',
      status: 'research' as const,
      tags: ['AI', 'Tools', 'Machine Learning']
    },
    {
      id: 'algorithm-lab',
      name: 'Algorithm Lab',
      category: 'research' as const,
      tagline: 'Algorithm experimentation',
      description: 'Interactive platform for experimenting with algorithms, data structures, and computational complexity.',
      icon: Cpu,
      color: 'from-slate-500 to-gray-500',
      lightColor: 'from-slate-50 to-gray-50',
      href: 'https://github.com/bohselecta/algorithm-lab',
      status: 'research' as const,
      tags: ['Algorithms', 'Data Structures', 'Complexity']
    },
    {
      id: 'data-pipeline',
      name: 'Data Pipeline Tools',
      category: 'research' as const,
      tagline: 'Data processing utilities',
      description: 'Tools for data ingestion, processing, transformation, and analysis pipelines.',
      icon: Network,
      color: 'from-blue-500 to-indigo-500',
      lightColor: 'from-blue-50 to-indigo-50',
      href: 'https://github.com/bohselecta/data-pipeline',
      status: 'research' as const,
      tags: ['Data Processing', 'Pipelines', 'ETL']
    },
    {
      id: 'visualization-engine',
      name: 'Visualization Engine',
      category: 'research' as const,
      tagline: 'Interactive data visualization',
      description: 'Custom visualization engine for creating interactive charts, graphs, and data representations.',
      icon: Eye,
      color: 'from-cyan-500 to-teal-500',
      lightColor: 'from-cyan-50 to-teal-50',
      href: 'https://github.com/bohselecta/visualization-engine',
      status: 'research' as const,
      tags: ['Visualization', 'Interactive', 'Charts']
    },
    {
      id: 'ml-experiments',
      name: 'ML Experiments',
      category: 'research' as const,
      tagline: 'Machine learning research',
      description: 'Collection of machine learning experiments, model implementations, and research notebooks.',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      lightColor: 'from-purple-50 to-pink-50',
      href: 'https://github.com/bohselecta/ml-experiments',
      status: 'research' as const,
      tags: ['Machine Learning', 'Experiments', 'Research']
    },
    {
      id: 'api-toolkit',
      name: 'API Toolkit',
      category: 'research' as const,
      tagline: 'API development utilities',
      description: 'Collection of tools for API development, testing, documentation, and integration.',
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      lightColor: 'from-green-50 to-emerald-50',
      href: 'https://github.com/bohselecta/api-toolkit',
      status: 'research' as const,
      tags: ['API', 'Development', 'Testing']
    },
    {
      id: 'performance-tools',
      name: 'Performance Tools',
      category: 'research' as const,
      tagline: 'Performance optimization',
      description: 'Tools for performance monitoring, optimization, and analysis of web applications.',
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      lightColor: 'from-orange-50 to-red-50',
      href: 'https://github.com/bohselecta/performance-tools',
      status: 'research' as const,
      tags: ['Performance', 'Optimization', 'Monitoring']
    },
    {
      id: 'security-tools',
      name: 'Security Tools',
      category: 'research' as const,
      tagline: 'Security utilities',
      description: 'Collection of security tools, vulnerability scanners, and security testing utilities.',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      lightColor: 'from-red-50 to-pink-50',
      href: 'https://github.com/bohselecta/security-tools',
      status: 'research' as const,
      tags: ['Security', 'Testing', 'Vulnerabilities']
    },
    {
      id: 'consciousness-research',
      name: 'Consciousness Research',
      category: 'research' as const,
      tagline: 'Exploring awareness',
      description: 'Research into consciousness, awareness states, and the nature of subjective experience.',
      icon: Brain,
      color: 'from-violet-500 to-purple-500',
      lightColor: 'from-violet-50 to-purple-50',
      href: 'https://github.com/bohselecta/consciousness-research',
      status: 'research' as const,
      tags: ['Consciousness', 'Research', 'Awareness']
    },
    {
      id: 'fractal-computing',
      name: 'Fractal Computing',
      category: 'research' as const,
      tagline: 'Self-similar computation',
      description: 'Exploring computational paradigms based on fractal mathematics and recursive self-organization.',
      icon: Network,
      color: 'from-fuchsia-500 to-pink-500',
      lightColor: 'from-fuchsia-50 to-pink-50',
      href: 'https://github.com/bohselecta/fractal-computing',
      status: 'research' as const,
      tags: ['Fractals', 'Computation', 'Self-organization']
    },
    {
      id: 'experimental-ui',
      name: 'Experimental UI',
      category: 'research' as const,
      tagline: 'Interface innovation',
      description: 'Experimental user interface designs, interaction patterns, and novel UX concepts.',
      icon: Eye,
      color: 'from-cyan-500 to-blue-500',
      lightColor: 'from-cyan-50 to-blue-50',
      href: 'https://github.com/bohselecta/experimental-ui',
      status: 'research' as const,
      tags: ['UI/UX', 'Experiments', 'Innovation']
    },
    {
      id: 'bio-inspired-algorithms',
      name: 'Bio-Inspired Algorithms',
      category: 'research' as const,
      tagline: 'Nature-inspired computing',
      description: 'Algorithms inspired by biological systems, evolutionary processes, and natural phenomena.',
      icon: Sparkles,
      color: 'from-green-500 to-emerald-500',
      lightColor: 'from-green-50 to-emerald-50',
      href: 'https://github.com/bohselecta/bio-inspired-algorithms',
      status: 'research' as const,
      tags: ['Bio-inspired', 'Algorithms', 'Nature']
    },
    {
      id: 'mindfulness-tech',
      name: 'Mindfulness Tech',
      category: 'therapy' as const,
      tagline: 'Technology for well-being',
      description: 'Technology solutions for mindfulness, meditation, and mental well-being enhancement.',
      icon: Heart,
      color: 'from-teal-500 to-cyan-500',
      lightColor: 'from-teal-50 to-cyan-50',
      href: 'https://github.com/bohselecta/mindfulness-tech',
      status: 'research' as const,
      tags: ['Mindfulness', 'Well-being', 'Technology']
    },
    {
      id: 'social-impact-tools',
      name: 'Social Impact Tools',
      category: 'civic' as const,
      tagline: 'Tools for social change',
      description: 'Technology tools designed to create positive social impact and address societal challenges.',
      icon: Users,
      color: 'from-blue-500 to-indigo-500',
      lightColor: 'from-blue-50 to-indigo-50',
      href: 'https://github.com/bohselecta/social-impact-tools',
      status: 'research' as const,
      tags: ['Social Impact', 'Change', 'Society']
    },
    {
      id: 'collaborative-tools',
      name: 'Collaborative Tools',
      category: 'civic' as const,
      tagline: 'Enhancing collaboration',
      description: 'Tools for enhancing collaboration, teamwork, and collective intelligence.',
      icon: Network,
      color: 'from-purple-500 to-pink-500',
      lightColor: 'from-purple-50 to-pink-50',
      href: 'https://github.com/bohselecta/collaborative-tools',
      status: 'research' as const,
      tags: ['Collaboration', 'Teamwork', 'Collective Intelligence']
    }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
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
