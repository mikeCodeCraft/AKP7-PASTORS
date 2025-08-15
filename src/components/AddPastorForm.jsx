import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Award, Heart, BookOpen, Plus, ChevronRight } from 'lucide-react';
import { createPastor, updatePastor } from '../api/pastors';

/**
 * AddPastorForm - standalone form component
 * Props:
 * - onCancel: () => void
 * - onSubmit: (formData) => void
 */
const AddPastorForm = ({ onCancel, onSubmit, pastorId = null, initialData = null }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    title: '',
    birthdate: '',
    phone: '',
    email: '',
    address: '',
    ordinationDate: '',
    employmentStatus: 'Full-time',
    spouse: '',
    children: '',
    anniversary: '',
    spiritualGifts: '',
    education: '',
    photograph: null,
  });

  // Prefill for edit mode if initialData is provided
  useEffect(() => {
    if (!initialData) return;
    setFormData(prev => ({
      ...prev,
      fullName: initialData.full_name || initialData.fullName || '',
      title: initialData?.professional_info?.title || initialData.title || '',
      birthdate: initialData.birthdate || '',
      phone: initialData.phone || '',
      email: initialData.email || '',
      address: initialData.residential_address || initialData.address || '',
      ordinationDate: initialData?.professional_info?.ordination_date || initialData.ordinationDate || '',
      employmentStatus: initialData?.professional_info?.employment_status || initialData.employmentStatus || 'Full-time',
      spouse: initialData?.family_info?.spouse_name || initialData.spouse || '',
      children: Array.isArray(initialData?.children) ? initialData.children.map(c => c?.name || '').filter(Boolean).join('\n') : (initialData.children || ''),
      anniversary: initialData?.family_info?.wedding_anniversary || initialData.anniversary || '',
      spiritualGifts: Array.isArray(initialData?.skills_gifts?.spiritual_gifts)
        ? initialData.skills_gifts.spiritual_gifts.join(', ')
        : (initialData.spiritualGifts || initialData?.skills_gifts?.spiritual_gifts || ''),
      education: Array.isArray(initialData?.education_training?.degrees)
        ? initialData.education_training.degrees.join('\n')
        : (initialData.education || initialData?.education_training?.degrees || ''),
      photograph: null,
    }));
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Map UI form data -> API serializer payload
    const payload = {
      full_name: formData.fullName,
      birthdate: formData.birthdate || null,
      photograph: formData.photograph || null, // File or null
      phone: formData.phone || '',
      email: formData.email || '',
      residential_address: formData.address || '',
      family_info: {
        spouse_name: formData.spouse || '',
        wedding_anniversary: formData.anniversary || null,
      },
      professional_info: {
        title: formData.title || '',
        ordination_date: formData.ordinationDate || null,
        employment_status: formData.employmentStatus || 'Full-time',
      },
      education_training: {
        // Join lines into a single text block; backend can store as text
        degrees: (formData.education || '').trim(),
      },
      skills_gifts: {
        spiritual_gifts: (formData.spiritualGifts || '').trim(),
      },
      children: (formData.children || '')
        .split(/\r?\n/)
        .map(name => name.trim())
        .filter(Boolean)
        .map(name => ({ name })),
      // Advanced fields you can wire later:
      // past_postings, planted_parish_links, appointments
    };

    const token = localStorage.getItem('token');

    try {
      let resp;
      if (pastorId) {
        resp = await updatePastor(pastorId, payload, token, 'patch');
      } else {
        resp = await createPastor(payload, token);
      }
      // Call optional callback with API response data
      onSubmit?.(resp?.data || formData);
      // Navigate to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : (err?.message || 'Submission failed');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{pastorId ? 'Edit Pastor' : 'Add New Pastor'}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm break-words">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Rev. John Smith"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photograph</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, photograph: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <select
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Title</option>
                  <option value="Senior Pastor">Senior Pastor</option>
                  <option value="Associate Pastor">Associate Pastor</option>
                  <option value="Assistant Pastor">Assistant Pastor</option>
                  <option value="Deacon">Deacon</option>
                  <option value="Deaconess">Deaconess</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="pastor@church.org"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="123 Faith Street, City, State ZIP"
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Professional Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordination Date</label>
                <input
                  type="date"
                  value={formData.ordinationDate}
                  onChange={(e) => setFormData({ ...formData, ordinationDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Status</label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-600" />
                Family Information
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Name</label>
                <input
                  type="text"
                  value={formData.spouse}
                  onChange={(e) => setFormData({ ...formData, spouse: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anniversary Date</label>
                <input
                  type="date"
                  value={formData.anniversary}
                  onChange={(e) => setFormData({ ...formData, anniversary: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Children Names (one per line)</label>
                <textarea
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder={`John Smith Jr.\nJane Smith`}
                />
              </div>
            </div>
          </div>

          {/* Skills and Education */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Skills & Education
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spiritual Gifts (comma separated)</label>
                <input
                  type="text"
                  value={formData.spiritualGifts}
                  onChange={(e) => setFormData({ ...formData, spiritualGifts: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leadership, Teaching, Evangelism"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education & Training (one per line)</label>
                <textarea
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder={`M.Div - Seminary Name\nB.A. Theology - College Name`}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 ${submitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Plus className="w-5 h-5" />
              {submitting ? (pastorId ? 'Saving...' : 'Adding...') : (pastorId ? 'Save Changes' : 'Add Pastor')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPastorForm;
