import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
import { FaPlus, FaNetworkWired, FaShieldAlt, FaEthereum, FaCode, FaBolt, FaArrowLeft, FaSave } from 'react-icons/fa';
import { showSuccessToast, showErrorToast } from '../components/Toast';

const CreateTender = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
    requirements: ''
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

  const glowAnimation = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(0, 255, 255, 0.5)",
        "0 0 40px rgba(255, 0, 255, 0.5)",
        "0 0 20px rgba(0, 255, 255, 0.5)"
      ]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
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
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/tenders/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      showSuccessToast('Tender created successfully!');

      const user = JSON.parse(localStorage.getItem('user'));
      if (user.role === 'organizer') {
        navigate('/organizer');
      } else {
        navigate('/admin');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to create tender';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={iconAnimation} className="mb-6">
            <FaPlus className="mx-auto text-6xl text-cyan-400 drop-shadow-2xl" />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider"
            variants={fadeInUp}
          >
            CREATE TENDER
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-400 font-light"
            variants={fadeInUp}
          >
            Deploy New Tender Contract | Blockchain Tendering System
          </motion.p>
        </motion.div>

        {/* Form Container */}
        <motion.div
          className="max-w-4xl mx-auto"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl p-8 rounded-3xl border border-cyan-400/30 shadow-2xl"
            animate={glowAnimation}
          >
            {error && (
              <motion.div
                className="bg-red-900/50 border border-red-500 text-red-300 px-6 py-4 rounded-2xl mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FaShieldAlt className="inline mr-2" />
                {error}
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-8"
              variants={fadeInUp}
            >
              {/* Title Field */}
              <div>
                <label className="block text-cyan-300 text-lg font-bold mb-4 font-mono" htmlFor="title">
                  <FaNetworkWired className="inline mr-3" />
                  Tender Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-800/50 border border-cyan-400/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm text-lg"
                  placeholder="Enter tender title..."
                  required
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-cyan-300 text-lg font-bold mb-4 font-mono" htmlFor="description">
                  <FaCode className="inline mr-3" />
                  Tender Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-6 py-4 bg-gray-800/50 border border-cyan-400/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm text-lg resize-none"
                  placeholder="Describe the tender requirements in detail..."
                  required
                />
              </div>

              {/* Budget and Deadline Row */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-cyan-300 text-lg font-bold mb-4 font-mono" htmlFor="budget">
                    <FaEthereum className="inline mr-3" />
                    Budget ($)
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-6 py-4 bg-gray-800/50 border border-cyan-400/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm text-lg"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 text-lg font-bold mb-4 font-mono" htmlFor="deadline">
                    <FaBolt className="inline mr-3" />
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-gray-800/50 border border-cyan-400/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm text-lg"
                    required
                  />
                </div>
              </div>

              {/* Requirements Field */}
              <div>
                <label className="block text-cyan-300 text-lg font-bold mb-4 font-mono" htmlFor="requirements">
                  <FaShieldAlt className="inline mr-3" />
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-6 py-4 bg-gray-800/50 border border-cyan-400/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 backdrop-blur-sm text-lg resize-none"
                  placeholder="Specify technical requirements, qualifications, and submission criteria..."
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-cyan-400 disabled:opacity-50 disabled:transform-none font-mono flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave className="mr-3" />
                  {loading ? 'Deploying Contract...' : 'Deploy Tender Contract'}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => {
                    const user = JSON.parse(localStorage.getItem('user'));
                    if (user.role === 'organizer') {
                      navigate('/organizer');
                    } else {
                      navigate('/admin');
                    }
                  }}
                  className="bg-transparent border-2 border-gray-600 hover:border-gray-400 text-gray-400 hover:text-white font-bold py-4 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm font-mono flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft className="mr-3" />
                  Cancel
                </motion.button>
              </div>
            </motion.form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTender;
