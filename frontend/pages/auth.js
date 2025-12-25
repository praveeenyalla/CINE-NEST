import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { API_URL } from '../config/api';

export default function AuthPage() {
  const [showSignup, setShowSignup] = useState(false);
  const router = useRouter();

  // Signup state
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');

    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }

    setSignupLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: signupData.username,
          email: signupData.email,
          password: signupData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.access_token);
        localStorage.setItem('userEmail', signupData.email);
        localStorage.setItem('username', data.username);
        router.push('/');
      } else {
        throw new Error(data.detail || 'Signup failed');
      }
    } catch (err) {
      setSignupError(err.message);
    } finally {
      setSignupLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', loginData.email);
      formData.append('password', loginData.password);

      // 1. Try Admin Login
      const adminResponse = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        body: formData,
      });

      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        localStorage.setItem('adminToken', adminData.access_token);
        router.push('/admin');
        return;
      }

      // 2. If Admin login fails, try User Login
      const userResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      const userData = await userResponse.json();

      if (userResponse.ok) {
        localStorage.setItem('userToken', userData.access_token);
        localStorage.setItem('userEmail', loginData.email);
        localStorage.setItem('username', userData.username);
        router.push('/');
      } else {
        throw new Error(userData.detail || 'Incorrect email or password');
      }
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{showSignup ? "CINE NEST - Sign Up" : "CINE NEST - Login"}</title>
      </Head>
      <div className="relative min-h-screen w-full flex flex-col overflow-hidden bg-background-dark font-display">
        {/* Cinematic Background with Overlay */}
        <div
          className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdpQj50Gj5q2aqW7aSjO0HhC5MnUhWZKxj9sAFvCPoAuQqOlCen_1RDw85UKdiaXChXGfFLfHbt0ic5IK804GMuw28d26esVxNtsLP2VoZu5ezrNx2gU1oU_QGgJaOI3nsxVdXJ-MYpyK8HpuDnITkIS09sO-PjyqZHWvTcQSosKbZCe-KlrlJeBJsaiNCGjn5BqoaR785YZjbtP5QyWDVjbYvR99U7d3UNBP6y2hgyaBUcOGr79UJi9751N_nqQ03xvV9QTw3P7Q')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-background-dark/95 via-background-dark/90 to-primary/20 backdrop-blur-sm"></div>
        </div>

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-6 py-5 lg:px-12 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 text-primary">
              <span className="material-symbols-outlined text-4xl">movie_filter</span>
            </div>
            <h2 className="text-white text-xl font-bold tracking-tight">CINE NEST</h2>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Home</a>
            <a href="#" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">About</a>
            <a href="#" className="text-white/70 hover:text-primary transition-colors text-sm font-medium">Pricing</a>
          </nav>
        </header>

        {/* Main Content */}
        <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-md space-y-8">
            {/* Card Container */}
            <div className="bg-surface-dark/60 backdrop-blur-xl border border-border-dark p-8 rounded-2xl shadow-2xl ring-1 ring-white/5">

              {/* Intro Text */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
                  {showSignup ? "Unlock the Future" : "Welcome Back"}
                </h1>
                <p className="text-sm text-gray-400">
                  {showSignup
                    ? "Join CINE NEST to discover AI-curated entertainment tailored just for you."
                    : "Enter your credentials to access your personalized dashboard."
                  }
                </p>
              </div>

              {/* Dynamic Error Message */}
              {(showSignup ? signupError : loginError) && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 text-center">
                  <p className="text-red-500 text-sm">{showSignup ? signupError : loginError}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={showSignup ? handleSignup : handleLogin} className="space-y-6">

                {showSignup && (
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-200 mb-2">
                      Username
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-gray-500 text-[20px]">person</span>
                      </div>
                      <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        value={signupData.username}
                        onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                        className="block w-full rounded-lg border-0 bg-[#271b1c] py-3 pl-10 pr-3 text-white ring-1 ring-inset ring-[#543b3c] placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                        placeholder="johndoe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-200 mb-2">
                    {showSignup ? "Email address" : "Email or Username"}
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-500 text-[20px]">mail</span>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type={showSignup ? "email" : "text"}
                      required
                      value={showSignup ? signupData.email : loginData.email}
                      onChange={(e) => showSignup
                        ? setSignupData({ ...signupData, email: e.target.value })
                        : setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="block w-full rounded-lg border-0 bg-[#271b1c] py-3 pl-10 pr-3 text-white ring-1 ring-inset ring-[#543b3c] placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                      placeholder={showSignup ? "name@example.com" : "Email or Username"}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="material-symbols-outlined text-gray-500 text-[20px]">lock</span>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={showSignup ? signupData.password : loginData.password}
                      onChange={(e) => showSignup
                        ? setSignupData({ ...signupData, password: e.target.value })
                        : setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="block w-full rounded-lg border-0 bg-[#271b1c] py-3 pl-10 pr-10 text-white ring-1 ring-inset ring-[#543b3c] placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {showSignup && (
                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium leading-6 text-gray-200 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="material-symbols-outlined text-gray-500 text-[20px]">lock_reset</span>
                      </div>
                      <input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        required
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        className="block w-full rounded-lg border-0 bg-[#271b1c] py-3 pl-10 pr-10 text-white ring-1 ring-inset ring-[#543b3c] placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 transition-all duration-200"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                )}

                {showSignup && (
                  <div className="flex items-center gap-3">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-600 bg-[#271b1c] text-primary focus:ring-primary focus:ring-offset-background-dark"
                    />
                    <label htmlFor="terms" className="text-xs text-gray-400">
                      I agree to the <a href="#" className="text-primary hover:text-red-400 font-semibold">Terms</a> and <a href="#" className="text-primary hover:text-red-400 font-semibold">Privacy Policy</a>.
                    </label>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={showSignup ? signupLoading : loginLoading}
                  className="flex w-full justify-center rounded-lg bg-primary px-3 py-3.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showSignup
                    ? (signupLoading ? 'Creating Account...' : 'Create Account')
                    : (loginLoading ? 'Logging In...' : 'Sign In')
                  }
                </button>
              </form>

              {/* Divider */}
              <div className="relative mt-8">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-[#543b3c]"></div>
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-[#211617] px-4 text-gray-400">Or continue with</span>
                </div>
              </div>

              {/* Social Login */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <a href="#" className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#271b1c] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-[#543b3c] hover:bg-[#342425] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#543b3c]">
                  <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                    <path d="M12.0003 20.45c4.6667 0 8.45-3.7833 8.45-8.45 0-4.6667-3.7833-8.45-8.45-8.45-4.6667 0-8.45 3.7833-8.45 8.45 8.45 0 4.6667 3.7833 8.45 8.45 8.45Z" fill="#fff" fillOpacity="0.1"></path>
                    <path d="M20.1004 13.55c-0.125-1.2833-0.4583-2.5-1.025-3.6083l-2.6167 2.6167c0.2333 0.3166 0.425 0.65 0.5833 0.9916h3.0584Z" fill="#FBBC05"></path>
                    <path d="M11.9999 20.4501c2.1416 0 4.1083-0.8083 5.6166-2.125l-2.6-2.6083c-0.85 0.5833-1.8916 0.9333-3.0166 0.9333-2.3166 0-4.3333-1.5083-5.1166-3.6417l-2.9834 2.3084c1.5584 3.0916 4.775 5.1333 8.1 5.1333Z" fill="#34A853"></path>
                    <path d="M6.8833 13.0084c-0.1917-0.65-0.3083-1.3334-0.3083-2.0084s0.1166-1.3583 0.3083-2.0083l-2.9833-2.3084c-0.6417 1.2834-1.0083 2.7501-1.0083 4.3167s0.3666 3.0333 1.0083 4.3166l2.9833-2.3082Z" fill="#4285F4"></path>
                    <path d="M11.9999 7.34168c1.375 0 2.625 0.51667 3.5583 1.35833l2.675-2.675C16.5999 4.41668 14.4333 3.55002 11.9999 3.55002c-3.325 0-6.54163 2.04166-8.09996 5.13332l2.98333 2.30833C7.6666 8.85002 9.68326 7.34168 11.9999 7.34168Z" fill="#EA4335"></path>
                  </svg>
                  <span className="text-sm font-semibold leading-6">Google</span>
                </a>
                <a href="#" className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#271b1c] px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-[#543b3c] hover:bg-[#342425] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#543b3c]">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.684.81-1.813 1.586-2.998 1.586-.062 0-.125-.01-.187-.01-.225-1.12.38-2.316 1.054-3.13C13.731 2.15 15.114 1.397 16.365 1.43zm4.176 15.36c-.023.086-.046.17-.07.254-.813 3.235-2.73 6.64-4.896 6.947-1.928 2.366-4.085 2.502-5.462 2.502-1.376 0-3.535-.136-5.46-2.502-2.167-.307-4.084-3.712-4.896-6.946-.024-.085-.047-.17-.07-.255-2.167-8.705 2.188-14.88 2.188-14.88 2.528-2.458 6.06-2.502 6.06-2.502l.142.144c-.23.275-.41.6-.47 1.056-.038.283.076.544.298.68.22.136.5.115.7-.056l.167-.144c.917-.79 2.05-1.22 3.21-1.22 1.16 0 2.293.43 3.21 1.22l.166.144c.2.17.48.192.7.056.222-.136.336-.397.298-.68-.06-.456-.24-.78-.47-1.056l.142-.144s3.532.044 6.06 2.502c0 0 4.355 6.175 2.188 14.88z"></path>
                  </svg>
                  <span className="text-sm font-semibold leading-6">Apple</span>
                </a>
              </div>

              {/* Footer Text */}
              <p className="mt-8 text-center text-sm text-gray-500">
                {showSignup ? "Already a member? " : "New here? "}
                <button
                  onClick={() => setShowSignup(!showSignup)}
                  className="font-semibold leading-6 text-primary hover:text-red-400 transition-colors"
                >
                  {showSignup ? "Log In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
