import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaShieldAlt, FaWallet, FaCalendarAlt, FaSignOutAlt, FaHome, FaCog, FaPlus, FaEye, FaNetworkWired, FaBolt } from 'react-icons/fa';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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



  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
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
          <p className="text-xl text-gray-400">Loading Profile...</p>
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
            <FaUser className="mx-auto text-6xl text-cyan-400 drop-shadow-2xl" />
          </motion.div>
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-mono tracking-wider"
            variants={fadeInUp}
          >
            {user?.role?.toUpperCase()} PROFILE
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-400 font-light"
            variants={fadeInUp}
          >
            Your Decentralized Identity
          </motion.p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl border border-cyan-400/30 shadow-2xl"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Profile Information */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 mb-12"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <FaUser className="text-cyan-400 mr-3 text-xl" />
                <h3 className="text-lg font-bold text-cyan-300 font-mono">Username</h3>
              </div>
              <p className="text-white text-xl font-mono">{user?.username}</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <FaEnvelope className="text-purple-400 mr-3 text-xl" />
                <h3 className="text-lg font-bold text-purple-300 font-mono">Email</h3>
              </div>
              <p className="text-white text-xl font-mono">{user?.email}</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-pink-400 mr-3 text-xl" />
                <h3 className="text-lg font-bold text-pink-300 font-mono">Role</h3>
              </div>
              <p className="text-white text-xl font-mono capitalize">{user?.role}</p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <FaWallet className="text-green-400 mr-3 text-xl" />
                <h3 className="text-lg font-bold text-green-300 font-mono">Wallet Address</h3>
              </div>
              <p className="text-white text-sm font-mono">
                {user?.wallet_address ? (
                  `${user.wallet_address.slice(0, 8)}...${user.wallet_address.slice(-6)}`
                ) : (
                  'Not connected'
                )}
              </p>
            </motion.div>

            <motion.div
              className="md:col-span-2 bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-6 rounded-2xl border border-gray-700/50"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-yellow-400 mr-3 text-xl" />
                <h3 className="text-lg font-bold text-yellow-300 font-mono">Member Since</h3>
              </div>
              <p className="text-white text-xl font-mono">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </motion.div>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            className="border-t border-gray-700/50 pt-8"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="flex items-center mb-6" variants={iconAnimation}>
              <FaCog className="text-3xl text-cyan-400 mr-3" />
              <h2 className="text-3xl font-bold text-cyan-300 font-mono">ACCOUNT ACTIONS</h2>
            </motion.div>

            <motion.div
              className="grid md:grid-cols-2 gap-6 mb-8"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
              <motion.button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-red-400 flex items-center justify-center font-mono"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </motion.button>

              <motion.button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-gray-500 flex items-center justify-center font-mono"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaHome className="mr-3" />
                Back to Home
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Role-specific Actions */}
          {user?.role === 'admin' && (
            <motion.div
              className="border-t border-gray-700/50 pt-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div className="flex items-center mb-6" variants={iconAnimation}>
                <FaShieldAlt className="text-3xl text-purple-400 mr-3" />
                <h2 className="text-3xl font-bold text-purple-300 font-mono">ADMIN ACTIONS</h2>
              </motion.div>

              <motion.div
                className="grid md:grid-cols-2 gap-6"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <motion.button
                  onClick={() => navigate('/admin')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-blue-400 flex items-center justify-center font-mono"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaBolt className="mr-3" />
                  Admin Dashboard
                </motion.button>
                <motion.button
                  onClick={() => navigate('/admin/create-tender')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-green-400 flex items-center justify-center font-mono"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus className="mr-3" />
                  Create Tender
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {user?.role === 'organizer' && (
            <motion.div
              className="border-t border-gray-700/50 pt-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div className="flex items-center mb-6" variants={iconAnimation}>
                <FaNetworkWired className="text-3xl text-orange-400 mr-3" />
                <h2 className="text-3xl font-bold text-orange-300 font-mono">ORGANIZER ACTIONS</h2>
              </motion.div>

              <motion.div
                className="grid md:grid-cols-2 gap-6"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <motion.button
                  onClick={() => navigate('/organizer')}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-orange-400 flex items-center justify-center font-mono"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaBolt className="mr-3" />
                  Organizer Dashboard
                </motion.button>
                <motion.button
                  onClick={() => navigate('/organizer/create-tender')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-green-400 flex items-center justify-center font-mono"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus className="mr-3" />
                  Create Tender
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {user?.role === 'bidder' && (
            <motion.div
              className="border-t border-gray-700/50 pt-8"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div className="flex items-center mb-6" variants={iconAnimation}>
                <FaEye className="text-3xl text-teal-400 mr-3" />
                <h2 className="text-3xl font-bold text-teal-300 font-mono">BIDDER ACTIONS</h2>
              </motion.div>

              <motion.div
                className="grid md:grid-cols-2 gap-6"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                <motion.button
                  onClick={() => navigate('/bidder')}
                  className="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-teal-400 flex items-center justify-center font-mono"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaBolt className="mr-3" />
                  My Dashboard
                </motion.button>
                <motion.button
                  onClick={() => navigate('/tenders')}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-purple-400 flex items-center justify-center font-mono"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEye className="mr-3" />
                  Browse Tenders
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
