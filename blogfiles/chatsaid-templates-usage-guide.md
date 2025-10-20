// USAGE_EXAMPLES.md
# ChatSaid Templates - Usage Guide

This guide shows how to use the project and blog templates with real content.

## 📦 What You Have

1. **ProjectTemplate.tsx** - For individual project pages
2. **BlogIndex.tsx** - Blog listing with categories/search
3. **BlogPostTemplate.tsx** - Individual blog post pages

---

## 🎯 Project Template Example

### Example: Kindline Project Page

```tsx
// app/kindline/page.tsx
import ProjectTemplate from '@/components/ProjectTemplate';
import { Heart, MessageCircle, TrendingUp, Shield, Users, Zap } from 'lucide-react';

export default function KindlinePage() {
  return (
    <ProjectTemplate
      name="Kindline"
      tagline="Say what you mean, kindly"
      description="AI-powered relationship communication that transforms raw feelings into aligned messages using Gottman Method science. Build stronger connections through better conversations."
      status="live"
      category="therapy"
      heroGradient="from-rose-500 to-pink-500"
      icon={Heart}
      
      // Links
      demoUrl="https://kindline.chatsaid.com"
      githubUrl="https://github.com/yourusername/kindline"
      docsUrl="/docs/kindline"
      
      // Overview
      overview={{
        problem: "Couples struggle with destructive communication patterns (Four Horsemen: criticism, contempt, defensiveness, stonewalling). Emotional flooding leads to fights that damage trust.",
        solution: "AI alignment engine detects harmful patterns in real-time and rewrites messages to be clear, specific, and non-blaming while preserving intent. Built on 40+ years of Gottman research.",
        impact: "Users report 60% reduction in conflict escalation and measurable increase in repair attempts. Makes evidence-based communication techniques accessible in the moment."
      }}
      
      // Features
      features={[
        {
          title: 'Message Alignment',
          description: 'AI rewrites raw feelings into I-statements with concrete requests. Preserves your truth while removing blame and attack.',
          icon: MessageCircle
        },
        {
          title: 'Four Horsemen Detection',
          description: 'Real-time flags for criticism, contempt, defensiveness, and stonewalling before you hit send.',
          icon: Shield
        },
        {
          title: 'Repair Suggestions',
          description: 'Context-aware scripts for de-escalation, time-outs, and acknowledgments. Turn fights into conversations.',
          icon: Users
        },
        {
          title: 'Needs & Wants Analyzer',
          description: '14-item assessment mapping relationship needs (security, autonomy, fairness, play, rest) with personalized action scripts.',
          icon: TrendingUp
        },
        {
          title: 'Mood Timeline',
          description: 'Track emotional patterns over time. Discover your best windows for difficult conversations.',
          icon: TrendingUp
        },
        {
          title: 'Privacy-First',
          description: 'Local-first storage with optional E2EE. Your conversations stay yours.',
          icon: Shield
        }
      ]}
      
      // Tech Stack
      techStack={[
        {
          category: 'Frontend',
          items: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS']
        },
        {
          category: 'AI',
          items: ['DeepSeek v3.2-exp', 'OpenAI-compatible API', 'Custom alignment prompts']
        },
        {
          category: 'Storage',
          items: ['IndexedDB (local-first)', 'Optional Vercel KV', 'E2EE with SubtleCrypto']
        }
      ]}
      
      // Use Cases
      useCases={[
        {
          title: 'Pre-Flight Check',
          description: 'Write your angry message. See it aligned. Decide if you still want to send it.',
          user: 'Individual'
        },
        {
          title: 'Couple Communication',
          description: 'Both partners use the app. Messages get aligned before delivery. Build skills through practice.',
          user: 'Couples'
        },
        {
          title: 'Therapy Homework',
          description: 'Therapists assign Kindline between sessions. Clients practice Gottman techniques in real conversations.',
          user: 'Therapy Clients'
        }
      ]}
      
      // Research Basis
      researchBasis={[
        {
          framework: 'Gottman Method',
          description: 'Four Horsemen framework, repair attempts, emotional bids. 40+ years of research on couple communication.',
          citation: 'Gottman, J. M., & Silver, N. (1999). The Seven Principles for Making Marriage Work.'
        },
        {
          framework: 'Nonviolent Communication (NVC)',
          description: 'Observation-Feeling-Need-Request structure. Empathy over judgment.',
          citation: 'Rosenberg, M. B. (2015). Nonviolent Communication: A Language of Life.'
        }
      ]}
      
      // Roadmap
      roadmap={[
        {
          phase: 'Phase 1: Core Features',
          status: 'complete',
          items: [
            'Message alignment with DeepSeek',
            'Four Horsemen detection',
            'Repair suggestions',
            'Mood pings'
          ]
        },
        {
          phase: 'Phase 2: Advanced',
          status: 'in-progress',
          items: [
            'Needs & Wants Analyzer',
            'Rhythm Coach with metrics',
            'Pattern insights',
            'Weekly coaching cards'
          ]
        },
        {
          phase: 'Phase 3: Scale',
          status: 'planned',
          items: [
            'Real-time sync',
            'Therapist dashboard',
            'Multiple language support',
            'Voice interface'
          ]
        }
      ]}
      
      relatedProjects={[
        { name: 'Schema Explorer', href: '/schema' },
        { name: 'Mindlight', href: '/mindlight' }
      ]}
    />
  );
}
```

