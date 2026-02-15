import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt, FaUserPlus, FaNetworkWired } from 'react-icons/fa';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
import { showSuccessToast, showErrorToast } from '../components/Toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const iconAnimation = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginData = new FormData();
      loginData.append('username', formData.email);  // OAuth2 expects 'username' field
      loginData.append('password', formData.password);

      const response = await axios.post(`${API_URL}/auth/login`, loginData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Dispatch custom event to notify navbar of login
      window.dispatchEvent(new Event('userLogin'));

      showSuccessToast(`Welcome back, ${response.data.user.username}!`);

      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else if (response.data.user.role === 'organizer') {
        navigate('/organizer');
      } else {
        navigate('/bidder');
      }
    } catch (error) {
      let errorMessage = 'Login failed';
      if (error.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map(err => err.msg || err.message).join(', ');
        } else if (typeof error.response.data.detail === 'string') {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.detail.msg) {
          errorMessage = error.response.data.detail.msg;
        }
      }
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-4">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Cyberpunk Grid Lines */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <motion.div
        className="max-w-lg w-full bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-cyan-400/30 relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          boxShadow: [
            "0 0 20px rgba(0, 255, 255, 0.5)",
            "0 0 40px rgba(255, 0, 255, 0.5)",
            "0 0 20px rgba(0, 255, 255, 0.5)"
          ]
        }}
        transition={{
          duration: 0.8,
          boxShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        <motion.div
          className="text-center mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={iconAnimation} className="mb-6">
            <FaNetworkWired className="mx-auto text-6xl text-cyan-400 drop-shadow-2xl" />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider"
            variants={fadeInUp}
          >
            ACCESS PORTAL
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg"
            variants={fadeInUp}
          >
            Enter the Decentralized Network
          </motion.p>
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        <motion.form
          onSubmit={handleSubmit}
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="mb-6">
            <label className="block text-cyan-300 text-sm font-bold mb-3 font-mono" htmlFor="email">
              <FaUser className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-8">
            <label className="block text-cyan-300 text-sm font-bold mb-3 font-mono" htmlFor="password">
              <FaLock className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-400/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm"
              placeholder="Enter your password"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold py-4 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-cyan-400 disabled:opacity-50 disabled:transform-none font-mono"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignInAlt className="inline mr-2" />
            {loading ? 'Authenticating...' : 'Access Network'}
          </motion.button>
        </motion.form>

        <motion.div
          className="text-center mt-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300 font-mono text-sm"
          >
            <FaUserPlus className="inline mr-2" />
            New to the Network? Register Here
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
