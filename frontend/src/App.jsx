import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/Toast';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import BidderDashboard from './pages/BidderDashboard';
import TenderList from './pages/TenderList';
import TenderDetail from './pages/TenderDetail';
import CreateTender from './pages/CreateTender';
import SubmitBid from './pages/SubmitBid';

function App() {
  return (
    <Router>
      <div className="w-full h-screen overflow-hidden flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/bidder" element={<BidderDashboard />} />
            <Route path="/organizer" element={<BidderDashboard />} />
            <Route path="/tenders/:id" element={<TenderDetail />} />
            <Route path="/tenders" element={<TenderList />} />
            <Route path="/admin/create-tender" element={<CreateTender />} />
            <Route path="/organizer/create-tender" element={<CreateTender />} />
            <Route path="/bidder/submit-bid/:tenderId" element={<SubmitBid />} />
          </Routes>
        </main>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
