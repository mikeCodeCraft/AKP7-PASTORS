import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Award, 
  Heart, 
  Home,
  Menu,
  X,
  Edit,
  Eye,
  ChevronRight,
  Church,
  UserPlus,
  Settings
} from 'lucide-react';
import AddPastorForm from './AddPastorForm';
import PastorProfile from './PastorProfile';
import PrivateRoute from './PrivateRoute';
import { getPastors as apiGetPastors } from '../api/pastors';

const PastorManagementSystem = ({
  searchTerm,
  setSearchTerm,
  selectedPastor,
  setSelectedPastor,
  pastors,
  setPastors,
  page
}) => {
  const navigate = useNavigate();
  
  // Map API Pastor (serializer shape) -> UI pastor card shape
  const mapPastor = (p) => ({
    id: p.id,
    fullName: p.full_name || '',
    title: p?.professional_info?.title || '',
    photo: p.photograph_url || p.photograph || 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400',
    birthdate: p.birthdate || '',
    phone: p.phone || '',
    email: p.email || '',
    address: p.residential_address || '',
    ordinationDate: p?.professional_info?.ordination_date || '',
    employmentStatus: p?.professional_info?.employment_status || '',
    spouse: p?.family_info?.spouse_name || '',
    children: Array.isArray(p?.children) ? p.children.map(c => c?.name).filter(Boolean) : [],
    anniversary: p?.family_info?.wedding_anniversary || '',
    spiritualGifts: (() => {
      const sg = p?.skills_gifts?.spiritual_gifts;
      if (!sg) return [];
      return Array.isArray(sg) ? sg : String(sg).split(',').map(s => s.trim()).filter(Boolean);
    })(),
    education: (() => {
      const deg = p?.education_training?.degrees;
      if (!deg) return [];
      return Array.isArray(deg) ? deg : String(deg).split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    })(),
    appointments: Array.isArray(p?.appointments)
      ? p.appointments.map(a => ({
          church: p.current_parish || '',
          date: a?.start_date || '',
          role: a?.title || a?.category || '',
        }))
      : [],
  });

  // Load pastors from backend when on dashboard and authenticated
  useEffect(() => {
    if (page !== 'dashboard') return;
    const token = localStorage.getItem('token');
    if (!token) { setPastors([]); return; }
    let cancelled = false;
    (async () => {
      try {
        const res = await apiGetPastors(token);
        const data = res?.data;
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];
        if (!cancelled) {
          setPastors(items.map(mapPastor));
        }
      } catch (err) {
        // Non-blocking: keep any local seed data
        console.error('Failed to fetch pastors:', err?.response?.data || err?.message || err);
      }
    })();
    return () => { cancelled = true; };
  }, [page, setPastors]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Landing Page Component
  const LandingPage = () => (
    <div className="min-h-screen ">
      {/* Navbar is rendered globally in App */}

      {/* Hero Section */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
           

            <motion.h1
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              variants={fadeInUp}
            >
              Pastor Management
              <br />
              <span style={{ color: '#281572' }}>System</span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Comprehensive database system for managing pastoral information, appointments, 
              and ministry assignments. Keep track of your pastoral team with detailed profiles 
              and administrative tools.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              variants={fadeInUp}
            >
              <motion.button
                onClick={() => navigate('/dashboard')}
                className="text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#281572' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e1047'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#281572'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-5 h-5" />
                View Dashboard
              </motion.button>

              <motion.button
                onClick={() => navigate('/pastors/new')}
                className="border" style={{ borderColor: '#281572', color: '#281572' }}
                onMouseOver={e => { e.currentTarget.style.backgroundColor = '#281572'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = '#281572'; }}
                // ...existing code...
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-5 h-5" />
                Add Pastor
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Complete Pastor Database Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your pastoral team effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <User className="w-8 h-8" />,
                title: "Personal Information",
                description: "Store comprehensive personal details, contact information, and family data"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Professional Records",
                description: "Track ordination dates, employment status, and ministry positions"
              },
              {
                icon: <BookOpen className="w-8 h-8" />,
                title: "Education & Training",
                description: "Manage educational background and theological training records"
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Spiritual Gifts",
                description: "Document spiritual gifts, talents, and areas of ministry expertise"
              },
              {
                icon: <Church className="w-8 h-8" />,
                title: "Appointments",
                description: "Track pastoral appointments, transfers, and church assignments"
              },
              {
                icon: <Settings className="w-8 h-8" />,
                title: "Administration",
                description: "Comprehensive admin tools for managing the entire system"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-8 hover:bg-gray-100 transition-colors duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 rounded-lg flex items-center justify-center text-white mb-6" style={{ backgroundColor: '#281572' }}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  // Admin Dashboard Component
  const AdminDashboard = () => {
    const filteredPastors = pastors.filter(pastor =>
      pastor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pastor.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <Church className="w-8 h-8" style={{ color: '#281572' }} />
                <h1 className="text-2xl font-bold text-gray-900">Pastor Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.location.assign('/pastors/new')}
                  className="text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                  style={{ backgroundColor: '#281572' }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e1047'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = '#281572'}
                >
                  <Plus className="w-4 h-4" />
                  Add Pastor
                </button>
                <button
                  onClick={() => window.location.assign('/')}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <Home className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* Search and Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pastors by name or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pastors</p>
                  <p className="text-2xl font-bold text-gray-900">{pastors.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Full Pastors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pastors.filter(p => p.title === 'full_pastor').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Assistant Pastors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pastors.filter(p => p.title === 'assistant_pastor').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Deacons</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pastors.filter(p => p.title === 'deacon').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Pastor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPastors.map((pastor, index) => (
              <motion.div
                key={pastor.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={pastor.photo}
                      alt={pastor.fullName}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{pastor.fullName}</h3>
                      <p className="text-sm font-medium" style={{ color: '#281572' }}>{pastor.title}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{pastor.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{pastor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Ordained: {new Date(pastor.ordinationDate).getFullYear()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedPastor(pastor);
                        window.location.assign(`/pastors/${pastor.id}`);
                      }}
                      className="flex-1 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                      style={{ backgroundColor: '#281572' }}
                      onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e1047'}
                      onMouseOut={e => e.currentTarget.style.backgroundColor = '#281572'}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // PastorProfile moved to its own component



  // Add Pastor handler shared by route
  const handleAddPastor = (data) => {
    const newPastor = {
      id: Date.now(),
      fullName: data.fullName,
      title: data.title,
      photo: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=400',
      birthdate: data.birthdate || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      ordinationDate: data.ordinationDate || '',
      employmentStatus: data.employmentStatus || 'Full-time',
      spouse: data.spouse || '',
      children: (data.children || '')
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(Boolean),
      anniversary: data.anniversary || '',
      spiritualGifts: (data.spiritualGifts || '')
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      education: (data.education || '')
        .split(/\r?\n/)
        .map(s => s.trim())
        .filter(Boolean),
      appointments: []
    };
    setPastors(prev => [newPastor, ...prev]);
    navigate('/dashboard');
  };

  // Render correct page based on prop
  if (page === 'dashboard') {
    return <AdminDashboard />;
  }
  // Default: landing page
  return <LandingPage />;
};

export default PastorManagementSystem;