import { useState } from 'react';
import Layout from '../components/Layout';
import { sendEmail } from '../utils/mail';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        const result = await sendEmail(formData);

        if (result.success) {
            setStatus('sent');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus(''), 5000);
        } else {
            console.error(result.error);
            setStatus('error');
            alert('Failed to send message: ' + (result.error || 'Unknown error'));
            setStatus('');
        }
    };


    return (
        <Layout>
            <div className="min-h-screen bg-background-dark text-white font-display py-20 px-6">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-gray-400">Have questions about the Brain Engine? Feedback on our recommendations? We'd love to hear from you.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-surface-dark p-8 rounded-2xl border border-white/5 shadow-xl">
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/80 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors placeholder-gray-500"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-black/80 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors placeholder-gray-500"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                                <select
                                    className="w-full bg-black/80 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option value="" className="bg-gray-900 text-white">Select a topic</option>
                                    <option value="support" className="bg-gray-900 text-white">Technical Support</option>
                                    <option value="feedback" className="bg-gray-900 text-white">Feedback & Suggestions</option>
                                    <option value="business" className="bg-gray-900 text-white">Business Inquiries</option>
                                    <option value="other" className="bg-gray-900 text-white">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                                <textarea
                                    required
                                    rows="5"
                                    className="w-full bg-black/80 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder-gray-500"
                                    placeholder="How can we help you?"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending' || status === 'sent'}
                                className={`w-full py-4 rounded-lg font-bold text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-2
                  ${status === 'sent'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-primary text-white hover:bg-red-700 shadow-[0_0_20px_rgba(230,10,21,0.3)] hover:shadow-[0_0_30px_rgba(230,10,21,0.6)]'
                                    }`}
                            >
                                {status === 'sending' ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin">refresh</span>
                                        Sending...
                                    </>
                                ) : status === 'sent' ? (
                                    <>
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Message Sent!
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">send</span>
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
                        <div className="p-4">
                            <span className="material-symbols-outlined text-3xl text-primary mb-2">mail</span>
                            <p className="text-sm text-gray-400">support@cinenest.ai</p>
                        </div>
                        <div className="p-4">
                            <span className="material-symbols-outlined text-3xl text-primary mb-2">location_on</span>
                            <p className="text-sm text-gray-400">Silicon Valley, CA</p>
                        </div>
                        <div className="p-4">
                            <span className="material-symbols-outlined text-3xl text-primary mb-2">schedule</span>
                            <p className="text-sm text-gray-400">24/7 AI Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