---

## 📝 Blog Post Example

### Example: Blog Post Page

```tsx
// app/blog/[slug]/page.tsx
import BlogPostTemplate from '@/components/BlogPostTemplate';

// This would typically come from your CMS or markdown files
export default function BlogPost() {
  const content = `
    <h2 id="introduction">Introduction</h2>
    <p>
      When we started building Kindline, we had a simple question: could AI help couples 
      communicate better? Not by replacing human connection, but by catching destructive 
      patterns before they escalate.
    </p>
    
    <p>
      The answer, we learned, is nuanced. AI is exceptional at pattern recognition—
      spotting the "Four Horsemen" that John Gottman identified as predictors of 
      relationship breakdown. But the real magic happens in the translation.
    </p>
    
    <h2 id="the-problem">The Problem with Conflict</h2>
    <p>
      Research shows that it's not conflict itself that damages relationships—it's 
      <em>how</em> couples fight. Gottman's studies found four communication patterns 
      that predict divorce with 90%+ accuracy:
    </p>
    
    <ul>
      <li><strong>Criticism</strong> - Attacking character vs. addressing behavior</li>
      <li><strong>Contempt</strong> - Superiority, mockery, disrespect</li>
      <li><strong>Defensiveness</strong> - Making excuses, counter-attacking</li>
      <li><strong>Stonewalling</strong> - Withdrawing, shutting down</li>
    </ul>
    
    <p>
      The challenge: these patterns are hard to catch in the moment. Emotional flooding 
      hijacks our prefrontal cortex. We say things we regret.
    </p>
    
    <h2 id="the-alignment-engine">Building the Alignment Engine</h2>
    <p>
      Our approach: intercept messages <em>before</em> they're sent. Give people a 
      chance to see their words through a clearer lens.
    </p>
    
    <blockquote>
      "You never listen to me! You're so selfish." 
      <br/><br/>
      → AI detects: Criticism (character attack), Contempt
      <br/><br/>
      → Aligned: "I've noticed that when I share things that matter to me, I sometimes 
      feel unheard. Could we set aside 15 minutes tonight to talk about my day?"
    </blockquote>
    
    <p>
      Same core message. Same feelings. But structured as observation + feeling + 
      need + request. This is the NVC (Nonviolent Communication) framework, 
      operationalized through AI.
    </p>
    
    <h3>Technical Implementation</h3>
    <p>
      We use DeepSeek v3.2-exp with custom prompts that enforce:
    </p>
    
    <ol>
      <li>Concrete observations (not mind-reading)</li>
      <li>I-statements (ownership of feelings)</li>
      <li>Specific requests (actionable, time-bound)</li>
      <li>Brevity (45-120 words to prevent rambling)</li>
    </ol>
    
    <pre><code>const ALIGNMENT_PROMPT = \`
You are a relationship alignment translator. 
Rewrite to be clear, specific, non-blaming...
Prohibit contempt, character attacks, ultimatums...
\`;</code></pre>
    
    <h2 id="early-results">Early Results</h2>
    <p>
      In beta testing with 50 couples:
    </p>
    
    <ul>
      <li>60% reduction in Four Horsemen flags after 2 weeks</li>
      <li>Users report feeling "heard" more often</li>
      <li>Repair attempts increased by 40%</li>
    </ul>
    
    <p>
      But the most interesting feedback? "It taught me how to think differently about 
      conflict. Now I catch myself even when not using the app."
    </p>
    
    <h2 id="whats-next">What's Next</h2>
    <p>
      We're adding a Needs & Wants Analyzer—a deeper assessment of what each partner 
      needs (security, autonomy, fairness, play). The goal: move from reactive 
      de-escalation to proactive alignment.
    </p>
    
    <p>
      We're also exploring voice interfaces. Text is great, but most conflict happens 
      in conversation. Could real-time whisper prompts help?
    </p>
    
    <h2 id="conclusion">Final Thoughts</h2>
    <p>
      AI won't save your relationship. But it can give you tools that make hard 
      conversations a little easier. That's worth building.
    </p>
  `;

  return (
    <BlogPostTemplate
      title="Building Kindline: AI-Aligned Communication for Relationships"
      subtitle="How we used the Gottman Method and LLMs to help couples fight better"
      author="ChatSaid Team"
      authorBio="Building AI-enhanced tools for mental health, civic tech, and far-out computing concepts. Based in the 'chat said' philosophy of human-AI collaboration."
      date="2025-01-15"
      readTime="8 min"
      category="therapy"
      tags={['Gottman Method', 'Relationships', 'LLMs', 'Product Design', 'Psychology']}
      
      content={content}
      
      tableOfContents={[
        { title: 'Introduction', id: 'introduction', level: 2 },
        { title: 'The Problem with Conflict', id: 'the-problem', level: 2 },
        { title: 'Building the Alignment Engine', id: 'the-alignment-engine', level: 2 },
        { title: 'Early Results', id: 'early-results', level: 2 },
        { title: "What's Next", id: 'whats-next', level: 2 },
        { title: 'Final Thoughts', id: 'conclusion', level: 2 }
      ]}
      
      relatedPosts={[
        {
          title: 'The "Chat Said" Philosophy: AI as Thought Partner',
          slug: 'chat-said-philosophy',
          excerpt: 'Reflecting on how this entire portfolio emerged from conversations with AI.',
          date: '2024-12-20'
        },
        {
          title: 'Young Schema Therapy: From Assessment to Digital Tool',
          slug: 'schema-therapy-digital-tool',
          excerpt: 'Translating clinical frameworks into self-help tools while staying evidence-based.',
          date: '2024-12-28'
        }
      ]}
      
      citations={[
        {
          id: '1',
          text: 'Gottman, J. M., & Silver, N. (1999). The Seven Principles for Making Marriage Work.',
          url: 'https://www.gottman.com/'
        },
        {
          id: '2',
          text: 'Rosenberg, M. B. (2015). Nonviolent Communication: A Language of Life.',
          url: 'https://www.cnvc.org/'
        }
      ]}
    />
  );
}
```

---

## 🗂️ File Structure

Organize your project like this:

```
app/
├── page.tsx                    # Main landing (ChatSaidLanding)
├── blog/
│   ├── page.tsx                # Blog index (BlogIndex)
│   └── [slug]/
│       └── page.tsx            # Individual posts (BlogPostTemplate)
├── kindline/
│   └── page.tsx                # Kindline project (ProjectTemplate)
├── schema/
│   └── page.tsx                # Schema Explorer project
└── democracy/
    └── page.tsx                # Democracy Lab project

