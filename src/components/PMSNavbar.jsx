import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout as apiLogout } from '../api/logout';
import { motion, AnimatePresence } from 'framer-motion';
import { Church, Menu, X } from 'lucide-react';

/**
 * PMSNavbar - Top navigation for the Pastor Management System landing page
 * Props:
 * - onEnterSystem: () => void  // callback when user clicks "Enter System"
 */
const PMSNavbar = ({ onEnterSystem }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const handleEnter = () => {
    if (onEnterSystem) {
      onEnterSystem();
    } else {
      navigate('/dashboard');
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // ignore error, just clear token
    }
    localStorage.removeItem('token');
    navigate('/auth');
  };

  return (
  <nav style={{ backgroundColor: '#779B98' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
            <h1 className="text-2xl font-bold" style={{ color: '#281572' }}>RCCG AKP7 PASTORS</h1>
          </motion.div>

          <div className="hidden md:flex flex-1 justify-center items-center">
            {isAuthenticated && (
              <div className="flex space-x-6">
                <button
                  onClick={() => navigate('/zones-areas-parishes')}
                  className="font-semibold px-4 py-2 rounded-lg transition-colors"
                  style={{ color: '#281572' }}
                  onMouseOver={e => e.currentTarget.style.color = '#1e1047'}
                  onMouseOut={e => e.currentTarget.style.color = '#281572'}
                >
                  Zones
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="font-semibold px-4 py-2 rounded-lg transition-colors"
                  style={{ color: '#281572' }}
                  onMouseOver={e => e.currentTarget.style.color = '#1e1047'}
                  onMouseOut={e => e.currentTarget.style.color = '#281572'}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/user/profile')}
                  className="font-semibold px-4 py-2 rounded-lg transition-colors"
                  style={{ color: '#281572' }}
                  onMouseOver={e => e.currentTarget.style.color = '#1e1047'}
                  onMouseOut={e => e.currentTarget.style.color = '#281572'}
                >
                  Profile
                </button>
                <button
                  onClick={() => navigate('/pastors/new')}
                  className="font-semibold px-4 py-2 rounded-lg transition-colors"
                  style={{ color: '#281572' }}
                  onMouseOver={e => e.currentTarget.style.color = '#1e1047'}
                  onMouseOut={e => e.currentTarget.style.color = '#281572'}
                >
                  Add Pastor
                </button>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
                style={{ backgroundColor: '#D9524E' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#D5413C'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#D9524E'}
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={handleEnter}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
                >
                  Enter System
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate('/dashboard'); }}
                    className="w-full font-semibold px-4 py-2 rounded-lg transition-colors"
                    style={{ color: '#281572' }}
                    onMouseOver={e => e.currentTarget.style.color = '#1e1047'}
                    onMouseOut={e => e.currentTarget.style.color = '#281572'}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate('/user/profile'); }}
                    className="w-full font-semibold px-4 py-2 rounded-lg transition-colors"
                    style={{ color: '#281572' }}
                    onMouseOver={e => e.currentTarget.style.color = '#1e1047'}
                    onMouseOut={e => e.currentTarget.style.color = '#281572'}
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate('/pastors/new'); }}
                    className="w-full font-semibold px-4 py-2 rounded-lg transition-colors"
                    style={{ color: '#281572' }}
                    onMouseOver={e => e.currentTarget.style.color = '#1e1047'}
                    onMouseOut={e => e.currentTarget.style.color = '#281572'}
                  >
                    Add Pastor
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setIsMenuOpen(false); navigate('/auth'); }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Login
                  </button>
                  <button
                    onClick={handleEnter}
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Enter System
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default PMSNavbar;
