/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI",
          "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"
        ],
        serif: [
          "Source Serif", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"
        ],
        mono: [
          "JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco",
          "Consolas", "Liberation Mono", "monospace"
        ],
        display: [
          "Inter", "SF Pro Display", "Helvetica Neue", "sans-serif"
        ],
        body: [
          "IBM Plex Sans", "Inter", "sans-serif"
        ]
      },
      fontSize: {
        'step-5': 'clamp(2.75rem, 2.1rem + 2.2vw, 4.0rem)',   /* Display / H1 */
        'step-4': 'clamp(2.25rem, 1.8rem + 1.6vw, 3.0rem)',    /* H2 */
        'step-3': 'clamp(1.75rem, 1.4rem + 1.2vw, 2.25rem)',   /* H3 */
        'step-2': 'clamp(1.375rem, 1.2rem + 0.6vw, 1.6rem)',   /* H4 */
        'step-1': '1.125rem',                                   /* Lead */
        'step-0': '1rem',                                       /* Body */
        'step--1': '0.9375rem',                                 /* Small */
        'step--2': '0.8125rem',                                 /* Micro */
      },
      letterSpacing: {
        'tight-display': '-0.025em',
        'tight-heading': '-0.015em',
        'micro-caps': '0.04em',
        'small-caps': '0.02em',
        'mono': '0.01em',
      },
      lineHeight: {
        'display': '1.1',
        'heading': '1.3',
        'subheading': '1.4',
        'body': '1.6',
        'relaxed': '1.65',
        'caption': '1.5',
        'mono': '1.4',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            lineHeight: '1.6',
            letterSpacing: '0',
            a: {
              color: '#4f46e5',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            h1: {
              color: '#111827',
              fontWeight: '600',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
              lineHeight: '1.1',
              letterSpacing: '-0.025em',
            },
            h2: {
              color: '#111827',
              fontWeight: '600',
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              lineHeight: '1.3',
              letterSpacing: '-0.015em',
            },
            h3: {
              color: '#111827',
              fontWeight: '500',
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              lineHeight: '1.4',
              letterSpacing: '0',
            },
            h4: {
              color: '#111827',
              fontWeight: '500',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.375rem, 1.2rem + 0.6vw, 1.6rem)',
              lineHeight: '1.4',
            },
            code: {
              color: '#e11d48',
              backgroundColor: '#f3f4f6',
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '3px',
              fontWeight: '500',
              fontFamily: 'var(--font-mono)',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            blockquote: {
              fontFamily: 'var(--font-mono)',
              fontSize: '0.9rem',
              letterSpacing: '0.01em',
              fontStyle: 'normal',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
