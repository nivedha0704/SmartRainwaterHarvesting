import { useState } from 'react';
import { Droplet, Droplets, Eye, EyeOff, Leaf, LockKeyhole, Mail } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Check your credentials.');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onLogin(data.user);
    } catch {
      setError('Cannot connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-screen">
      <section className="login-visual">
        <div className="login-brand">
          <Droplet size={34} />
          <span>RAINWATER <strong>MANAGEMENT</strong></span>
        </div>

        <div className="visual-content">
          <span className="visual-tag">SMART WATER SOLUTIONS</span>
          <h1>Every drop<br />makes a difference.</h1>
          <p>
            Monitor harvesting operations, manage inspections,
            and maintain your water infrastructure in one place.
          </p>

          <div className="visual-features">
            <div className="visual-feature">
              <div className="feature-circle"><Droplet size={26} /></div>
              <h4>SMART MONITORING</h4>
              <span>Real-time system insights</span>
            </div>
            <div className="visual-feature">
              <div className="feature-circle"><Leaf size={26} /></div>
              <h4>SUSTAINABLE WATER MANAGEMENT</h4>
              <span>Efficient water resource planning</span>
            </div>
          </div>
        </div>

        <p className="visual-footer">A smarter approach to every drop.</p>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-icon"><Droplets size={27} /></div>
          <span className="form-eyebrow">WELCOME BACK</span>
          <h2>Sign in to your account</h2>
          <p className="login-description">
            Enter your credentials to access the management dashboard.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <div className="input-wrap">
              <Mail size={20} />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={event => setEmail(event.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <LockKeyhole size={20} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && <p className="login-error" role="alert">{error}</p>}

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in to dashboard'}
            </button>
          </form>

          <p className="login-security">
            <LockKeyhole size={16} />
            Secure access for authorized personnel
          </p>
        </div>
      </section>
    </main>
  );
}