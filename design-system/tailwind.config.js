/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Manual dark mode toggle
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Automatically maps to either Light or Dark CSS custom variables defined in root index.css
                bg: 'var(--color-bg)',
                surface: 'var(--color-surface)',
                'surface-elevated': 'var(--color-surface-elevated)',
                'surface-muted': 'var(--color-surface-muted)',

                brand: {
                    DEFAULT: 'var(--color-brand)',
                    hover: 'var(--color-brand-hover)',
                    muted: 'var(--color-brand-muted)',
                },

                text: {
                    DEFAULT: 'var(--color-text)',
                    muted: 'var(--color-text-muted)',
                    secondary: 'var(--color-text-secondary)',
                    'on-brand': 'var(--color-text-on-brand)'
                },

                border: {
                    DEFAULT: 'var(--color-border)',
                    subtle: 'var(--color-border-subtle)',
                },

                system: {
                    positive: 'var(--color-positive)',
                    negative: 'var(--color-negative)',
                    warning: 'var(--color-warning)'
                }
            },
            fontFamily: {
                display: ['Space Grotesk', 'sans-serif'],
                heading: ['Inter', 'sans-serif'],
                body: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            fontSize: {
                'display': ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
                'heading': ['24px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
                'subheading': ['18px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '600' }],
                'body-large': ['16px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
                'body': ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
                'body-small': ['12px', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '500' }],
                'caption': ['11px', { lineHeight: '1.4', letterSpacing: '0.04em', fontWeight: '600' }],
            },
            borderRadius: {
                'sm': '6px',
                'md': '12px',      // Standard card radius
                'lg': '20px',      // Large panel radius
                'full': '9999px',
            },
            boxShadow: {
                'sm': 'var(--shadow-sm)',
                'md': 'var(--shadow-md)',
                'glow-brand': 'var(--shadow-glow-brand)'
            }
        },
    },
    plugins: [],
}
