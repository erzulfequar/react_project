import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Login = ({ settoken }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('https://reqres.in/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      settoken(response.data.token);
      showToast('Login successful!', 'success');
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (err) {
      showToast(err.response?.data?.error || 'Login failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    const newToast = { id: Date.now(), message, type };
    setToasts((prevToasts) => [...prevToasts, newToast]);
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== newToast.id));
    }, 3000);
  };

  return (
    <div className="card bg-base-100 mt-20 mx-auto w-full max-w-sm shrink-0 shadow-2xl">
      <h1 className="text-base-content text-3xl text-center font-bold">LOGIN FORM</h1>
      <div className="card-body">
        <form onSubmit={handleLogin}>
          <fieldset className="fieldset">
            <label className="fieldset-label">Email</label>
            <input
              type="email"
              className="input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label className="fieldset-label">Password</label>
            <input
              type="password"
              className="input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
            <button className="btn btn-neutral mt-4" type="submit" disabled={loading}>
              {loading ? (
                <span>
                  Logging in...
                  <span className="loading loading-ring loading-xs ml-2"></span>
                </span>
              ) : (
                'Login'
              )}
            </button>
          </fieldset>
        </form>
      </div>

      {/* Toast Container */}
      <div className="fixed top-4 left-4 z-50">
        {toasts.map((toast) => (
          <div key={toast.id} className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} mt-2`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;
