import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { API_URL } from '../config/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First, try to login as admin
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const adminResponse = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        body: formData,
      });

      if (adminResponse.ok) {
        const data = await adminResponse.json();
        localStorage.setItem('adminToken', data.access_token);
        router.push('/admin');
        return;
      }

      // If admin login fails, try user login
      const userResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (userResponse.ok) {
        const data = await userResponse.json();
        localStorage.setItem('userToken', data.access_token);
        localStorage.setItem('userEmail', username);
        localStorage.setItem('username', data.username); // Store the actual username
        router.push('/'); // Redirect to home page
        return;
      }

      // If both fail
      if (adminResponse.status === 401 || userResponse.status === 401) {
        throw new Error('Incorrect email or password.');
      } else {
        throw new Error('Something went wrong. Please try again later.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Sign In | CINE NEST</title>
      </Head>

      <div className="login-container">
        <div className="login-form-box">
          <h1>Sign In</h1>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Email or username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className={username === 'admin' ? 'admin-input' : ''}
              />
              {username === 'admin' && <small className="hint">Logging in as Admin</small>}
            </div>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-help">
            <div className="remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#">Need help?</a>
          </div>

          <div className="login-footer">
            <p>New to CINE NEST? <Link href="/signup">Sign up now.</Link></p>

          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 85vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background-image: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://assets.nflxext.com/ffe/siteui/vlv3/f8ca36a4-acec-4adc-9511-2a1d0a2db771/67119a00-cb69-4a36-8208-f4c0177728b7/US-en-20220523-popsignuptwelve-perspective_alpha_website_medium.jpg');
          background-size: cover;
          background-position: center;
        }
        .login-form-box {
          background: rgba(0, 0, 0, 0.75);
          padding: 60px 68px 40px;
          width: 100%;
          max-width: 450px;
          border-radius: 4px;
        }
        h1 { font-size: 2rem; margin-bottom: 28px; }
        .input-group { position: relative; margin-bottom: 16px; }
        input {
          width: 100%;
          padding: 16px 20px;
          background: #333;
          border: none;
          border-radius: 4px;
          color: white;
          font-size: 1rem;
          outline: none;
          transition: background 0.3s;
        }
        input:focus { background: #454545; }
        .admin-input { border-bottom: 2px solid #e50914; }
        .hint { color: #e50914; font-size: 0.75rem; position: absolute; right: 10px; bottom: 5px; }
        
        .login-btn {
          width: 100%;
          padding: 16px;
          background: #e50914;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          margin-top: 24px;
        }
        .login-btn:hover { background: #b20710; }
        .login-btn:disabled { opacity: 0.5; }
        
        .error-message {
          background: #e87c03;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 0.9rem;
        }
        
        .login-help {
          display: flex;
          justify-content: space-between;
          color: #b3b3b3;
          font-size: 0.8rem;
          margin-top: 10px;
        }
        .remember { display: flex; align-items: center; gap: 5px; }
        .remember input { width: auto; margin-bottom: 0; }
        .login-footer { margin-top: 40px; color: #737373; font-size: 1rem; }
        .login-footer a { color: white; text-decoration: none; }
        .login-footer a:hover { text-decoration: underline; }
        .credentials-note { margin-top: 20px; font-size: 0.85rem; color: #b3b3b3; }
        
        @media (max-width: 500px) {
          .login-form-box { padding: 40px 20px; }
        }
      `}</style>
    </Layout>
  );
}
