import Layout from '../components/Layout';

export default function About() {
    return (
        <Layout>
            <div className="min-h-screen bg-background-dark text-white font-display py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl font-bold mb-8 text-primary">About CINE NEST</h1>

                    <div className="prose prose-invert max-w-none">
                        <p className="text-xl text-gray-300 leading-relaxed mb-8">
                            CINE NEST is the world's first AI-powered entertainment discovery platform that goes beyond genre tags.
                            We believe that your taste is defined by more than just "Action" or "Comedy" - it's about pacing,
                            emotional resonance, cinematography, and the subtle textures of storytelling.
                        </p>

                        <div className="grid md:grid-cols-2 gap-12 my-12">
                            <div className="bg-surface-dark p-8 rounded-2xl border border-white/5">
                                <span className="material-symbols-outlined text-4xl text-primary mb-4">psychology</span>
                                <h3 className="text-2xl font-bold mb-4">The Brain Engine</h3>
                                <p className="text-gray-400">
                                    Our proprietary AI model analyzes thousands of data points for every film in our database.
                                    From color grading to dialogue density, we map the DNA of cinema to find your perfect match.
                                </p>
                            </div>

                            <div className="bg-surface-dark p-8 rounded-2xl border border-white/5">
                                <span className="material-symbols-outlined text-4xl text-primary mb-4">hub</span>
                                <h3 className="text-2xl font-bold mb-4">Platform Agnostic</h3>
                                <p className="text-gray-400">
                                    We don't care where the content lives. Netflix, Hulu, Disney+, Prime - we aggregate it all
                                    into a single, intelligent interface so you stop searching and start watching.
                                </p>
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <p className="text-gray-300 leading-relaxed mb-8">
                            To solve the "paradox of choice" in the streaming era. We are building a future where technology
                            understands human emotion, bridging the gap between art and audience with unprecedented precision.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
