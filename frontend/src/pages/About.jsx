import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEye, FaBolt, FaCode, FaRocket, FaGlobe, FaLock, FaCheckCircle, FaStar, FaNetworkWired, FaEthereum, FaBrain, FaInfinity } from 'react-icons/fa';

const About = () => {
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
              ABOUT E-TENDERING
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 text-gray-300 font-light"
              variants={fadeInUp}
            >
              Revolutionizing Procurement | Blockchain-Powered Transparency | Decentralized Trust
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

      {/* Mission Section */}
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
            OUR MISSION
          </motion.h2>

          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.p
              className="text-xl mb-8 text-gray-300 leading-relaxed"
              variants={fadeInUp}
            >
              To democratize public procurement through cutting-edge blockchain technology, ensuring every tender process is transparent, secure, and free from corruption. We envision a world where fair competition drives innovation and trust is embedded in every transaction.
            </motion.p>
            <motion.p
              className="text-lg text-gray-400 leading-relaxed"
              variants={fadeInUp}
            >
              Our platform eliminates intermediaries, reduces costs, and provides complete traceability. Every bid, every decision, every contract is immutably recorded on the blockchain, visible to all stakeholders while protecting sensitive information through zero-knowledge proofs.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works Section */}
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
            HOW IT WORKS
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                step: "01",
                icon: <FaRocket className="text-4xl text-cyan-400" />,
                title: "Create Tender",
                description: "Administrators deploy smart contracts with detailed tender specifications and requirements."
              },
              {
                step: "02",
                icon: <FaEthereum className="text-4xl text-purple-400" />,
                title: "Encrypted Bidding",
                description: "Bidders submit zero-knowledge proofs of their proposals, maintaining confidentiality."
              },
              {
                step: "03",
                icon: <FaLock className="text-4xl text-pink-400" />,
                title: "Blockchain Recording",
                description: "All submissions are timestamped and immutably stored on the distributed ledger."
              },
              {
                step: "04",
                icon: <FaCheckCircle className="text-4xl text-green-400" />,
                title: "Automated Evaluation",
                description: "Smart contracts execute fair winner selection based on predefined criteria."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-3xl border border-cyan-400/30 shadow-2xl text-center"
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                animate={glowAnimation}
              >
                <motion.div
                  className="text-2xl font-bold mb-4 text-cyan-300 font-mono"
                  variants={iconAnimation}
                >
                  {item.step}
                </motion.div>
                <motion.div className="mb-4" variants={iconAnimation}>
                  {item.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-cyan-300 font-mono">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
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
            ADVANCED FEATURES
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
                title: "Quantum-Resistant Security",
                description: "Future-proof cryptography protects against quantum computing threats and ensures long-term data integrity."
              },
              {
                icon: <FaEye className="text-4xl text-purple-400" />,
                title: "Real-Time Transparency",
                description: "Live dashboard monitoring with instant notifications for all stakeholders, maintaining full visibility."
              },
              {
                icon: <FaBolt className="text-4xl text-pink-400" />,
                title: "AI-Powered Analytics",
                description: "Machine learning algorithms analyze bidding patterns and provide insights for optimal decision-making."
              },
              {
                icon: <FaGlobe className="text-4xl text-green-400" />,
                title: "Global Interoperability",
                description: "Cross-chain compatibility enables seamless integration with international procurement systems."
              },
              {
                icon: <FaBrain className="text-4xl text-yellow-400" />,
                title: "Smart Contract Automation",
                description: "Self-executing contracts handle payments, deliverables, and dispute resolution autonomously."
              },
              {
                icon: <FaInfinity className="text-4xl text-indigo-400" />,
                title: "Scalable Architecture",
                description: "Layer-2 solutions ensure unlimited scalability while maintaining security and decentralization."
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

      {/* Technology Stack Section */}
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
            TECH STACK
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-4 lg:grid-cols-6 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { name: "React", color: "from-cyan-500 to-blue-500" },
              { name: "FastAPI", color: "from-green-500 to-emerald-500" },
              { name: "Solidity", color: "from-purple-500 to-pink-500" },
              { name: "Web3.js", color: "from-yellow-500 to-orange-500" },
              { name: "MongoDB", color: "from-red-500 to-pink-500" },
              { name: "Tailwind", color: "from-indigo-500 to-purple-500" }
            ].map((tech, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-r ${tech.color} p-6 rounded-2xl shadow-2xl text-center font-bold text-lg font-mono`}
                variants={fadeInUp}
                whileHover={{ scale: 1.1 }}
                animate={glowAnimation}
              >
                {tech.name}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Vision Section */}
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
            OUR VISION
          </motion.h2>
          <motion.p
            className="text-xl mb-12 text-gray-400 max-w-4xl mx-auto font-light"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            To become the global standard for decentralized procurement, empowering governments, corporations, and individuals worldwide to conduct fair, transparent, and efficient tendering processes. We aim to eliminate corruption, reduce costs by 70%, and accelerate innovation through blockchain technology.
          </motion.p>
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-bold py-4 px-10 rounded-full text-lg shadow-2xl">
              <FaCode className="inline mr-2" />
              Join the Revolution
            </div>
            <div className="bg-transparent border-2 border-purple-400 text-purple-400 font-bold py-4 px-10 rounded-full text-lg shadow-2xl">
              <FaStar className="inline mr-2" />
              Explore Whitepaper
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
