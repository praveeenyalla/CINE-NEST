import Navbar from './Navbar';
import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <div className="app-layout">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="main-content">
        {children}
      </main>

      <footer className="bg-surface-dark border-t border-white/5 py-12 text-center text-gray-500 text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <p>&copy; 2025 CINE NEST. Your AI-Powered Entertainment Hub.</p>
          <div className="flex gap-4 mt-2 justify-center">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>


    </div>
  );
}
