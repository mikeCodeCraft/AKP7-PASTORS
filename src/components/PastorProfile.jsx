import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Award, Heart, BookOpen, Church, Edit, ChevronRight, ImageOff } from 'lucide-react';
import { getPastor } from '../api/pastors';
import { deletePastor as apiDeletePastor } from '../api/pastors';

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
    const parseCommaList = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean);
      return String(val).split(/[,\n]/).map(s => s.trim()).filter(Boolean);
    };
    const spiritualGifts = parseCommaList(data?.skills_gifts?.spiritual_gifts);
    const talents = parseCommaList(data?.skills_gifts?.talents);
    const areasOfExpertise = parseCommaList(data?.skills_gifts?.areas_of_expertise);
  const et = data?.education_training || {};
  const educationalBackgroundList = parseCommaList(et.educational_background);
  const degreesList = parseCommaList(et.degrees);
  const theologicalTrainingList = parseCommaList(et.theological_training);
  const ministryTrainingList = parseCommaList(et.ministry_training);
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
    const milestonesRaw = data?.milestones || {};
    const milestones = {
      year_joined_rccg: milestonesRaw.year_joined_rccg,
      year_saved: milestonesRaw.year_saved,
      year_baptized: milestonesRaw.year_baptized,
      year_workers_training_completed: milestonesRaw.year_workers_training_completed,
      year_school_of_disciple_completed: milestonesRaw.year_school_of_disciple_completed,
      year_bible_college_completed: milestonesRaw.year_bible_college_completed,
      year_house_fellowship_leadership_training_completed: milestonesRaw.year_house_fellowship_leadership_training_completed,
      Year_of_last_ordination: milestonesRaw.Year_of_last_ordination,
    };
  return { id: data.id, fullName, title, birthdate, phone, email, address, ordinationDate, employmentStatus, spouse, children, anniversary, spiritualGifts, talents, areasOfExpertise, educationalBackgroundList, degreesList, theologicalTrainingList, ministryTrainingList, photo, appointments, pastPostings, plantedParishes, milestones };
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
            <div className="flex items-center gap-2">
              <button onClick={() => window.location.assign(`/pastors/${pastor?.id || id}/edit`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
              <Edit className="w-4 h-4" />
              Edit Profile
              </button>
              <button
                onClick={async () => {
                  if (!window.confirm('Are you sure, you want to delete this pastor? This cannot be undone.')) return;
                  try {
                    const token = localStorage.getItem('token');
                    if (!token) throw new Error('Not authenticated');
                    await apiDeletePastor(pastor?.id || id, token);
                    window.location.assign('/dashboard');
                  } catch (err) {
                    const msg = err?.response?.data ? JSON.stringify(err.response.data) : (err?.message || 'Delete failed');
                    alert(msg);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
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

          {/* Education & Training (Combined Skills + Education) */}
          <div className="bg-white rounded-lg shadow lg:col-span-2">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Education & Training
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              {(() => {
                const section = (label, items, type='chips') => {
                  if (!items || !items.length) return null;
                  if (type === 'chips') {
                    return (
                      <div key={label} className="space-y-2">
                        <h3 className="text-gray-700 font-semibold">{label}</h3>
                        <div className="flex flex-wrap gap-2">
                          {items.map((it, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">{it}</span>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div key={label} className="space-y-2 col-span-1 md:col-span-2">
                      <h3 className="text-gray-700 font-semibold">{label}</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-900">
                        {items.map((it, i) => <li key={i}>{it}</li>)}
                      </ul>
                    </div>
                  );
                };
                const blocks = [];
                blocks.push(section('Spiritual Gifts', pastor.spiritualGifts));
                blocks.push(section('Talents', pastor.talents));
                blocks.push(section('Areas of Expertise', pastor.areasOfExpertise));
                blocks.push(section('Educational Background', pastor.educationalBackgroundList, 'list'));
                blocks.push(section('Degrees', pastor.degreesList, 'list'));
                blocks.push(section('Theological Training', pastor.theologicalTrainingList, 'list'));
                blocks.push(section('Ministry Training', pastor.ministryTrainingList, 'list'));
                const rendered = blocks.filter(Boolean);
                return rendered.length ? rendered : <p className="text-gray-500 text-sm">No education or training details.</p>;
              })()}
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-lg shadow lg:col-span-2">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Milestones
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              {(() => {
                const labels = {
                  year_joined_rccg: 'Year Joined RCCG',
                  year_saved: 'Year Saved',
                  year_baptized: 'Year Baptized',
                  year_workers_training_completed: 'Workers Training Completed',
                  year_school_of_disciple_completed: 'School of Disciples Completed',
                  year_bible_college_completed: 'Bible College Completed',
                  year_house_fellowship_leadership_training_completed: 'House Fellowship Leadership Training Completed',
                  Year_of_last_ordination: 'Year of Last Ordination'
                };
                const entries = Object.entries(pastor.milestones || {})
                  .filter(([, v]) => v !== null && v !== undefined && v !== '');
                if (!entries.length) {
                  return <p className="text-gray-500 text-sm col-span-full">No milestones recorded.</p>;
                }
                return entries.map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="text-gray-500 font-medium">{labels[key] || key}</div>
                    <div className="text-gray-900">{value}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>

        {/* Appointments History */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Church className="w-5 h-5 text-blue-600" />
              Pastoral Appointments
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
