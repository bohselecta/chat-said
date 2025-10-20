# ChatSaid Landing Page

A beautiful, responsive landing page for ChatSaid - AI-powered therapy tools. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Clean, professional design with smooth animations
- **Accessibility**: Built with accessibility best practices
- **SEO Optimized**: Proper meta tags and semantic HTML
- **Performance**: Optimized for fast loading and Core Web Vitals

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chat-said
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Manual Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and Tailwind imports
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main landing page component
├── components/          # Reusable components (future)
└── lib/                 # Utility functions (future)
```

## Customization

### Colors and Branding

The design uses a carefully crafted color palette:
- Primary: Indigo/Purple gradients
- Secondary: Rose/Pink accents
- Neutral: Gray scale

### Content

Edit `src/app/page.tsx` to modify:
- Tool descriptions and features
- About section content
- Footer links and information

### Styling

Modify `tailwind.config.js` to:
- Add custom colors
- Extend animations
- Configure responsive breakpoints

## License

This project is private and proprietary.

## Support

For questions or support, please contact the development team.
