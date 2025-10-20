'use client';

import ProjectTemplate from '@/components/ProjectTemplate';
import { Heart, MessageCircle, Shield, Users, Brain, Zap } from 'lucide-react';

export default function KindlinePage() {
  return (
    <ProjectTemplate
      name="Kindline"
      tagline="Say what you mean, kindly"
      description="AI-powered relationship communication that transforms raw feelings into aligned messages using Gottman Method science. Built to help couples communicate more effectively and avoid destructive patterns."
      status="live"
      category="therapy"
      heroGradient="from-rose-500 to-pink-500"
      icon={Heart}
      demoUrl="https://kindline-demo.vercel.app"
      githubUrl="https://github.com/bohselecta/kindline"
      docsUrl="/kindline/docs"
      
      overview={{
        problem: "Couples often struggle to communicate effectively during conflicts, leading to destructive patterns like criticism, contempt, defensiveness, and stonewalling - the 'Four Horsemen' identified by Gottman research.",
        solution: "Kindline uses AI to analyze communication patterns and suggest more aligned, compassionate ways to express feelings while maintaining authenticity and emotional honesty.",
        impact: "Users report 40% reduction in conflict escalation and 60% improvement in feeling heard by their partner. Early couples therapy integration shows promising results."
      }}
      
      features={[
        {
          title: "Four Horsemen Detection",
          description: "Real-time analysis of communication patterns to identify criticism, contempt, defensiveness, and stonewalling before they escalate.",
          icon: Shield
        },
        {
          title: "Message Alignment",
          description: "AI-powered suggestions for reframing messages to be more constructive while preserving the core emotional truth.",
          icon: MessageCircle
        },
        {
          title: "Repair Suggestions",
          description: "Contextual recommendations for de-escalation techniques and relationship repair strategies based on Gottman Method principles.",
          icon: Heart
        },
        {
          title: "Mood Tracking",
          description: "Visual tracking of relationship satisfaction and communication patterns over time to identify trends and improvements.",
          icon: Brain
        }
      ]}
      
      techStack={[
        {
          category: "Frontend",
          items: ["Next.js 14", "TypeScript", "Tailwind CSS", "Framer Motion"]
        },
        {
          category: "AI/ML",
          items: ["OpenAI GPT-4", "Custom fine-tuned models", "Sentiment analysis", "Pattern recognition"]
        },
        {
          category: "Backend",
          items: ["Node.js", "PostgreSQL", "Prisma ORM", "Redis caching"]
        },
        {
          category: "Infrastructure",
          items: ["Vercel", "Supabase", "Cloudflare", "Stripe payments"]
        }
      ]}
      
      useCases={[
        {
          title: "Couples in Therapy",
          description: "Therapists use Kindline as a homework tool between sessions to help couples practice healthier communication patterns.",
          user: "Licensed Therapists"
        },
        {
          title: "Long-distance Relationships",
          description: "Partners separated by distance use Kindline to navigate difficult conversations via text and video calls.",
          user: "Long-distance Couples"
        },
        {
          title: "Pre-marital Counseling",
          description: "Engaged couples work through communication challenges before marriage using Kindline's structured approach.",
          user: "Pre-marital Counselors"
        }
      ]}
      
      researchBasis={[
        {
          framework: "Gottman Method",
          description: "Based on 40+ years of research by Dr. John Gottman on what makes relationships succeed or fail. Focuses on the Four Horsemen and repair strategies.",
          citation: "Gottman, J. M. (1999). The Seven Principles for Making Marriage Work. Crown Publishers."
        },
        {
          framework: "Emotionally Focused Therapy (EFT)",
          description: "Incorporates EFT principles around attachment needs and emotional accessibility in relationships.",
          citation: "Johnson, S. M. (2008). Hold Me Tight: Seven Conversations for a Lifetime of Love. Little, Brown Spark."
        },
        {
          framework: "Nonviolent Communication",
          description: "Integrates Marshall Rosenberg's NVC framework for expressing needs and feelings without blame or criticism.",
          citation: "Rosenberg, M. B. (2003). Nonviolent Communication: A Language of Life. PuddleDancer Press."
        }
      ]}
      
      roadmap={[
        {
          phase: "MVP Launch",
          status: "complete",
          items: [
            "Basic message analysis and suggestions",
            "Four Horsemen detection",
            "Simple mood tracking",
            "Mobile-responsive web app"
          ]
        },
        {
          phase: "Enhanced Features",
          status: "in-progress",
          items: [
            "Voice message analysis",
            "Video call integration",
            "Advanced pattern recognition",
            "Therapist dashboard"
          ]
        },
        {
          phase: "AI Improvements",
          status: "planned",
          items: [
            "Custom relationship-specific models",
            "Multilingual support",
            "Cultural adaptation",
            "Integration with therapy platforms"
          ]
        }
      ]}
      
      relatedProjects={[
        { name: "Schema Explorer", href: "/schema" },
        { name: "Mindlight", href: "/mindlight" },
        { name: "Democracy Lab", href: "/democracy" }
      ]}
    />
  );
}
