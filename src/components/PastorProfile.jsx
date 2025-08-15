import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Award, Heart, BookOpen, Church, Edit, ChevronRight, ImageOff } from 'lucide-react';
import { getPastor } from '../api/pastors';

/**
 * PastorProfile - fetches and displays a pastor by id with a rich layout
 * Props:
 * - onBack: () => void
 */
const PastorProfile = ({ onBack }) => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    const run = async () => {
      setLoading(true);
      setError('');
      try {
        const resp = await getPastor(id, token);
        if (mounted) setData(resp?.data || null);
      } catch (e) {
        if (mounted) setError(e?.response?.status ? `Failed to load (${e.response.status})` : (e?.message || 'Failed to load'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [id]);

  const pastor = useMemo(() => {
    if (!data) return null;
    const fullName = data.full_name || data.fullName || '';
    const title = data?.professional_info?.title || data.title || '';
    const birthdate = data.birthdate || '';
    const phone = data.phone || '';
    const email = data.email || '';
    const address = data.residential_address || data.address || '';
    const ordinationDate = data?.professional_info?.ordination_date || '';
    const employmentStatus = data?.professional_info?.employment_status || '';
    const spouse = data?.family_info?.spouse_name || '';
    const children = Array.isArray(data?.children) ? data.children.map(c => c?.name || '').filter(Boolean) : [];
    const anniversary = data?.family_info?.wedding_anniversary || '';
    const spiritualGifts = (() => {
      const sg = data?.skills_gifts?.spiritual_gifts;
      if (!sg) return [];
      return Array.isArray(sg) ? sg : String(sg).split(',').map(s => s.trim()).filter(Boolean);
    })();
    const education = (() => {
      const deg = data?.education_training?.degrees;
      if (!deg) return [];
      return Array.isArray(deg) ? deg : String(deg).split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    })();
    const photo = data.photograph_url || data.photo || '';
    const appointments = Array.isArray(data?.appointments) ? data.appointments.map(a => ({
      church: a?.title || 'Appointment',
      role: a?.description || a?.category || '',
      date: a?.start_date || '',
    })) : [];
    const pastPostings = Array.isArray(data?.past_postings) ? data.past_postings.map(p => ({
      parishName: p?.parish_name || p?.parish?.name || `Parish #${p?.parish ?? ''}`,
      start: p?.start_date,
      end: p?.transferred_date,
    })) : [];
    const plantedParishes = Array.isArray(data?.planted_parish_links) ? data.planted_parish_links.map(pl => ({
      parishName: pl?.parish_name || pl?.parish?.name || `Parish #${pl?.parish ?? ''}`,
      date: pl?.planted_date,
    })) : [];
    return { id: data.id, fullName, title, birthdate, phone, email, address, ordinationDate, employmentStatus, spouse, children, anniversary, spiritualGifts, education, photo, appointments, pastPostings, plantedParishes };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading profile…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }
  if (!pastor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Pastor Profile</h1>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {pastor.photo ? (
                <img
                  src={pastor.photo}
                  alt={pastor.fullName}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  <ImageOff className="w-8 h-8" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{pastor.fullName}</h1>
                <p className="text-xl text-blue-600 font-semibold mb-4">{pastor.title}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{pastor.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{pastor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{pastor.address}</span>
                  </div>
                  {pastor.birthdate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Born: {new Date(pastor.birthdate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Professional Information */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                Professional Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {pastor.ordinationDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Ordination Date</label>
                  <p className="text-gray-900">{new Date(pastor.ordinationDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Employment Status</label>
                <p className="text-gray-900">{pastor.employmentStatus}</p>
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
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Spouse</label>
                <p className="text-gray-900">{pastor.spouse}</p>
              </div>
              {pastor.children?.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Children</label>
                  <div className="text-gray-900">
                    {pastor.children.map((child, index) => (
                      <p key={index}>{child}</p>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Anniversary</label>
                <p className="text-gray-900">{pastor.anniversary ? new Date(pastor.anniversary).toLocaleDateString() : '—'}</p>
              </div>
            </div>
          </div>

          {/* Spiritual Gifts */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-blue-600" />
                Spiritual Gifts & Skills
              </h2>
            </div>
            <div className="p-6">
              {pastor.spiritualGifts?.length ? (
                <div className="flex flex-wrap gap-2">
                  {pastor.spiritualGifts.map((gift, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {gift}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No spiritual gifts listed.</p>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Education & Training
              </h2>
            </div>
            <div className="p-6 space-y-3">
              {pastor.education?.length ? (
                pastor.education.map((edu, index) => (
                  <div key={index} className="text-gray-900">
                    {edu}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No education details.</p>
              )}
            </div>
          </div>
        </div>

        {/* Appointments History */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Church className="w-5 h-5 text-blue-600" />
              Pastoral Appointments & Transfers
            </h2>
          </div>
          <div className="p-6">
            {pastor.appointments?.length ? (
              <div className="space-y-4">
                {pastor.appointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{appointment.church}</h3>
                      <p className="text-sm text-gray-600">{appointment.role}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.date ? new Date(appointment.date).toLocaleDateString() : '—'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No appointments yet.</p>
            )}
          </div>
        </div>

        {/* History Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b"><h3 className="font-semibold text-gray-900">Past Postings</h3></div>
            <div className="p-6 space-y-3">
              {pastor.pastPostings?.length ? pastor.pastPostings.map((pp, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="text-gray-900">{pp.parishName}</div>
                  <div className="text-sm text-gray-500">{pp.start} → {pp.end || 'Present'}</div>
                </div>
              )) : <p className="text-gray-500 text-sm">No past postings.</p>}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b"><h3 className="font-semibold text-gray-900">Planted Parishes</h3></div>
            <div className="p-6 space-y-3">
              {pastor.plantedParishes?.length ? pastor.plantedParishes.map((pl, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="text-gray-900">{pl.parishName}</div>
                  <div className="text-sm text-gray-500">{pl.date}</div>
                </div>
              )) : <p className="text-gray-500 text-sm">No planted parishes.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastorProfile;
