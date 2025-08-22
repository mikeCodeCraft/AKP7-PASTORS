import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Award, Heart, BookOpen, Plus, ChevronRight } from 'lucide-react';
import { createPastor, updatePastor } from '../api/pastors';
import { getParishes } from '../api/parishes';

/**
 * AddPastorForm - standalone form component
 * Props:
 * - onCancel: () => void
 * - onSubmit: (data) => void
 * - pastorId?: string | number (edit mode)
 * - initialData?: object (prefill)
 */
const AddPastorForm = ({ onCancel, onSubmit, pastorId = null, initialData = null }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [parishes, setParishes] = useState([]);
  const [parishesLoading, setParishesLoading] = useState(false);
  const [parishesError, setParishesError] = useState('');

  const allowedAppointmentCategories = ['pastoral'];

  const [formData, setFormData] = useState({
    // Personal
    fullName: '',
    birthdate: '',
    phone: '',
    email: '',
    nationality: '',
    state: '',
    localGovernment: '',
    homeTown: '',
    address: '',
  createdBy: '',
  updatedBy: '',
  currentParish: '', // parish id (number as string) for current_parish
    photograph: null,

    // Professional
    title: '', // enum codes expected by backend: ,full_pastor assistant_pastor, deacon
    ordinationDate: '',
    hireDate: '',
    employmentStatus: 'full_time', // enum codes: full_time, part_time

    // Family
    spouse: '',
    spousePhone: '',
    spousePhoto: null,
    anniversary: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinPhone: '',
    nextOfKinAddress: '',

    // Milestones
    year_joined_rccg: '',
    year_saved: '',
    year_baptized: '',
    year_workers_training_completed: '',
    year_school_of_disciple_completed: '',
    year_bible_college_completed: '',
    year_house_fellowship_leadership_training_completed: '',
    Year_of_last_ordination: '',

    // Education & Skills
    educationalBackground: '',
    degrees: '',
    theologicalTraining: '',
    ministryTraining: '',
    spiritualGifts: '',
    talents: '',
    areasOfExpertise: '',

    // Collections
    childrenRows: [{ name: '', age: '' }],
    pastPostingsRows: [{ parish: '', start_date: '', transferred_date: '' }],
    plantedParishRows: [{ parish: '', planted_date: '' }],
  appointmentsRows: [{ title: '', description: '', category: 'pastoral', start_date: '', end_date: '' }],
  });

  // Prefill for edit mode if initialData is provided
  useEffect(() => {
    if (!initialData) return;
    setFormData(prev => ({
      ...prev,
      fullName: initialData.full_name || initialData.fullName || '',
      birthdate: initialData.birthdate || '',
      phone: initialData.phone || '',
      email: initialData.email || '',
      nationality: initialData.nationality || '',
      state: initialData.state || '',
      localGovernment: initialData.local_government || '',
      homeTown: initialData.home_town || '',
      address: initialData.residential_address || initialData.address || '',
  createdBy: initialData.created_by || '',
  updatedBy: initialData.updated_by || '',
      currentParish: (() => {
        // Accept several possible shapes: id, object {id}, or name (ignored for id select)
        if (typeof initialData.current_parish === 'number' || typeof initialData.current_parish === 'string') {
          return String(initialData.current_parish);
        }
        if (initialData.current_parish_id) return String(initialData.current_parish_id);
        if (initialData.currentParish) return String(initialData.currentParish);
        if (initialData.current_parish && typeof initialData.current_parish === 'object') {
          return initialData.current_parish.id ? String(initialData.current_parish.id) : '';
        }
        return '';
      })(),

      title: initialData?.professional_info?.title || initialData.title || '',
      ordinationDate: initialData?.professional_info?.ordination_date || '',
      hireDate: initialData?.professional_info?.hire_date || '',
      employmentStatus: initialData?.professional_info?.employment_status || 'full_time',

      spouse: initialData?.family_info?.spouse_name || initialData.spouse || '',
      spousePhone: initialData?.family_info?.spouse_phone || '',
      spousePhoto: null,
      anniversary: initialData?.family_info?.wedding_anniversary || '',
      nextOfKinName: initialData?.family_info?.next_of_kin_name || '',
      nextOfKinRelationship: initialData?.family_info?.next_of_kin_relationship || '',
      nextOfKinPhone: initialData?.family_info?.next_of_kin_phone || '',
      nextOfKinAddress: initialData?.family_info?.next_of_kin_address || '',

      year_joined_rccg: initialData?.milestones?.year_joined_rccg || '',
      year_saved: initialData?.milestones?.year_saved || '',
      year_baptized: initialData?.milestones?.year_baptized || '',
      year_workers_training_completed: initialData?.milestones?.year_workers_training_completed || '',
      year_school_of_disciple_completed: initialData?.milestones?.year_school_of_disciple_completed || '',
      year_bible_college_completed: initialData?.milestones?.year_bible_college_completed || '',
      year_house_fellowship_leadership_training_completed: initialData?.milestones?.year_house_fellowship_leadership_training_completed || '',
      Year_of_last_ordination: initialData?.milestones?.Year_of_last_ordination || '',

      educationalBackground: initialData?.education_training?.educational_background || '',
      degrees: initialData?.education_training?.degrees || '',
      theologicalTraining: initialData?.education_training?.theological_training || '',
      ministryTraining: initialData?.education_training?.ministry_training || '',

      spiritualGifts: initialData?.skills_gifts?.spiritual_gifts || '',
      talents: initialData?.skills_gifts?.talents || '',
      areasOfExpertise: initialData?.skills_gifts?.areas_of_expertise || '',

      childrenRows: Array.isArray(initialData?.children) && initialData.children.length
        ? initialData.children.map(c => ({ name: c?.name || '', age: c?.age ?? '' }))
        : [{ name: '', age: '' }],
      pastPostingsRows: Array.isArray(initialData?.past_postings) && initialData.past_postings.length
        ? initialData.past_postings.map(p => ({ parish: p?.parish ?? '', start_date: p?.start_date || '', transferred_date: p?.transferred_date || '' }))
        : [{ parish: '', start_date: '', transferred_date: '' }],
      plantedParishRows: Array.isArray(initialData?.planted_parish_links) && initialData.planted_parish_links.length
        ? initialData.planted_parish_links.map(pl => ({ parish: pl?.parish ?? '', planted_date: pl?.planted_date || '' }))
        : [{ parish: '', planted_date: '' }],
      appointmentsRows: Array.isArray(initialData?.appointments) && initialData.appointments.length
        ? initialData.appointments.map(a => ({
            title: a?.title || '',
            description: a?.description || '',
            category: allowedAppointmentCategories.includes(a?.category) ? a.category : 'pastoral',
            start_date: a?.start_date || '',
            end_date: a?.end_date || ''
          }))
        : [{ title: '', description: '', category: 'pastoral', start_date: '', end_date: '' }],

      photograph: null,
    }));
  }, [initialData]);

  // Load parishes for dropdowns
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const loadParishes = async () => {
      setParishesLoading(true);
      setParishesError('');
      try {
        const resp = await getParishes(token);
        const items = Array.isArray(resp?.data?.results) ? resp.data.results : (resp?.data || []);
        setParishes(items);
      } catch (e) {
        setParishes([]);
        setParishesError(e?.response?.status ? `Failed to load parishes (${e.response.status})` : 'Failed to load parishes');
      } finally {
        setParishesLoading(false);
      }
    };
    loadParishes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Build nested arrays from row editors
    const children = (formData.childrenRows || [])
      .filter(r => r.name)
      .map(r => ({ name: r.name, age: r.age ? Number(r.age) : 0 }));
    const past_postings = (formData.pastPostingsRows || [])
      .filter(r => r.parish && r.start_date)
      .map(r => ({ parish: Number(r.parish), start_date: r.start_date, transferred_date: r.transferred_date || null }));
    const planted_parish_links = (formData.plantedParishRows || [])
      .filter(r => r.parish && r.planted_date)
      .map(r => ({ parish: Number(r.parish), planted_date: r.planted_date }));
    const appointments = (formData.appointmentsRows || [])
      .filter(r => r.title)
      .map(r => ({
        title: r.title,
        description: r.description || '',
        category: allowedAppointmentCategories.includes(r.category) ? r.category : 'pastoral',
        start_date: r.start_date || null,
        end_date: r.end_date || null
      }));

  // Map UI form data -> API serializer payload (JSON-only for main request)
    const payload = {
      full_name: formData.fullName,
      birthdate: formData.birthdate || null,
      phone: formData.phone || '',
      email: formData.email || '',
      updated_by: formData.updatedBy || '',
      created_by: formData.createdBy || '',
      nationality: formData.nationality || '',
      state: formData.state || '',
      local_government: formData.localGovernment || '',
      home_town: formData.homeTown || '',
      residential_address: formData.address || '',
      current_parish: formData.currentParish ? Number(formData.currentParish) : null,
      family_info: {
        spouse_name: formData.spouse || '',
        spouse_phone: formData.spousePhone || '',
        wedding_anniversary: formData.anniversary || null,
        next_of_kin_name: formData.nextOfKinName || '',
        next_of_kin_relationship: formData.nextOfKinRelationship || '',
        next_of_kin_phone: formData.nextOfKinPhone || '',
        next_of_kin_address: formData.nextOfKinAddress || '',
      },
      professional_info: {
        title: formData.title || '',
        ordination_date: formData.ordinationDate || null,
        hire_date: formData.hireDate || null,
        employment_status: formData.employmentStatus || 'full_time',
      },
      milestones: {
        year_joined_rccg: formData.year_joined_rccg || null,
        year_saved: formData.year_saved || null,
        year_baptized: formData.year_baptized || null,
        year_workers_training_completed: formData.year_workers_training_completed || null,
        year_school_of_disciple_completed: formData.year_school_of_disciple_completed || null,
        year_bible_college_completed: formData.year_bible_college_completed || null,
        year_house_fellowship_leadership_training_completed: formData.year_house_fellowship_leadership_training_completed || null,
        Year_of_last_ordination: formData.Year_of_last_ordination || null,
      },
      education_training: {
        educational_background: (formData.educationalBackground || '').trim(),
        degrees: (formData.degrees || '').trim(),
        theological_training: (formData.theologicalTraining || '').trim(),
        ministry_training: (formData.ministryTraining || '').trim(),
      },
      skills_gifts: {
        spiritual_gifts: (formData.spiritualGifts || '').trim(),
        talents: (formData.talents || '').trim(),
        areas_of_expertise: (formData.areasOfExpertise || '').trim(),
      },
      children,
      past_postings,
      planted_parish_links,
      appointments,
    };

    const token = localStorage.getItem('token');

    try {
      let resp;
      if (pastorId) {
        // Update JSON fields first
        resp = await updatePastor(pastorId, payload, token, 'patch');
        // Upload photograph separately if provided
        if (formData.photograph) {
          await updatePastor(pastorId, { photograph: formData.photograph }, token, 'patch');
        }
        // Upload spouse photo separately if provided
        if (formData.spousePhoto) {
          await updatePastor(pastorId, { spouse_photo: formData.spousePhoto }, token, 'patch');
        }
      } else {
        // Create JSON first
        resp = await createPastor(payload, token);
        // Upload photograph separately if provided
        const created = resp?.data;
        if (formData.photograph && created?.id) {
          await updatePastor(created.id, { photograph: formData.photograph }, token, 'patch');
        }
        // Upload spouse photo separately if provided
        if (formData.spousePhoto && created?.id) {
          await updatePastor(created.id, { spouse_photo: formData.spousePhoto }, token, 'patch');
        }
      }
      onSubmit?.(resp?.data || formData);
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : (err?.message || 'Submission failed');
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const yearInput = (key, label) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type="number"
        min="1900"
        max={new Date().getFullYear()}
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
      />
    </div>
  );

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  placeholder="Surname, first-name middle-name"
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
                  <option value="full_pastor">Pastor</option>
                  <option value="assistant_pastor">Assistant Pastor</option>
                  <option value="deacon">Deacon/Deaconess</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Parish</label>
                <select
                  value={formData.currentParish}
                  onChange={(e) => setFormData({ ...formData, currentParish: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Current Parish</option>
                  {parishesLoading && (
                    <option value="" disabled>Loading…</option>
                  )}
                  {!parishesLoading && parishes.length === 0 && (
                    <option value="" disabled>No parishes found</option>
                  )}
                  {!parishesLoading && parishes.map(p => (
                    <option key={p.id} value={p.id}>{p.name || (`Parish #${p.id}`)}</option>
                  ))}
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
                  placeholder="+234 706 2401 262"
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nigeria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Akwa-ibom state"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Local Government</label>
                <input
                  type="text"
                  value={formData.localGovernment}
                  onChange={(e) => setFormData({ ...formData, localGovernment: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Home Town</label>
                <input
                  type="text"
                  value={formData.homeTown}
                  onChange={(e) => setFormData({ ...formData, homeTown: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Town"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Current Address"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Employment as a full timer</label>
                <input
                  type="date"
                  value={formData.hireDate}
                  onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
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
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Phone</label>
                <input
                  type="text"
                  value={formData.spousePhone}
                  onChange={(e) => setFormData({ ...formData, spousePhone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spouse Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, spousePhoto: e.target.files?.[0] || null })}
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

              {/* Children rows */}
              <div className="md:col-span-2 grid gap-3">
                <label className="block text-sm font-medium text-gray-700">Children</label>
                {formData.childrenRows.map((row, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={row.name}
                      onChange={(e) => {
                        const next = [...formData.childrenRows];
                        next[idx].name = e.target.value;
                        setFormData({ ...formData, childrenRows: next });
                      }}
                      className="md:col-span-4 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Age"
                      value={row.age}
                      onChange={(e) => {
                        const next = [...formData.childrenRows];
                        next[idx].age = e.target.value;
                        setFormData({ ...formData, childrenRows: next });
                      }}
                      className="md:col-span-2 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <button type="button" className="px-3 py-2 border rounded" onClick={() => setFormData({ ...formData, childrenRows: [...formData.childrenRows, { name: '', age: '' }] })}>Add Child</button>
                  {formData.childrenRows.length > 1 && (
                    <button type="button" className="px-3 py-2 border rounded" onClick={() => setFormData({ ...formData, childrenRows: formData.childrenRows.slice(0, -1) })}>Remove</button>
                  )}
                </div>
              </div>

              {/* Next of kin */}
              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next of Kin Name</label>
                  <input type="text" value={formData.nextOfKinName} onChange={(e) => setFormData({ ...formData, nextOfKinName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                  <input type="text" value={formData.nextOfKinRelationship} onChange={(e) => setFormData({ ...formData, nextOfKinRelationship: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next of Kin Phone</label>
                  <input type="text" value={formData.nextOfKinPhone} onChange={(e) => setFormData({ ...formData, nextOfKinPhone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next of Kin Address</label>
                  <input type="text" value={formData.nextOfKinAddress} onChange={(e) => setFormData({ ...formData, nextOfKinAddress: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Talents</label>
                <input
                  type="text"
                  value={formData.talents}
                  onChange={(e) => setFormData({ ...formData, talents: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Music, Writing"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise</label>
                <input
                  type="text"
                  value={formData.areasOfExpertise}
                  onChange={(e) => setFormData({ ...formData, areasOfExpertise: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Counseling, Youth Ministry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Educational Qualification (s)</label>
                <textarea
                  value={formData.educationalBackground}
                  onChange={(e) => setFormData({ ...formData, educationalBackground: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="ssce, Diploma, Bsc "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theological Training</label>
                <textarea
                  value={formData.theologicalTraining}
                  onChange={(e) => setFormData({ ...formData, theologicalTraining: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="2"
                  placeholder="Bible College, School of mission..."
                />
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">Milestones</h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {yearInput('year_joined_rccg', 'Year Joined RCCG')}
              {yearInput('year_saved', 'Year Saved')}
              {yearInput('year_baptized', 'Year Baptized')}
              {yearInput('year_workers_training_completed', 'Year Workers In Training Completed')}
              {yearInput('year_school_of_disciple_completed', 'Year SOD Completed')}
              {yearInput('year_bible_college_completed', 'Year Bible College Completed')}
              {yearInput('year_house_fellowship_leadership_training_completed', 'Year House Fellowship Leadership Training Completed')}
              {yearInput('Year_of_last_ordination', 'Year of Last Ordination')}
            </div>
          </div>

          {/* Postings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Postings <i>(starting with current parish)</i></h2>
                <div className="flex items-center gap-2 text-sm">
                  {parishesLoading && <span className="text-gray-500">Loading parishes…</span>}
                  {parishesError && <span className="text-red-600">{parishesError}</span>}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {formData.pastPostingsRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <select
                    value={row.parish}
                    onChange={(e) => { const next = [...formData.pastPostingsRows]; next[idx].parish = e.target.value; setFormData({ ...formData, pastPostingsRows: next }); }}
                    className="px-3 py-2 border rounded md:col-span-3"
                  >
                    <option value="">Select Parish</option>
                    {parishesLoading && (
                      <option value="" disabled>Loading…</option>
                    )}
                    {!parishesLoading && parishes.length === 0 && (
                      <option value="" disabled>No parishes found</option>
                    )}
                    {!parishesLoading && parishes.map(p => (
                      <option key={p.id} value={p.id}>{p.name || (`Parish #${p.id}`)}</option>
                    ))}
                  </select>
                  <input type="date" placeholder="Start Date" value={row.start_date} onChange={(e) => { const next = [...formData.pastPostingsRows]; next[idx].start_date = e.target.value; setFormData({ ...formData, pastPostingsRows: next }); }} className="px-3 py-2 border rounded md:col-span-2" />
                  <input type="date" placeholder="Transferred Date" value={row.transferred_date} onChange={(e) => { const next = [...formData.pastPostingsRows]; next[idx].transferred_date = e.target.value; setFormData({ ...formData, pastPostingsRows: next }); }} className="px-3 py-2 border rounded md:col-span-1" />
                </div>
              ))}
              <div className="flex gap-2">
                <button type="button" className="px-3 py-2 border rounded" onClick={() => setFormData({ ...formData, pastPostingsRows: [...formData.pastPostingsRows, { parish: '', start_date: '', transferred_date: '' }] })}>Add Posting</button>
                {formData.pastPostingsRows.length > 1 && (
                  <button type="button" className="px-3 py-2 border rounded" onClick={() => setFormData({ ...formData, pastPostingsRows: formData.pastPostingsRows.slice(0, -1) })}>Remove</button>
                )}
              </div>
            </div>
          </div>

          {/* Planted Parishes */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Your Planted Parishes</h2>
                <div className="flex items-center gap-2 text-sm">
                  {parishesLoading && <span className="text-gray-500">Loading parishes…</span>}
                  {parishesError && <span className="text-red-600">{parishesError}</span>}
                </div>
              </div>
            </div>
            <div className="p-6 space-y-3">
              {formData.plantedParishRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={row.parish}
                    onChange={(e) => { const next = [...formData.plantedParishRows]; next[idx].parish = e.target.value; setFormData({ ...formData, plantedParishRows: next }); }}
                    className="px-3 py-2 border rounded md:col-span-2"
                  >
                    <option value="">Select Parish</option>
                    {parishesLoading && (
                      <option value="" disabled>Loading…</option>
                    )}
                    {!parishesLoading && parishes.length === 0 && (
                      <option value="" disabled>No parishes found</option>
                    )}
                    {!parishesLoading && parishes.map(p => (
                      <option key={p.id} value={p.id}>{p.name || (`Parish #${p.id}`)}</option>
                    ))}
                  </select>
                  <input type="date" placeholder="Planted Date" value={row.planted_date} onChange={(e) => { const next = [...formData.plantedParishRows]; next[idx].planted_date = e.target.value; setFormData({ ...formData, plantedParishRows: next }); }} className="px-3 py-2 border rounded md:col-span-2" />
                </div>
              ))}
              <div className="flex gap-2">
                <button type="button" className="px-3 py-2 border rounded" onClick={() => setFormData({ ...formData, plantedParishRows: [...formData.plantedParishRows, { parish: '', planted_date: '' }] })}>Add Planted</button>
                {formData.plantedParishRows.length > 1 && (
                  <button type="button" className="px-3 py-2 border rounded" onClick={() => setFormData({ ...formData, plantedParishRows: formData.plantedParishRows.slice(0, -1) })}>Remove</button>
                )}
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
            </div>
            <div className="p-6 space-y-3">
              {formData.appointmentsRows.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-8 gap-3">
                  <input type="text" placeholder="Title" value={row.title} onChange={(e) => { const next = [...formData.appointmentsRows]; next[idx].title = e.target.value; setFormData({ ...formData, appointmentsRows: next }); }} className="px-3 py-2 border rounded md:col-span-2" />
                  <input type="text" placeholder="Description" value={row.description} onChange={(e) => { const next = [...formData.appointmentsRows]; next[idx].description = e.target.value; setFormData({ ...formData, appointmentsRows: next }); }} className="px-3 py-2 border rounded md:col-span-2" />
                  <select
                    value={row.category}
                    onChange={(e) => {
                      const next = [...formData.appointmentsRows];
                      next[idx].category = allowedAppointmentCategories.includes(e.target.value) ? e.target.value : 'pastoral';
                      setFormData({ ...formData, appointmentsRows: next });
                    }}
                    className="px-3 py-2 border rounded"
                  >
                    <option value="pastoral">Pastoral</option>
                  </select>
                  <input type="date" placeholder="Start Date" value={row.start_date} onChange={(e) => { const next = [...formData.appointmentsRows]; next[idx].start_date = e.target.value; setFormData({ ...formData, appointmentsRows: next }); }} className="px-3 py-2 border rounded" />
                  <input type="date" placeholder="End Date" value={row.end_date} onChange={(e) => { const next = [...formData.appointmentsRows]; next[idx].end_date = e.target.value; setFormData({ ...formData, appointmentsRows: next }); }} className="px-3 py-2 border rounded" />
                </div>
              ))}
              <div className="flex gap-2">
                <button type="button" className="px-3 py-2 border rounded" onClick={() => setFormData({ ...formData, appointmentsRows: [...formData.appointmentsRows, { title: '', description: '', category: 'pastoral', start_date: '', end_date: '' }] })}>Add Appointment</button>
                {formData.appointmentsRows.length > 1 && (
                  <button type="button" className="px-3 py-2 border rounded" onClick={() => setFormData({ ...formData, appointmentsRows: formData.appointmentsRows.slice(0, -1) })}>Remove</button>
                )}
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