components/
├── ProjectTemplate.tsx
├── BlogIndex.tsx
└── BlogPostTemplate.tsx
```

---

## 🎨 Styling Notes

### Tailwind Prose

The blog post template uses `@tailwindcss/typography`:

```bash
npm install @tailwindcss/typography
```

```js
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
```

### Custom Prose Styles

The template includes custom prose classes for better typography:

- Larger headings with proper spacing
- Indigo accent colors for links/code
- Rounded corners on images
- Better blockquote styling

---

## 📝 Content Management Options

### Option 1: MDX (Recommended)

```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
```

```tsx
// blog/posts/kindline.mdx
---
title: "Building Kindline"
date: "2025-01-15"
category: "therapy"
---

## Introduction

Your content here...
```

### Option 2: Markdown + Gray Matter

```bash
npm install gray-matter remark remark-html
```

```tsx
// lib/blog.ts
import fs from 'fs';
import matter from 'gray-matter';

export function getPostBySlug(slug: string) {
  const fileContents = fs.readFileSync(`posts/${slug}.md`, 'utf8');
  const { data, content } = matter(fileContents);
  return { frontmatter: data, content };
}
```

### Option 3: Headless CMS

- **Contentful**: Rich content modeling
- **Sanity**: Real-time editing
- **Strapi**: Self-hosted, open source

---

## 🚀 Dynamic Routes

Generate pages automatically:

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

---

## 🎯 Next Steps

1. **Set up content source** (MDX, Markdown, or CMS)
2. **Create individual project pages** using ProjectTemplate
3. **Write your first blog post** using BlogPostTemplate
4. **Add RSS feed** for blog subscribers
5. **Set up newsletter** (Mailchimp, ConvertKit, or Buttondown)
6. **Add analytics** (Plausible, Simple Analytics)

---

## 💡 Tips

### Project Pages
- Keep "Problem-Solution-Impact" concise (2-3 sentences each)
- Use real metrics in roadmap ("60% reduction" vs "improves communication")
- Link research citations properly

### Blog Posts
- Break up long paragraphs (3-4 sentences max)
- Use headings every 200-300 words
- Include images/diagrams when possible
- Write table of contents for posts >6 min read

### SEO
- Add meta tags for title, description, OG images
- Use semantic HTML (proper heading hierarchy)
- Add alt text to all images
- Create XML sitemap

---

## 🎨 Customization

Both templates are fully customizable:

```tsx
// Change colors
heroGradient="from-emerald-500 to-teal-500"  // Projects
className="prose-a:text-emerald-600"         // Blog posts

// Add sections
customSection={<YourComponent />}

// Modify layouts
// Both templates use grid-based responsive layouts
// Easy to adjust column spans and breakpoints
```

---

Happy building! 🚀
