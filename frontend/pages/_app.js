import Head from 'next/head';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Script
        id="tailwind-cdn"
        src="https://cdn.tailwindcss.com?plugins=forms,container-queries"
        strategy="beforeInteractive"
      />
      <Script id="tailwind-config" strategy="beforeInteractive">
        {`
          tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  "primary": "#e60a15",
                  "primary-dark": "#b30009",
                  "background-light": "#f8f5f6",
                  "background-dark": "#181111", // Matching provided Hub bg
                  "surface-dark": "#271b1c",    // Matching provided Hub card bg
                  "surface-highlight": "#1E1E1E",
                  "surface-light": "#2a1a1b",
                  "border-dark": "#392829",     // Matching provided Hub border
                  "text-muted": "#ba9c9d",      // Matching provided text color
                },
                fontFamily: {
                  "display": ["Space Grotesk", "sans-serif"],
                  "sans": ["Space Grotesk", "sans-serif"],
                  "body": ["Noto Sans", "sans-serif"],
                },
                backgroundImage: {
                  'hero-gradient': 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 60%, #000000 100%)',
                },
                animation: {
                  'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  'glow': 'glow 3s ease-in-out infinite alternate',
                  'spin-slow': 'spin 12s linear infinite',
                  },
                  keyframes: {
                    glow: {
                        '0%': { boxShadow: '0 0 20px -5px #e60a15' },
                        '100%': { boxShadow: '0 0 40px 5px #e60a15' },
                    }
                  }
                },
              },
            }
        `}
      </Script>
      <Component {...pageProps} />
      <style jsx global>{`
        :root {
          --accent: #e60a15;
          --bg: #050505;
          --text: #ffffff;
        }
        body {
          margin: 0;
          padding: 0;
          background-color: var(--bg);
          color: var(--text);
          font-family: 'Space Grotesk', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        /* Global Scrollbar Styling */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #e60a15; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .glass-nav {
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .text-glow { text-shadow: 0 0 20px rgba(230, 10, 21, 0.5); }
        .orb-glow {
            background: radial-gradient(circle, rgba(230,10,21,1) 0%, rgba(230,10,21,0) 70%);
            filter: blur(40px);
            opacity: 0.6;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}

export default MyApp;
