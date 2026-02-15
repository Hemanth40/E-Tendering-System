import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUsers, FaEye, FaCheckCircle, FaStar, FaAward, FaHandshake, FaGlobe, FaEthereum, FaCode, FaBolt, FaNetworkWired } from 'react-icons/fa';

const Home = () => {
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

      {/* Hero Section */}
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
              E-TENDERING
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-300 font-light"
              variants={fadeInUp}
            >
              Decentralized Tendering Platform | Secure, Transparent, Automated
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-cyan-400"
              >
                <FaEthereum className="inline mr-2" />
                Connect Wallet
              </Link>
              <Link
                to="/about"
                className="bg-transparent border-2 border-cyan-400 hover:bg-cyan-400 hover:text-black text-cyan-400 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <FaCode className="inline mr-2" />
                Explore Protocol
              </Link>
            </motion.div>
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

      {/* Features Section */}
      <motion.div
        className="py-20 px-4 relative"
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
            WEB3 ADVANTAGES
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
                title: "Secure Bidding",
                description: "Encrypted bid submissions with zero-knowledge proofs ensure confidentiality while maintaining fairness."
              },
              {
                icon: <FaEye className="text-4xl text-purple-400" />,
                title: "Transparent Auctions",
                description: "Every tender process is immutably recorded on the blockchain, visible to all authorized participants."
              },
              {
                icon: <FaBolt className="text-4xl text-pink-400" />,
                title: "Smart Contract Automation",
                description: "Automated tender evaluation, winner selection, and contract execution through decentralized smart contracts."
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

      {/* User Types Section */}
      <motion.div
        className="py-20 px-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto">
          <motion.h2
            className="text-4xl md:text-6xl font-bold text-center mb-16 font-mono tracking-wider"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            PARTICIPANT ROLES
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 gap-12"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div
              className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 backdrop-blur-lg p-8 rounded-3xl border border-cyan-400/50"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div className="flex items-center mb-6" variants={iconAnimation}>
                <FaUsers className="text-4xl text-cyan-300 mr-4" />
                <h3 className="text-3xl font-bold font-mono">TENDER CREATORS</h3>
              </motion.div>
              <p className="text-cyan-100 mb-6 text-lg leading-relaxed">
                Control the network with validator privileges. Deploy smart contracts, monitor network health, and ensure protocol integrity.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-400 mr-3" />
                  <span>Smart contract deployment</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-400 mr-3" />
                  <span>Real-time network monitoring</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-400 mr-3" />
                  <span>Automated dispute resolution</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-block border-2 border-cyan-400"
              >
                Become Validator
              </Link>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-lg p-8 rounded-3xl border border-purple-400/50"
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
            >
              <motion.div className="flex items-center mb-6" variants={iconAnimation}>
                <FaHandshake className="text-4xl text-purple-300 mr-4" />
                <h3 className="text-3xl font-bold font-mono">BIDDER AGENTS</h3>
              </motion.div>
              <p className="text-purple-100 mb-6 text-lg leading-relaxed">
                Join the decentralized marketplace. Submit encrypted bids, participate in auctions, and earn rewards through staking.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-400 mr-3" />
                  <span>Zero-knowledge bid submission</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-400 mr-3" />
                  <span>Real-time auction feeds</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-400 mr-3" />
                  <span>Staking rewards system</span>
                </li>
              </ul>
              <Link
                to="/register"
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-black font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 inline-block border-2 border-purple-400"
              >
                Join Network
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        className="py-20 px-4 bg-gradient-to-r from-black via-gray-900 to-black text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-16 font-mono tracking-wider"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            NETWORK METRICS
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-4 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: "10K+", label: "Active Nodes", icon: <FaUsers /> },
              { number: "500+", label: "Contracts Deployed", icon: <FaAward /> },
              { number: "99.9%", label: "Network Uptime", icon: <FaStar /> },
              { number: "50+", label: "Countries Connected", icon: <FaGlobe /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-800 to-black p-6 rounded-2xl border border-cyan-400/30"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                animate={glowAnimation}
              >
                <motion.div
                  className="text-4xl mb-4 flex justify-center"
                  variants={iconAnimation}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl font-bold mb-2 text-cyan-300 font-mono">{stat.number}</div>
                <div className="text-lg opacity-90 text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="py-20 px-4 bg-gradient-to-r from-black via-gray-900 to-black text-white relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-6xl font-bold mb-8 font-mono tracking-wider"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            ENTER THE PROTOCOL
          </motion.h2>
          <motion.p
            className="text-xl mb-12 text-gray-400 max-w-2xl mx-auto font-light"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            Join the decentralized revolution. Connect your wallet, stake tokens, and participate in the future of transparent tendering.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Link
              to="/tenders"
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl border-2 border-cyan-400"
            >
              <FaNetworkWired className="inline mr-2" />
              Access Dashboard
            </Link>
            <Link
              to="/about"
              className="bg-transparent border-2 border-purple-400 hover:bg-purple-400 hover:text-black text-purple-400 font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <FaCode className="inline mr-2" />
              View Documentation
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
