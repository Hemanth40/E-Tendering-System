import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaTrophy, FaClock, FaCoins, FaPlus, FaEye, FaNetworkWired, FaShieldAlt, FaBolt, FaSyncAlt } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const BidderDashboard = () => {
  const [myBids, setMyBids] = useState([]);
  const [availableTenders, setAvailableTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [bidsResponse, tendersResponse] = await Promise.all([
        axios.get(`${API_URL}/bids/my-bids`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/tenders`)
      ]);

      setMyBids(bidsResponse.data.bids);
      // Filter tenders that are published and not expired
      const now = new Date();
      const activeTenders = tendersResponse.data.tenders.filter(
        t => t.status === 'published' && new Date(t.deadline) > now
      );
      setAvailableTenders(activeTenders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
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
          <p className="text-xl text-gray-400">Loading Dashboard...</p>
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
            <FaNetworkWired className="mx-auto text-6xl text-cyan-400 drop-shadow-2xl" />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider"
            variants={fadeInUp}
          >
            BIDDER DASHBOARD
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-400 font-light"
            variants={fadeInUp}
          >
            Access the Decentralized Tender Network
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-cyan-400/30 shadow-2xl"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            animate={glowAnimation}
          >
            <motion.div className="flex items-center mb-4" variants={iconAnimation}>
              <FaCoins className="text-3xl text-cyan-400 mr-3" />
              <h3 className="text-xl font-bold text-cyan-300 font-mono">My Bids</h3>
            </motion.div>
            <p className="text-4xl font-bold text-white font-mono">{myBids.length}</p>
            <p className="text-sm text-gray-400 mt-2">Total submissions</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-purple-400/30 shadow-2xl"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            animate={glowAnimation}
          >
            <motion.div className="flex items-center mb-4" variants={iconAnimation}>
              <FaTrophy className="text-3xl text-purple-400 mr-3" />
              <h3 className="text-xl font-bold text-purple-300 font-mono">Available Tenders</h3>
            </motion.div>
            <p className="text-4xl font-bold text-white font-mono">{availableTenders.length}</p>
            <p className="text-sm text-gray-400 mt-2">Active opportunities</p>
          </motion.div>

          <motion.div
            className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-pink-400/30 shadow-2xl"
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            animate={glowAnimation}
          >
            <motion.div className="flex items-center mb-4" variants={iconAnimation}>
              <FaClock className="text-3xl text-pink-400 mr-3" />
              <h3 className="text-xl font-bold text-pink-300 font-mono">Active Bids</h3>
            </motion.div>
            <p className="text-4xl font-bold text-white font-mono">
              {myBids.filter(bid => {
                const tender = availableTenders.find(t => t._id === bid.tender_id);
                return tender && new Date(tender.deadline) > new Date();
              }).length}
            </p>
            <p className="text-sm text-gray-400 mt-2">Currently competing</p>
          </motion.div>
        </motion.div>

        {/* Available Tenders */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-cyan-400/30 shadow-2xl mb-8"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="flex items-center mb-6" variants={iconAnimation}>
            <FaEye className="text-3xl text-cyan-400 mr-3" />
            <h2 className="text-3xl font-bold text-cyan-300 font-mono">AVAILABLE TENDERS</h2>
          </motion.div>

          {availableTenders.length === 0 ? (
            <motion.div
              className="text-center py-12"
              variants={fadeInUp}
            >
              <FaNetworkWired className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">No active tenders available for bidding.</p>
              <p className="text-gray-500 mt-2">Check back later for new opportunities.</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {availableTenders.slice(0, 5).map((tender) => (
                <motion.div
                  key={tender._id}
                  className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 font-mono">{tender.title}</h3>
                      <p className="text-gray-300 mb-3 leading-relaxed">{tender.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center text-cyan-300">
                          <FaCoins className="mr-2" />
                          Budget: ${tender.budget.toLocaleString()}
                        </span>
                        <span className="flex items-center text-purple-300">
                          <FaClock className="mr-2" />
                          Deadline: {new Date(tender.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/bidder/submit-bid/${tender._id}`}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-cyan-400 ml-6 font-mono"
                    >
                      <FaPlus className="inline mr-2" />
                      Submit Bid
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {availableTenders.length > 5 && (
            <motion.div
              className="text-center mt-8"
              variants={fadeInUp}
            >
              <Link
                to="/tenders"
                className="bg-transparent border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black text-cyan-400 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-block font-mono"
              >
                <FaEye className="inline mr-2" />
                View All Tenders →
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* My Recent Bids */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-purple-400/30 shadow-2xl"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="flex items-center justify-between mb-6" variants={iconAnimation}>
            <div className="flex items-center">
              <FaShieldAlt className="text-3xl text-purple-400 mr-3" />
              <h2 className="text-3xl font-bold text-purple-300 font-mono">MY RECENT BIDS</h2>
            </div>
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-black font-bold px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed font-mono"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaSyncAlt className={`inline mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
          </motion.div>

          {myBids.length === 0 ? (
            <motion.div
              className="text-center py-12"
              variants={fadeInUp}
            >
              <FaBolt className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">You haven't submitted any bids yet.</p>
              <p className="text-gray-500 mt-2">Start participating in tenders above.</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {myBids.slice(0, 5).map((bid) => {
                const tender = availableTenders.find(t => t._id === bid.tender_id);

                return (
                  <motion.div
                    key={bid._id}
                    className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <FaCoins className="text-cyan-400 mr-2" />
                          <p className="text-xl font-bold text-white font-mono">
                            Bid Amount: ${bid.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mb-1">
                          <FaClock className="mr-2" />
                          Submitted: {new Date(bid.submitted_at).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">
                          Tender ID: {bid.tender_id}
                        </p>
                        {tender && (
                          <p className="text-xs text-gray-400 font-mono mt-1">
                            Tender: {tender.title} ({tender.status})
                          </p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${bid.status === 'selected' ? 'bg-green-500/20 text-green-400 border border-green-400/50' :
                        bid.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-400/50' :
                          'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                        }`}>
                        {bid.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BidderDashboard;
