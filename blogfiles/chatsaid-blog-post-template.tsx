// components/BlogPostTemplate.tsx
// Template for individual blog posts
'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Clock, Tag, Share2, Bookmark, 
  Twitter, Linkedin, Link as LinkIcon, ChevronRight,
  MessageCircle, ThumbsUp, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

interface BlogPostProps {
  // Meta
  title: string;
  subtitle?: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  date: string;
  readTime: string;
  category: 'therapy' | 'civic' | 'research' | 'technical' | 'philosophy';
  tags: string[];
  
  // Content
  coverImage?: string;
  content: string; // HTML content or MDX
  
  // Optional sections
  tableOfContents?: Array<{
    title: string;
    id: string;
    level: number;
  }>;
  
  relatedPosts?: Array<{
    title: string;
    slug: string;
    excerpt: string;
    date: string;
  }>;
  
  citations?: Array<{
    id: string;
    text: string;
    url?: string;
  }>;
}

export default function BlogPostTemplate({
  title,
  subtitle,
  author,
  authorBio,
  authorImage,
  date,
  readTime,
  category,
  tags,
  coverImage,
  content,
  tableOfContents,
  relatedPosts,
  citations
}: BlogPostProps) {
  const [copied, setCopied] = useState(false);

  const categoryColors = {
    therapy: { bg: 'bg-rose-100', text: 'text-rose-700' },
    civic: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
    research: { bg: 'bg-amber-100', text: 'text-amber-700' },
    technical: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
    philosophy: { bg: 'bg-purple-100', text: 'text-purple-700' }
  };

  const handleShare = async (platform: 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const text = `${title} by ${author}`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'copy') {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Blog</span>
            </Link>
            
            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
                title="Share on Twitter"
              >
                <Twitter size={20} />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 text-gray-600 hover:text-blue-700 transition-colors"
                title="Share on LinkedIn"
              >
                <Linkedin size={20} />
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title={copied ? 'Copied!' : 'Copy link'}
              >
                {copied ? <ChevronRight size={20} /> : <LinkIcon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero/Cover */}
      {coverImage && (
        <div className="relative h-[400px] overflow-hidden">
          <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-8">
            {/* Article Header */}
            <header className="mb-8">
              {/* Category Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${categoryColors[category].bg} ${categoryColors[category].text}`}>
                  {category}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {readTime}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {title}
              </h1>

              {/* Subtitle */}
              {subtitle && (
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  {subtitle}
                </p>
              )}

              {/* Author */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                {authorImage ? (
                  <img 
                    src={authorImage} 
                    alt={author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {author.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-gray-900">{author}</div>
                  {authorBio && (
                    <div className="text-sm text-gray-600">{authorBio}</div>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-6">
                {tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-gray-900 prose-pre:text-gray-100
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:py-3 prose-blockquote:px-6 prose-blockquote:italic
                prose-ul:my-6 prose-li:my-2
                prose-img:rounded-xl prose-img:shadow-lg"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Citations */}
            {citations && citations.length > 0 && (
              <section className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">References & Citations</h3>
                <div className="space-y-4">
                  {citations.map((citation) => (
                    <div key={citation.id} className="bg-gray-50 rounded-lg p-4 text-sm">
                      <span className="font-semibold text-gray-900">[{citation.id}]</span>
                      <span className="text-gray-700 ml-2">{citation.text}</span>
                      {citation.url && (
                        <a 
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-indigo-600 hover:underline inline-flex items-center gap-1"
                        >
                          Link
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Author Bio (Expanded) */}
            {authorBio && (
              <section className="mt-12 pt-8 border-t border-gray-200">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border-2 border-indigo-200">
                  <div className="flex items-start gap-6">
                    {authorImage ? (
                      <img 
                        src={authorImage} 
                        alt={author}
                        className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                        {author.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">About {author}</h4>
                      <p className="text-gray-700 leading-relaxed">{authorBio}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Related Posts */}
            {relatedPosts && relatedPosts.length > 0 && (
              <section className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.map((post, idx) => (
                    <Link
                      key={idx}
                      href={`/blog/${post.slug}`}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-6 border-2 border-gray-100 hover:border-indigo-200"
                    >
                      <div className="text-xs text-gray-500 mb-2">
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              {tableOfContents && tableOfContents.length > 0 && (
                <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MessageCircle size={20} className="text-indigo-600" />
                    Contents
                  </h3>
                  <nav className="space-y-2">
                    {tableOfContents.map((item, idx) => (
                      <a
                        key={idx}
                        href={`#${item.id}`}
                        className={`block text-sm text-gray-700 hover:text-indigo-600 transition-colors ${
                          item.level === 2 ? 'pl-0 font-medium' : 'pl-4'
                        }`}
                      >
                        {item.title}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Share Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Share2 size={20} />
                  Share Article
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/20 rounded-xl py-3 px-4 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Twitter size={18} />
                    Tweet this
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/20 rounded-xl py-3 px-4 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Linkedin size={18} />
                    Share on LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/20 rounded-xl py-3 px-4 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <ChevronRight size={18} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <LinkIcon size={18} />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Newsletter CTA */}
              <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">Stay Updated</h3>
                <p className="text-sm text-gray-700 mb-4">
                  Get notified when we publish new articles.
                </p>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-lg mb-3 text-sm focus:border-indigo-400 focus:outline-none"
                />
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-md transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
