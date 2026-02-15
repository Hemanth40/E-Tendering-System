import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaCoins, FaFileUpload, FaArrowLeft, FaPaperPlane, FaNetworkWired, FaShieldAlt, FaBolt } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const SubmitBid = () => {
  const { tenderId } = useParams();
  const navigate = useNavigate();
  const [tender, setTender] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    documents: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
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

  useEffect(() => {
    fetchTender();
  }, [tenderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchTender = async () => {
    try {
      const response = await axios.get(`${API_URL}/tenders/${tenderId}`);
      setTender(response.data);
    } catch (error) {
      setError('Failed to fetch tender details');
      console.error('Error fetching tender:', error);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'documents') {
      setFormData({
        ...formData,
        documents: e.target.files
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();

      // Send bid data as JSON string
      const bidData = { amount: parseFloat(formData.amount) };
      formDataToSend.append('bid_data', JSON.stringify(bidData));

      if (formData.documents) {
        for (let i = 0; i < formData.documents.length; i++) {
          formDataToSend.append('documents', formData.documents[i]);
        }
      }

      await axios.post(`${API_URL}/bids/${tenderId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/bidder');
    } catch (error) {
      let errorMessage = 'Failed to submit bid';

      if (error.response?.data) {
        const data = error.response.data;
        if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail.map(err => err.msg || err.message).join(', ');
        } else if (data.detail && typeof data.detail === 'object') {
          errorMessage = data.detail.msg || data.detail.message || JSON.stringify(data.detail);
        } else if (data.message) {
          errorMessage = data.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!tender) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl text-cyan-400 mx-auto mb-4"
          >
            <FaNetworkWired />
          </motion.div>
          <p className="text-xl text-gray-400">Loading Tender Details...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
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
            <FaShieldAlt className="mx-auto text-6xl text-cyan-400 drop-shadow-2xl" />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider"
            variants={fadeInUp}
          >
            SUBMIT BID
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-400 font-light"
            variants={fadeInUp}
          >
            Encrypted Bid Submission | Decentralized Tender Network
          </motion.p>
        </motion.div>

        {/* Tender Details Card */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-cyan-400/30 shadow-2xl mb-8"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <motion.div className="flex items-center mb-6" variants={iconAnimation}>
            <FaNetworkWired className="text-3xl text-cyan-400 mr-3" />
            <h2 className="text-3xl font-bold text-cyan-300 font-mono">TENDER DETAILS</h2>
          </motion.div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white font-mono">{tender.title}</h3>
            <p className="text-gray-300 leading-relaxed">{tender.description}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <FaCoins className="text-green-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-400">Budget</p>
                  <p className="text-xl font-bold text-green-300 font-mono">${tender.budget.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FaBolt className="text-yellow-400 text-xl" />
                <div>
                  <p className="text-sm text-gray-400">Deadline</p>
                  <p className="text-xl font-bold text-yellow-300 font-mono">{new Date(tender.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bid Submission Form */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-purple-400/30 shadow-2xl"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <motion.div className="flex items-center mb-6" variants={iconAnimation}>
            <FaPaperPlane className="text-3xl text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold text-purple-300 font-mono">SUBMIT YOUR BID</h2>
          </motion.div>

          {error && (
            <motion.div
              className="bg-red-500/20 border border-red-400/50 text-red-300 px-6 py-4 rounded-2xl mb-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <motion.div variants={fadeInUp}>
              <label className="block text-cyan-300 text-lg font-bold mb-4 font-mono" htmlFor="amount">
                <FaCoins className="inline mr-2" />
                BID AMOUNT ($)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full bg-gray-800/50 border-2 border-cyan-400/50 rounded-2xl py-4 px-6 text-white text-xl font-mono focus:outline-none focus:border-cyan-400 focus:bg-gray-800 transition-all duration-300 placeholder-gray-500"
                placeholder="Enter your bid amount"
                required
              />
              <p className="text-sm text-gray-400 mt-2 font-mono">
                Tender budget: ${tender.budget.toLocaleString()}. Submit a competitive bid.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <label className="block text-purple-300 text-lg font-bold mb-4 font-mono" htmlFor="documents">
                <FaFileUpload className="inline mr-2" />
                SUPPORTING DOCUMENTS (OPTIONAL)
              </label>
              <input
                type="file"
                id="documents"
                name="documents"
                onChange={handleChange}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full bg-gray-800/50 border-2 border-purple-400/50 rounded-2xl py-4 px-6 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-400 transition-all duration-300"
              />
              <p className="text-sm text-gray-400 mt-2 font-mono">
                Upload certificates, proposals, or supporting documentation.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-6"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-cyan-400 flex items-center justify-center font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                animate={glowAnimation}
              >
                <FaPaperPlane className="mr-3" />
                {loading ? 'SUBMITTING BID...' : 'SUBMIT ENCRYPTED BID'}
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate(`/tenders/${tenderId}`)}
                className="bg-transparent border-2 border-gray-400 hover:bg-gray-400 hover:text-black text-gray-400 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center font-mono"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
              >
                <FaArrowLeft className="mr-3" />
                BACK TO TENDER
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SubmitBid;
