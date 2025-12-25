import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../components/Layout';
import { API_URL } from '../config/api';

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            // If we can't reach the server at all
            if (!response) {
                throw new Error('Cannot connect to server. Please make sure the backend is running.');
            }

            const data = await response.json();

            if (response.ok) {
                // Auto-login
                localStorage.setItem('userToken', data.access_token);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('username', data.username);
                window.location.href = '/';
            } else {
                // Show the server's error message
                throw new Error(data.detail || `Signup failed (Error ${response.status})`);
            }
        } catch (err) {
            // Handle both network errors and server errors
            if (err.message === 'Failed to fetch') {
                setError('Cannot connect to server. Please check if the backend is running on port 8000.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Head>
                <title>Create Account | CINE NEST</title>
            </Head>

            <div className="signup-container">
                <div className="signup-box">
                    <h1>Create your account</h1>
                    <p>Join CINE NEST - Your AI-powered entertainment destination.</p>
                    <form onSubmit={handleSubmit}>
                        {error && <div className="error-message">{error}</div>}
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="signup-btn" disabled={loading}>
                            {loading ? 'Setting up account...' : 'Create Account & Start Watching'}
                        </button>
                    </form>

                    <div className="signup-footer">
                        <p>Already have an account? <Link href="/login">Sign In.</Link></p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .signup-container {
          min-height: 90vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://assets.nflxext.com/ffe/siteui/vlv3/f8ca36a4-acec-4adc-9511-2a1d0a2db771/67119a00-cb69-4a36-8208-f4c0177728b7/US-en-20220523-popsignuptwelve-perspective_alpha_website_medium.jpg');
          background-size: cover;
          background-position: center;
          color: white;
        }
        .signup-box {
          background: rgba(0, 0, 0, 0.85);
          width: 100%;
          max-width: 450px;
          padding: 60px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        h1 { font-size: 2.2rem; font-weight: 900; margin-bottom: 12px; }
        p { font-size: 1.1rem; margin-bottom: 30px; color: #ccc; }
        .error-message {
          background: #e87c03;
          color: white;
          padding: 12px 20px;
          border-radius: 4px;
          margin-bottom: 20px;
          font-size: 0.9rem;
        }
        input {
          width: 100%;
          padding: 16px 20px;
          background: #333;
          border: 1px solid transparent;
          border-radius: 4px;
          color: white;
          font-size: 1rem;
          margin-bottom: 16px;
          outline: none;
          transition: 0.3s;
        }
        input:focus { background: #454545; border-color: #e50914; }
        .signup-btn {
          width: 100%;
          padding: 16px;
          background: #e50914;
          color: white;
          border: none;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          border-radius: 4px;
          margin-top: 10px;
          transition: 0.3s;
        }
        .signup-btn:hover { background: #b20710; transform: translateY(-2px); }
        .signup-footer { margin-top: 40px; font-size: 1rem; color: #737373; text-align: center; }
        .signup-footer :global(a) { color: white; text-decoration: none; font-weight: bold; }
        .signup-footer :global(a:hover) { text-decoration: underline; }

        @media (max-width: 500px) {
            .signup-box { padding: 40px 20px; margin: 20px; }
        }
      `}</style>
        </Layout>
    );
}
