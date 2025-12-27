import React from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';

const About = () => {
    return (
        <Layout>
            <Head>
                <title>About Us | CINE NEST</title>
            </Head>

            <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-16">

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-6 mb-20 text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        REDEFINING <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">ENTERTAINMENT</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        CINE NEST is not just a streaming platform; it's an intelligent ecosystem powered by advanced AI to curate, analyze, and deliver personalized content experiences like never before.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all group">
                        <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl text-cyan-400">smart_toy</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">AI-Driven Curation</h3>
                        <p className="text-gray-400">Our proprietary algorithms analyze your viewing habits to suggest content that perfectly matches your mood and taste.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-all group">
                        <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl text-purple-400">analytics</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Deep Analytics</h3>
                        <p className="text-gray-400">Gain insights into your viewing patterns. See what genres you love, how much time you spend, and compare with global trends.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-green-500/30 transition-all group">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl text-green-400">rocket_launch</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Seamless Performance</h3>
                        <p className="text-gray-400">Built on a modern tech stack ensuring lightning-fast load times, smooth transitions, and a premium user interface.</p>
                    </div>
                </div>

                {/* Payment & Plans Section */}
                <div className="bg-gradient-to-b from-transparent to-black/80 py-20 border-y border-white/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-gray-400">Choose the plan that fits your entertainment lifestyle.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* Basic Plan */}
                            <div className="p-8 rounded-2xl bg-[#111] border border-white/10 hover:border-white/20 transition-all relative overflow-hidden">
                                <h3 className="text-xl font-bold text-gray-300 mb-2">Basic</h3>
                                <div className="text-4xl font-bold text-white mb-6">$9.99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                                <ul className="space-y-4 text-gray-400 mb-8 user-select-none">
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-white text-sm">check</span> HD Streaming</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-white text-sm">check</span> 1 Device</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-white text-sm">check</span> Ad-supported</li>
                                </ul>
                                <button className="w-full py-3 rounded-lg border border-white/20 hover:bg-white hover:text-black transition-all font-bold">Select Basic</button>
                            </div>

                            {/* Standard Plan */}
                            <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all transform scale-105 z-10 relative">
                                <div className="absolute top-0 right-0 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                                <h3 className="text-xl font-bold text-cyan-400 mb-2">Standard</h3>
                                <div className="text-4xl font-bold text-white mb-6">$14.99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                                <ul className="space-y-4 text-gray-300 mb-8">
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-cyan-400 text-sm">check</span> Full HD Streaming</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-cyan-400 text-sm">check</span> 2 Devices</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-cyan-400 text-sm">check</span> Ad-free Experience</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-cyan-400 text-sm">check</span> Offline Downloads</li>
                                </ul>
                                <button className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-black transition-all font-bold shadow-lg shadow-cyan-500/20">Select Standard</button>
                            </div>

                            {/* Premium Plan */}
                            <div className="p-8 rounded-2xl bg-[#111] border border-white/10 hover:border-white/20 transition-all relative overflow-hidden">
                                <h3 className="text-xl font-bold text-purple-400 mb-2">Premium</h3>
                                <div className="text-4xl font-bold text-white mb-6">$19.99<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                                <ul className="space-y-4 text-gray-400 mb-8">
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-purple-400 text-sm">check</span> 4K Ultra HD + HDR</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-purple-400 text-sm">check</span> 4 Devices</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-purple-400 text-sm">check</span> Spatial Audio</li>
                                    <li className="flex items-center gap-3"><span className="material-symbols-outlined text-purple-400 text-sm">check</span> Early Access to Content</li>
                                </ul>
                                <button className="w-full py-3 rounded-lg border border-purple-500/50 hover:bg-purple-500 hover:text-white transition-all font-bold text-purple-400">Select Premium</button>
                            </div>
                        </div>

                        <div className="mt-12 text-center">
                            <p className="text-sm text-gray-500">Secure payment processing powered by Stripe. We accept all major credit cards and digital wallets.</p>
                            <div className="flex justify-center gap-4 mt-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                                <span className="material-symbols-outlined text-3xl">credit_card</span>
                                <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About Application Tech Stack Info */}
                <div className="max-w-4xl mx-auto px-6 mt-32">
                    <div className="bg-[#111] p-8 rounded-2xl border border-white/10">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-gray-400">code</span>
                            Application Architecture
                        </h3>
                        <p className="text-gray-400 mb-6">
                            This platform is engineered using a robust Next.js frontend coupled with a high-performance Python FastAPI backend. Data persistence is managed by MongoDB, ensuring scalability for millions of user records and content metadata.
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-black rounded-lg border border-white/5 text-center">
                                <span className="block text-white font-bold mb-1">Next.js</span>
                                <span className="text-xs text-gray-500">Frontend</span>
                            </div>
                            <div className="p-4 bg-black rounded-lg border border-white/5 text-center">
                                <span className="block text-white font-bold mb-1">FastAPI</span>
                                <span className="text-xs text-gray-500">Backend</span>
                            </div>
                            <div className="p-4 bg-black rounded-lg border border-white/5 text-center">
                                <span className="block text-white font-bold mb-1">MongoDB</span>
                                <span className="text-xs text-gray-500">Database</span>
                            </div>
                            <div className="p-4 bg-black rounded-lg border border-white/5 text-center">
                                <span className="block text-white font-bold mb-1">TailwindCSS</span>
                                <span className="text-xs text-gray-500">Styling</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    );
};

export default About;
