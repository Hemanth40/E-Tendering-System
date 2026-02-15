import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
import { FaEye, FaClock, FaDollarSign, FaCheckCircle, FaArrowLeft, FaNetworkWired } from 'react-icons/fa';

const TenderDetail = () => {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchTenderDetails();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tender) {
      document.title = `${tender.title} - E-Tendering System`;
    } else {
      document.title = 'Tender Details - E-Tendering System';
    }
  }, [tender]);

  const fetchTenderDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const tenderPromise = axios.get(`${API_URL}/tenders/${id}`);
      const bidsPromise = (token && token !== 'null' && token !== null && token !== undefined && token.trim() !== '')
        ? axios.get(`${API_URL}/bids/tender/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }).catch(() => ({ data: { bids: [] } })) // Handle case where user can't see bids
        : Promise.resolve({ data: { bids: [] } });

      const [tenderResponse, bidsResponse] = await Promise.all([
        tenderPromise,
        bidsPromise
      ]);

      setTender(tenderResponse.data);
      setBids(bidsResponse.data.bids || []);
    } catch (error) {
      setError('Failed to fetch tender details');
      console.error('Error fetching tender details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTender = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/tenders/${id}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTenderDetails();
    } catch (error) {
      console.error('Error closing tender:', error);
    }
  };

  const handleEvaluateTender = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/tenders/${id}/evaluate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTenderDetails();
    } catch (error) {
      console.error('Error evaluating tender:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'evaluated': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
    boxShadow: [
      "0 0 20px rgba(0, 255, 255, 0.5)",
      "0 0 40px rgba(255, 0, 255, 0.5)",
      "0 0 20px rgba(0, 255, 255, 0.5)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  if (loading) {
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
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-8"
            variants={iconAnimation}
          >
            <FaNetworkWired className="mx-auto text-6xl text-cyan-400 drop-shadow-2xl" />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider"
            variants={fadeInUp}
          >
            LOADING TENDER
          </motion.h2>
          <motion.p
            className="text-gray-400 text-lg mb-8"
            variants={fadeInUp}
          >
            Accessing Decentralized Network...
          </motion.p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block"
          >
            <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error || !tender) {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative flex items-center justify-center px-4">
        {/* Animated Background Particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-400 rounded-full"
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
            backgroundImage: `linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <motion.div
          className="text-center max-w-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-8"
            variants={iconAnimation}
          >
            <FaNetworkWired className="mx-auto text-6xl text-red-400 drop-shadow-2xl" />
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 via-pink-400 to-red-400 bg-clip-text text-transparent font-mono tracking-wider"
            variants={fadeInUp}
          >
            ACCESS DENIED
          </motion.h2>
          <motion.p
            className="text-red-300 text-lg mb-8"
            variants={fadeInUp}
          >
            {error || 'Tender not found in the network.'}
          </motion.p>
          <Link
            to="/tenders"
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-red-400"
          >
            <FaArrowLeft className="inline mr-2" />
            Return to Network
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
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

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div variants={iconAnimation} className="mb-6">
            <FaNetworkWired className="mx-auto text-6xl text-cyan-400 drop-shadow-2xl" />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider"
            variants={fadeInUp}
          >
            TENDER DETAILS
          </motion.h1>
          <motion.p
            className="text-gray-400 text-xl"
            variants={fadeInUp}
          >
            Decentralized Tender Information
          </motion.p>
        </motion.div>

        {/* Tender Card */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl p-8 rounded-3xl border border-cyan-400/30 shadow-2xl mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, boxShadow: glowAnimation.boxShadow }}
          transition={{ duration: 0.8, boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
        >
          <div className="flex justify-between items-start mb-8">
            <motion.h2
              className="text-4xl font-bold text-cyan-300 font-mono"
              variants={fadeInUp}
            >
              {tender.title}
            </motion.h2>
            <motion.span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(tender.status)}`}
              variants={fadeInUp}
            >
              {tender.status.toUpperCase()}
            </motion.span>
          </div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-8"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 backdrop-blur-lg p-6 rounded-2xl border border-cyan-400/50"
              variants={fadeInUp}
            >
              <motion.div className="flex items-center mb-4" variants={iconAnimation}>
                <FaEye className="text-3xl text-cyan-300 mr-3" />
                <h3 className="text-2xl font-bold font-mono text-cyan-300">DESCRIPTION</h3>
              </motion.div>
              <p className="text-cyan-100 text-lg leading-relaxed">{tender.description}</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-lg p-6 rounded-2xl border border-purple-400/50"
              variants={fadeInUp}
            >
              <motion.div className="flex items-center mb-4" variants={iconAnimation}>
                <FaCheckCircle className="text-3xl text-purple-300 mr-3" />
                <h3 className="text-2xl font-bold font-mono text-purple-300">REQUIREMENTS</h3>
              </motion.div>
              <p className="text-purple-100 text-lg leading-relaxed">{tender.requirements}</p>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6 mb-8"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-lg p-6 rounded-2xl border border-green-400/50 text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <FaDollarSign className="text-4xl text-green-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold font-mono text-green-300 mb-2">BUDGET</h4>
              <p className="text-3xl font-bold text-green-400">${tender.budget}</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-lg p-6 rounded-2xl border border-blue-400/50 text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <FaClock className="text-4xl text-blue-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold font-mono text-blue-300 mb-2">DEADLINE</h4>
              <p className="text-xl font-bold text-blue-400">{new Date(tender.deadline).toLocaleString()}</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-orange-900/20 to-red-900/20 backdrop-blur-lg p-6 rounded-2xl border border-orange-400/50 text-center"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <FaCheckCircle className="text-4xl text-orange-400 mx-auto mb-3" />
              <h4 className="text-lg font-bold font-mono text-orange-300 mb-2">STATUS</h4>
              <p className="text-xl font-bold text-orange-400 capitalize">{tender.status}</p>
            </motion.div>
          </motion.div>

          {tender.blockchain_hash && (
            <motion.div
              className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-lg p-6 rounded-2xl border border-blue-400/50 mb-8"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <motion.div className="flex items-center mb-4" variants={iconAnimation}>
                <FaNetworkWired className="text-3xl text-blue-300 mr-3" />
                <h3 className="text-2xl font-bold font-mono text-blue-300">BLOCKCHAIN VERIFICATION</h3>
              </motion.div>
              <p className="text-blue-100 text-sm break-all font-mono bg-black/30 p-3 rounded-lg">
                {tender.blockchain_hash}
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {user?.role === 'bidder' && tender.status === 'published' && new Date(tender.deadline) > new Date() && (
              <motion.div variants={fadeInUp}>
                <Link
                  to={`/bidder/submit-bid/${tender._id}`}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-green-400 inline-block"
                >
                  <FaCheckCircle className="inline mr-2" />
                  Submit Bid
                </Link>
              </motion.div>
            )}

            {user?.role === 'admin' && tender.status === 'published' && (
              <motion.div variants={fadeInUp}>
                <button
                  onClick={handleCloseTender}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-red-400"
                >
                  <FaCheckCircle className="inline mr-2" />
                  Close Tender
                </button>
              </motion.div>
            )}

            {user?.role === 'admin' && tender.status === 'closed' && (
              <motion.div variants={fadeInUp}>
                <button
                  onClick={handleEvaluateTender}
                  className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-purple-400"
                >
                  <FaCheckCircle className="inline mr-2" />
                  Evaluate Tender
                </button>
              </motion.div>
            )}

            <motion.div variants={fadeInUp}>
              <Link
                to="/tenders"
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-gray-400 inline-block"
              >
                <FaArrowLeft className="inline mr-2" />
                Back to Tenders
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bids Section (Only for Admin or if user can see bids) */}
        {user?.role === 'admin' && bids.length > 0 && (
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-xl p-8 rounded-3xl border border-cyan-400/30 shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0, boxShadow: glowAnimation.boxShadow }}
            transition={{ duration: 0.8, boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
          >
            <motion.div
              className="flex items-center mb-8"
              variants={iconAnimation}
            >
              <FaEye className="text-4xl text-cyan-300 mr-4" />
              <h2 className="text-3xl font-bold font-mono text-cyan-300">SUBMITTED BIDS ({bids.length})</h2>
            </motion.div>
            <motion.div
              className="space-y-6"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {bids.map((bid, index) => (
                <motion.div
                  key={bid._id}
                  className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg p-6 rounded-2xl border border-cyan-400/20"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-xl font-bold text-cyan-300 mb-2">
                        <FaDollarSign className="inline mr-2" />
                        Bid Amount: ${bid.amount}
                      </p>
                      <p className="text-gray-400 mb-2">
                        <FaClock className="inline mr-2" />
                        Submitted: {new Date(bid.submitted_at).toLocaleDateString()}
                      </p>
                      {bid.blockchain_hash && (
                        <p className="text-xs text-gray-500 break-all font-mono bg-black/30 p-2 rounded">
                          <FaNetworkWired className="inline mr-1" />
                          {bid.blockchain_hash}
                        </p>
                      )}
                    </div>
                    <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium border border-green-400">
                      <FaCheckCircle className="inline mr-1" />
                      Submitted
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TenderDetail;
