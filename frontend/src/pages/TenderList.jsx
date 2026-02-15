import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
import { FaShieldAlt, FaEye, FaBolt, FaCalendarAlt, FaDollarSign, FaFileAlt, FaArrowRight, FaNetworkWired } from 'react-icons/fa';

const TenderList = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      const response = await axios.get(`${API_URL}/tenders`);
      setTenders(response.data.tenders);
    } catch (error) {
      setError('Failed to fetch tenders');
      console.error('Error fetching tenders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-300 border-green-400/50';
      case 'closed': return 'bg-red-500/20 text-red-300 border-red-400/50';
      case 'draft': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50';
      case 'evaluated': return 'bg-blue-500/20 text-blue-300 border-blue-400/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/50';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-6xl text-cyan-400"
        >
          <FaNetworkWired />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-400 mb-4">⚠️</div>
          <p className="text-xl text-red-300">{error}</p>
        </div>
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

      {/* Header Section */}
      <motion.div
        className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black text-white py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"></div>
        <div className="relative container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={iconAnimation} className="mb-8">
              <FaNetworkWired className="mx-auto text-8xl text-cyan-400 drop-shadow-2xl" />
            </motion.div>
            <motion.h1
              className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider"
              variants={fadeInUp}
            >
              ACTIVE TENDERS
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-300 font-light"
              variants={fadeInUp}
            >
              Browse Decentralized Tender Opportunities | Secure, Transparent, Automated
            </motion.p>
          </motion.div>
        </div>

        {/* Cyberpunk Grid Lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </motion.div>

      {/* Tenders Section */}
      <motion.div
        className="py-20 px-4 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          {tenders.length === 0 ? (
            <motion.div
              className="text-center py-20"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="text-6xl text-gray-600 mb-4">📋</div>
              <p className="text-xl text-gray-400">No tenders available at the moment.</p>
              <p className="text-gray-500 mt-2">Check back later for new opportunities.</p>
            </motion.div>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={stagger}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {tenders.map((tender) => (
                <motion.div
                  key={tender._id}
                  className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-cyan-400/30 shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300 transform hover:-translate-y-2"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  animate={glowAnimation}
                >
                  <div className="flex justify-between items-start mb-6">
                    <motion.div
                      className="flex items-center space-x-3"
                      variants={iconAnimation}
                    >
                      <FaFileAlt className="text-2xl text-cyan-400" />
                      <h2 className="text-xl font-bold text-cyan-300 font-mono">{tender.title}</h2>
                    </motion.div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tender.status)}`}>
                      {tender.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-6 leading-relaxed">{tender.description}</p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <FaDollarSign className="text-green-400" />
                      <span className="text-green-300 font-mono">${tender.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaCalendarAlt className="text-purple-400" />
                      <span className="text-purple-300 font-mono">{new Date(tender.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link
                    to={`/tenders/${tender._id}`}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg border-2 border-cyan-400 flex items-center justify-center space-x-2 group"
                  >
                    <span>View Details</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="py-20 px-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-mono"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            WHY CHOOSE BLOCKCHAIN TENDERING?
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <FaShieldAlt className="text-4xl text-cyan-400" />,
                title: "Tamper-Proof",
                description: "Every bid and tender is immutably recorded on the blockchain, preventing fraud and manipulation."
              },
              {
                icon: <FaEye className="text-4xl text-purple-400" />,
                title: "Full Transparency",
                description: "All participants can verify the integrity of the tendering process without compromising confidentiality."
              },
              {
                icon: <FaBolt className="text-4xl text-pink-400" />,
                title: "Automated Execution",
                description: "Smart contracts automatically handle bid evaluation, winner selection, and contract enforcement."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-cyan-400/30 shadow-2xl hover:shadow-cyan-400/20 transition-all duration-300 transform hover:-translate-y-2"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                animate={glowAnimation}
              >
                <motion.div
                  className="mb-6 flex justify-center"
                  variants={iconAnimation}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-center text-cyan-300 font-mono">{feature.title}</h3>
                <p className="text-gray-400 text-center leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TenderList;
