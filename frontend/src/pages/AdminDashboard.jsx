import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaShieldAlt, FaHandshake, FaBolt, FaNetworkWired, FaPlus, FaList, FaChartBar, FaTrophy, FaClock, FaDollarSign } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalTenders: 0,
    totalBids: 0,
    activeTenders: 0,
    blockchainConnected: false
  });
  const [recentTenders, setRecentTenders] = useState([]);
  const [recentBids, setRecentBids] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const [healthResponse, tendersResponse, bidsResponse] = await Promise.all([
        axios.get(`${API_URL}/health`),
        axios.get(`${API_URL}/tenders`),
        axios.get(`${API_URL}/bids/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const tenders = tendersResponse.data.tenders;
      const bids = bidsResponse.data.bids;
      const activeTenders = tenders.filter(t => t.status === 'published').length;

      setStats({
        totalTenders: tenders.length,
        totalBids: bids.length,
        activeTenders,
        blockchainConnected: healthResponse.data.blockchain === 'connected'
      });

      setRecentTenders(tenders.slice(0, 5));
      setRecentBids(bids.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublishTender = async (tenderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/tenders/${tenderId}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh data after publishing
      fetchDashboardData();
    } catch (error) {
      console.error('Error publishing tender:', error);
    }
  };

  const handleCloseTender = async (tenderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/tenders/${tenderId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh data after closing
      fetchDashboardData();
    } catch (error) {
      console.error('Error closing tender:', error);
    }
  };

  const handleEvaluateTender = async (tenderId, winningBidId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/tenders/${tenderId}/evaluate`, {
        winning_bid_id: winningBidId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh data after evaluation
      fetchDashboardData();
    } catch (error) {
      console.error('Error evaluating tender:', error);
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/bids/${bidId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh data after rejection
      fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting bid:', error);
    }
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
          <p className="text-xl text-gray-400">Loading Admin Dashboard...</p>
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
            ADMIN DASHBOARD
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-400 font-light"
            variants={fadeInUp}
          >
            Network Control Center | System Administration
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid md:grid-cols-4 gap-8 mb-12"
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          {[
            {
              icon: <FaList className="text-3xl text-cyan-400" />,
              title: "Total Tenders",
              value: stats.totalTenders,
              color: "from-cyan-500 to-blue-600"
            },
            {
              icon: <FaTrophy className="text-3xl text-green-400" />,
              title: "Active Tenders",
              value: stats.activeTenders,
              color: "from-green-500 to-emerald-600"
            },
            {
              icon: <FaHandshake className="text-3xl text-purple-400" />,
              title: "Total Bids",
              value: stats.totalBids,
              color: "from-purple-500 to-pink-600"
            },
            {
              icon: <FaNetworkWired className="text-3xl text-yellow-400" />,
              title: "Blockchain Status",
              value: stats.blockchainConnected ? 'Connected' : 'Disconnected',
              color: stats.blockchainConnected ? "from-green-500 to-emerald-600" : "from-red-500 to-pink-600"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border border-cyan-400/30 shadow-2xl"
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
              animate={glowAnimation}
            >
              <motion.div
                className="flex items-center justify-between mb-4"
                variants={iconAnimation}
              >
                {stat.icon}
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color}`}></div>
              </motion.div>
              <h3 className="text-lg font-bold text-cyan-300 font-mono mb-2">{stat.title}</h3>
              <p className="text-3xl font-bold text-white font-mono">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-cyan-400/30 shadow-2xl mb-12"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="flex items-center mb-6" variants={iconAnimation}>
            <FaBolt className="text-3xl text-cyan-400 mr-3" />
            <h2 className="text-3xl font-bold text-cyan-300 font-mono">ADMIN ACTIONS</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <Link
                to="/admin/create-tender"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-cyan-400 flex items-center justify-center font-mono"
              >
                <FaPlus className="mr-3" />
                Create Tender
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <Link
                to="/tenders"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-green-400 flex items-center justify-center font-mono"
              >
                <FaList className="mr-3" />
                View Tenders
              </Link>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }}>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-purple-400 flex items-center justify-center font-mono">
                <FaChartBar className="mr-3" />
                Generate Reports
              </button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Recent Bids */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-purple-400/30 shadow-2xl mb-8"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="flex items-center mb-6" variants={iconAnimation}>
            <FaHandshake className="text-3xl text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold text-purple-300 font-mono">RECENT BIDS</h2>
          </motion.div>

          {recentBids.length === 0 ? (
            <motion.div
              className="text-center py-12"
              variants={fadeInUp}
            >
              <FaBolt className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-xl text-gray-400">No bids submitted yet.</p>
              <p className="text-gray-500 mt-2">Bids will appear here once bidders start participating.</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {recentBids.map((bid) => {
                const tender = recentTenders.find(t => t._id === bid.tender_id);
                const isTenderClosed = tender?.status === 'closed';
                const isBidPending = !bid.status || bid.status === 'pending';

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
                          <FaDollarSign className="text-cyan-400 mr-2" />
                          <p className="text-xl font-bold text-white font-mono">
                            Bid Amount: ${bid.amount.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mb-1">
                          <FaClock className="mr-2" />
                          Submitted: {new Date(bid.submitted_at).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-gray-500 font-mono">
                          Tender ID: {bid.tender_id} | Bidder ID: {bid.bidder_id}
                        </p>
                        {tender && (
                          <p className="text-xs text-gray-400 font-mono mt-1">
                            Tender: {tender.title} ({tender.status})
                          </p>
                        )}
                        {bid.documents && bid.documents.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-cyan-300 font-mono mb-1">Documents:</p>
                            {bid.documents.map((doc, index) => (
                              <a
                                key={index}
                                href={`${API_URL}/uploads/${doc.split('/').pop()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-300 hover:text-purple-200 font-mono underline block"
                              >
                                {doc.split('/').pop()}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${bid.status === 'selected' ? 'bg-green-500/20 text-green-400 border border-green-400/50' :
                            bid.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-400/50' :
                              'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                          }`}>
                          {bid.status?.toUpperCase() || 'PENDING'}
                        </span>
                        {isBidPending && (
                          <div className="flex space-x-2">
                            {isTenderClosed && (
                              <button
                                onClick={() => handleEvaluateTender(bid.tender_id, bid._id)}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-400 text-xs font-mono"
                              >
                                Select Winner
                              </button>
                            )}
                            <button
                              onClick={() => handleRejectBid(bid._id)}
                              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-400 text-xs font-mono"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Recent Tenders */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-cyan-400/30 shadow-2xl"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div className="flex items-center mb-6" variants={iconAnimation}>
            <FaClock className="text-3xl text-purple-400 mr-3" />
            <h2 className="text-3xl font-bold text-purple-300 font-mono">RECENT TENDERS</h2>
          </motion.div>

          {recentTenders.length === 0 ? (
            <motion.div
              className="text-center py-12"
              variants={fadeInUp}
            >
              <FaNetworkWired className="mx-auto text-6xl text-gray-600 mb-4" />
              <p className="text-xl text-gray-400 font-mono">No tenders created yet.</p>
              <p className="text-gray-500 mt-2">Start by creating your first tender above.</p>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-6"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              {recentTenders.map((tender) => (
                <motion.div
                  key={tender._id}
                  className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-cyan-300 font-mono mb-2">{tender.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 leading-relaxed">{tender.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <FaDollarSign className="mr-1 text-green-400" />
                          Budget: ${tender.budget}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-1 text-yellow-400" />
                          Deadline: {new Date(tender.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      {tender.status === 'evaluated' && tender.winner_address && (
                        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-3 rounded-lg border border-purple-400/30">
                          <div className="flex items-center mb-2">
                            <FaTrophy className="text-yellow-400 mr-2" />
                            <span className="text-sm font-bold text-yellow-300 font-mono">WINNER ANNOUNCED</span>
                          </div>
                          <div className="space-y-1 text-xs text-gray-300">
                            <p><span className="text-purple-300">Winner Address:</span> {tender.winner_address}</p>
                            <p><span className="text-green-300">Winning Amount:</span> ${tender.winning_amount?.toLocaleString()}</p>
                            {tender.evaluation_tx_hash && (
                              <p><span className="text-cyan-300">Blockchain TX:</span> {tender.evaluation_tx_hash.substring(0, 10)}...</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${tender.status === 'published' ? 'bg-green-500/20 text-green-400 border border-green-400/50' :
                          tender.status === 'closed' ? 'bg-red-500/20 text-red-400 border border-red-400/50' :
                            tender.status === 'evaluated' ? 'bg-purple-500/20 text-purple-400 border border-purple-400/50' :
                              'bg-yellow-500/20 text-yellow-400 border border-yellow-400/50'
                        }`}>
                        {tender.status.toUpperCase()}
                      </span>
                      <div className="flex space-x-2">
                        {tender.status === 'draft' && (
                          <button
                            onClick={() => handlePublishTender(tender._id)}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-green-400 text-xs font-mono"
                          >
                            Publish
                          </button>
                        )}
                        {tender.status === 'published' && (
                          <button
                            onClick={() => handleCloseTender(tender._id)}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-red-400 text-xs font-mono"
                          >
                            Close
                          </button>
                        )}
                        {tender.status === 'closed' && (
                          <button
                            onClick={() => handleEvaluateTender(tender._id)}
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-bold px-3 py-1 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg border border-purple-400 text-xs font-mono"
                          >
                            Evaluate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
