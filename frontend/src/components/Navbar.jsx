import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import { FaWallet, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }

    // Listen for storage changes (in case login happens in another tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };

    // Listen for custom login event
    const handleUserLogin = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleUserLogin);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.getAccounts();
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting to wallet:', error);
      }
    } else {
      alert('Please install MetaMask to connect your wallet!');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setWalletAddress('');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl mx-4 mt-4">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
            🚀 E-Tendering
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105">
              Home
            </Link>
            <Link to="/about" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105">
              About
            </Link>
            <Link to="/tenders" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105">
              Tenders
            </Link>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105">
                      Admin Dashboard
                    </Link>
                    <Link to="/admin/create-tender" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105">
                      Create Tender
                    </Link>
                  </>
                )}

                {user.role === 'organizer' && (
                  <>
                    <Link to="/organizer" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105">
                      Organizer Dashboard
                    </Link>
                    <Link to="/organizer/create-tender" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105">
                      Create Tender
                    </Link>
                  </>
                )}

                {user.role === 'bidder' && (
                  <Link to="/bidder" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105">
                    My Dashboard
                  </Link>
                )}

                <Link to="/profile" className="text-white/80 hover:text-white transition-colors duration-300 hover:scale-105">
                  Profile
                </Link>

                <div className="flex items-center space-x-3">
                  <span className="text-white/60 text-sm">
                    Welcome, {user.username} ({user.role})
                  </span>

                  {walletAddress && (
                    <span className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1 rounded-full text-white font-medium">
                      <FaWallet className="inline mr-1" />
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  )}

                  <button
                    onClick={connectWallet}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <FaWallet className="inline mr-2" />
                    {walletAddress ? 'Connected' : 'Connect Wallet'}
                  </button>

                  <button
                    onClick={logout}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-6 py-2 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                  Login
                </Link>
                <Link to="/register" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-6 py-2 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-cyan-400 transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/30 backdrop-blur-xl border-t border-white/10 rounded-b-2xl overflow-hidden">
            <div className="px-6 py-4 space-y-4">
              <Link to="/" className="block text-white/80 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/about" className="block text-white/80 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
                About
              </Link>
              <Link to="/tenders" className="block text-white/80 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
                Tenders
              </Link>

              {user ? (
                <>
                  {user.role === 'admin' && (
                    <>
                      <Link to="/admin" className="block text-white/80 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
                        Admin Dashboard
                      </Link>
                      <Link to="/admin/create-tender" className="block text-white/80 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
                        Create Tender
                      </Link>
                    </>
                  )}

                  {user.role === 'organizer' && (
                    <>
                      <Link to="/organizer" className="block text-white/80 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
                        Organizer Dashboard
                      </Link>
                      <Link to="/organizer/create-tender" className="block text-white/80 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
                        Create Tender
                      </Link>
                    </>
                  )}

                  {user.role === 'bidder' && (
                    <Link to="/bidder" className="block text-white/80 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
                      My Dashboard
                    </Link>
                  )}

                  <Link to="/profile" className="block text-white/80 hover:text-white transition-colors duration-300" onClick={toggleMenu}>
                    Profile
                  </Link>

                  <div className="pt-4 space-y-3">
                    <span className="block text-white/60 text-sm">
                      Welcome, {user.username} ({user.role})
                    </span>

                    {walletAddress && (
                      <span className="block text-xs bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-2 rounded-full text-white font-medium">
                        <FaWallet className="inline mr-2" />
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </span>
                    )}

                    <button
                      onClick={() => { connectWallet(); toggleMenu(); }}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-lg"
                    >
                      <FaWallet className="inline mr-2" />
                      {walletAddress ? 'Connected' : 'Connect Wallet'}
                    </button>

                    <button
                      onClick={() => { logout(); toggleMenu(); }}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-lg"
                    >
                      <FaSignOutAlt className="inline mr-2" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-4 space-y-3">
                  <Link to="/login" className="block bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-lg text-center" onClick={toggleMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="block bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-full text-white font-medium transition-all duration-300 shadow-lg text-center" onClick={toggleMenu}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
