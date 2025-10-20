// app/blog/page.tsx
'use client';

import React, { useState } from 'react';
import { 
  Search, Calendar, Clock, ArrowRight, Filter, Tag, 
  TrendingUp, BookOpen, Brain, Scale, Lightbulb, Heart,
  ExternalLink, Bookmark
} from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: 'therapy' | 'civic' | 'research' | 'technical' | 'philosophy';
  tags: string[];
  featured?: boolean;
  coverImage?: string;
  slug: string;
}

export default function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Example blog posts - replace with your actual data
  const posts: BlogPost[] = [
    {
      id: '1',
      title: 'Building Kindline: AI-Aligned Communication for Relationships',
      excerpt: 'How we used the Gottman Method and LLMs to create a tool that helps couples communicate more effectively. Lessons learned from implementing the Four Horsemen detection.',
      author: 'ChatSaid Team',
      date: '2025-01-15',
      readTime: '8 min',
      category: 'therapy',
      tags: ['Gottman Method', 'LLMs', 'Relationships', 'Product'],
      featured: true,
      slug: 'building-kindline-ai-communication'
    },
    {
      id: '2',
      title: 'Fractal Data Structures: A New Paradigm for Information Organization',
      excerpt: 'Exploring self-similar topologies for data storage and retrieval. What if information could be organized like coastlines and ferns?',
      author: 'ChatSaid Research',
      date: '2025-01-10',
      readTime: '12 min',
      category: 'research',
      tags: ['Fractals', 'Data Structures', 'Theory'],
      featured: true,
      slug: 'fractal-data-structures'
    },
    {
      id: '3',
      title: 'Democracy Tooling in the Age of AI',
      excerpt: 'Can AI help us build better democratic institutions? Thoughts on participatory governance, transparency, and the role of technology in civic life.',
      author: 'ChatSaid Team',
      date: '2025-01-05',
      readTime: '6 min',
      category: 'civic',
      tags: ['Democracy', 'Governance', 'AI Ethics'],
      slug: 'democracy-tooling-ai'
    },
    {
      id: '4',
      title: 'Young Schema Therapy: From Assessment to Digital Tool',
      excerpt: 'Translating clinical frameworks into self-help tools. How we built Schema Explorer while staying true to evidence-based practice.',
      author: 'ChatSaid Team',
      date: '2024-12-28',
      readTime: '10 min',
      category: 'therapy',
      tags: ['Schema Therapy', 'Clinical Psychology', 'Digital Health'],
      slug: 'schema-therapy-digital-tool'
    },
    {
      id: '5',
      title: 'The "Chat Said" Philosophy: AI as Thought Partner',
      excerpt: 'Reflecting on how this entire portfolio emerged from conversations with AI. What it means to collaborate with language models on ambitious projects.',
      author: 'ChatSaid Team',
      date: '2024-12-20',
      readTime: '7 min',
      category: 'philosophy',
      tags: ['AI', 'Collaboration', 'Creativity'],
      featured: true,
      slug: 'chat-said-philosophy'
    }
  ];

  const categories = [
    { id: 'therapy', label: 'Therapy Tools', icon: Heart, color: 'rose' },
    { id: 'civic', label: 'Civic Tech', icon: Scale, color: 'emerald' },
    { id: 'research', label: 'Research', icon: Lightbulb, color: 'amber' },
    { id: 'technical', label: 'Technical', icon: Brain, color: 'indigo' },
    { id: 'philosophy', label: 'Philosophy', icon: BookOpen, color: 'purple' }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = posts.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowRight className="rotate-180" size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>
          
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog & Writings</h1>
              <p className="text-lg text-gray-600">
                Explorations in AI, therapy tools, civic tech, and computing research
              </p>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
              <BookOpen size={16} />
              <span>{posts.length} articles</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search articles, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !selectedCategory
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              All
            </button>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? `bg-${cat.color}-100 text-${cat.color}-700 border-2 border-${cat.color}-300`
                      : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Posts */}
        {!selectedCategory && !searchQuery && featuredPosts.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-indigo-600" size={24} />
              <h2 className="text-2xl font-bold text-gray-900">Featured</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.slice(0, 2).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border-2 border-gray-100 hover:border-indigo-200"
                >
                  {post.coverImage ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.coverImage} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                      <BookOpen className="text-white" size={48} />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                        post.category === 'therapy' ? 'bg-rose-100 text-rose-700' :
                        post.category === 'civic' ? 'bg-emerald-100 text-emerald-700' :
                        post.category === 'research' ? 'bg-amber-100 text-amber-700' :
                        post.category === 'technical' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {post.category}
                      </span>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <ArrowRight className="text-indigo-600 group-hover:translate-x-1 transition-transform" size={20} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.label : 'All Articles'}
            </h2>
            <span className="text-sm text-gray-600">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
              <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600">No articles found. Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border-2 border-gray-100 hover:border-gray-200"
                >
                  <div className="flex items-start gap-6">
                    {/* Thumbnail */}
                    {post.coverImage ? (
                      <div className="w-32 h-32 rounded-xl overflow-hidden flex-shrink-0 hidden md:block">
                        <img 
                          src={post.coverImage} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className={`w-32 h-32 rounded-xl flex items-center justify-center flex-shrink-0 hidden md:block ${
                        post.category === 'therapy' ? 'bg-gradient-to-br from-rose-100 to-pink-100' :
                        post.category === 'civic' ? 'bg-gradient-to-br from-emerald-100 to-teal-100' :
                        post.category === 'research' ? 'bg-gradient-to-br from-amber-100 to-orange-100' :
                        post.category === 'technical' ? 'bg-gradient-to-br from-indigo-100 to-blue-100' :
                        'bg-gradient-to-br from-purple-100 to-pink-100'
                      }`}>
                        <BookOpen className={
                          post.category === 'therapy' ? 'text-rose-600' :
                          post.category === 'civic' ? 'text-emerald-600' :
                          post.category === 'research' ? 'text-amber-600' :
                          post.category === 'technical' ? 'text-indigo-600' :
                          'text-purple-600'
                        } size={32} />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                          post.category === 'therapy' ? 'bg-rose-100 text-rose-700' :
                          post.category === 'civic' ? 'bg-emerald-100 text-emerald-700' :
                          post.category === 'research' ? 'bg-amber-100 text-amber-700' :
                          post.category === 'technical' ? 'bg-indigo-100 text-indigo-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {post.category}
                        </span>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed mb-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1">
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="text-indigo-600 group-hover:translate-x-1 transition-transform flex-shrink-0 hidden lg:block" size={24} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-center text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Get notified when we publish new articles on AI, therapy tools, civic tech, and computing research.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
