import React, { useState, useEffect } from 'react';
import { getZones, createZone, updateZone, deleteZone } from '../api/zones';
import { getAreas, createArea, updateArea, deleteArea } from '../api/areas';
import { getParishes, createParish, updateParish, deleteParish } from '../api/parishes';

const TABS = ['Zones', 'Areas', 'Parishes'];

const ZoneAreaParish = () => {
  const [activeTab, setActiveTab] = useState('Zones');
  const [zones, setZones] = useState([]);
  const [areas, setAreas] = useState([]);
  const [parishes, setParishes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Fetch all data on mount
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const toArray = (payload) => {
      if (!payload) return [];
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.results)) return payload.results;
      // Some DRF list endpoints might return {data: [...]} already unwrapped but we got an object => try values filter
      if (payload.data && Array.isArray(payload.data)) return payload.data;
      return [];
    };
    Promise.all([
      getZones(token),
      getAreas(token),
      getParishes(token)
    ]).then(([zonesRes, areasRes, parishesRes]) => {
      setZones(toArray(zonesRes.data));
      setAreas(toArray(areasRes.data));
      setParishes(toArray(parishesRes.data));
    }).catch(e => setError('Failed to fetch data')).finally(() => setLoading(false));
  }, [token]);

  // Render tab content
  const renderTab = () => {
    switch (activeTab) {
      case 'Zones':
        return <ZoneTab zones={zones} token={token} setZones={setZones} />;
      case 'Areas':
        return <AreaTab areas={areas} zones={zones} token={token} setAreas={setAreas} />;
      case 'Parishes':
        return <ParishTab parishes={parishes} areas={areas} token={token} setParishes={setParishes} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10">
      <div className="flex justify-center gap-4 mb-8">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${activeTab === tab ? 'bg-[#281572] text-white' : 'bg-gray-100 text-[#281572] hover:bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      {loading ? <div className="text-center py-10">Loading...</div> : renderTab()}
      {error && <div className="text-red-600 text-center mt-4">{error}</div>}
    </div>
  );
};

// Zone CRUD Tab
const ZoneTab = ({ zones, token, setZones }) => {
  const [showModal, setShowModal] = useState(false);
  const [editZone, setEditZone] = useState(null);
  const [form, setForm] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Defensive: ensure zones is always an array
  const safeZones = Array.isArray(zones) ? zones : [];

  const handleOpen = (zone = null) => {
    setEditZone(zone);
    setForm(zone ? { name: zone.name, address: zone.address || '' } : { name: '', address: '' });
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setEditZone(null);
    setForm({ name: '', address: '' });
    setError('');
  };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editZone) {
        const res = await updateZone(editZone.id, form, token);
  setZones(safeZones.map(z => z.id === editZone.id ? res.data : z));
      } else {
        const res = await createZone(form, token);
  setZones([res.data, ...safeZones]);
      }
      handleClose();
    } catch (err) {
      setError('Failed to save zone');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this zone?')) return;
    setLoading(true);
    try {
      await deleteZone(id, token);
      setZones(zones.filter(z => z.id !== id));
    } catch {
      setError('Failed to delete zone');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#281572]">Zones</h2>
        <button
          onClick={() => handleOpen()}
          className="bg-[#281572] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1e1047] transition-colors"
        >
          Add Zone
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left w-12">No.</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeZones.length === 0 ? (
              <tr><td colSpan={4} className="py-6 text-center text-gray-400">No zones found.</td></tr>
            ) : safeZones.map((zone, idx) => (
              <tr key={zone.id} className="border-b">
                <td className="py-2 px-4">{idx + 1}</td>
                <td className="py-2 px-4">{zone.name}</td>
                <td className="py-2 px-4">{zone.address || '-'}</td>
                <td className="py-2 px-4 text-right">
                  <button
                    onClick={() => handleOpen(zone)}
                    className="text-[#281572] font-semibold px-3 py-1 rounded hover:bg-gray-100 mr-2"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(zone.id)}
                    className="text-red-600 font-semibold px-3 py-1 rounded hover:bg-red-50"
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-4 text-[#281572]">{editZone ? 'Edit Zone' : 'Add Zone'}</h3>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold"
                disabled={loading}
              >Cancel</button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#281572] text-white font-semibold hover:bg-[#1e1047]"
                disabled={loading}
              >{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Area CRUD Tab
const AreaTab = ({ areas, zones, token, setAreas }) => {
  const [showModal, setShowModal] = useState(false);
  const [editArea, setEditArea] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', zone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const safeAreas = Array.isArray(areas) ? areas : [];
  const safeZones = Array.isArray(zones) ? zones : [];

  const handleOpen = (area = null) => {
    setEditArea(area);
  setForm(area ? { name: area.name, address: area.address || '', zone: area.zone } : { name: '', address: '', zone: safeZones[0]?.id || '' });
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setEditArea(null);
  setForm({ name: '', address: '', zone: safeZones[0]?.id || '' });
    setError('');
  };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editArea) {
        const res = await updateArea(editArea.id, form, token);
  setAreas(safeAreas.map(a => a.id === editArea.id ? res.data : a));
      } else {
        const res = await createArea(form, token);
  setAreas([res.data, ...safeAreas]);
      }
      handleClose();
    } catch (err) {
      setError('Failed to save area');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this area?')) return;
    setLoading(true);
    try {
      await deleteArea(id, token);
      setAreas(areas.filter(a => a.id !== id));
    } catch {
      setError('Failed to delete area');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#281572]">Areas</h2>
        <button
          onClick={() => handleOpen()}
          className="bg-[#281572] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1e1047] transition-colors"
        >
          Add Area
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left w-12">No.</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Zone</th>
              <th className="py-2 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeAreas.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-center text-gray-400">No areas found.</td></tr>
            ) : safeAreas.map((area, idx) => {
                let zoneName = area.zone_name;
                if (area.zone && typeof area.zone === 'object') {
                  zoneName = area.zone_name;
                } else if (area.zone) {
                  const zoneObj = safeZones.find(z => z.id === area.zone);
                  zoneName = zoneObj ? zoneObj.name : area.zone;
                }
                return (
                  <tr key={area.id} className="border-b">
                    <td className="py-2 px-4">{idx + 1}</td>
                    <td className="py-2 px-4">{area.name}</td>
                    <td className="py-2 px-4">{area.address || '-'}</td>
                    <td className="py-2 px-4">{zoneName || '-'}</td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => handleOpen(area)}
                        className="text-[#281572] font-semibold px-3 py-1 rounded hover:bg-gray-100 mr-2"
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(area.id)}
                        className="text-red-600 font-semibold px-3 py-1 rounded hover:bg-red-50"
                      >Delete</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-4 text-[#281572]">{editArea ? 'Edit Area' : 'Add Area'}</h3>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Zone</label>
              <select
                name="zone"
                value={form.zone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {safeZones.map(z => (
                  <option key={z.id} value={z.id}>{z.name}</option>
                ))}
              </select>
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold"
                disabled={loading}
              >Cancel</button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#281572] text-white font-semibold hover:bg-[#1e1047]"
                disabled={loading}
              >{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// Parish CRUD Tab
const ParishTab = ({ parishes, areas, token, setParishes }) => {
  const [showModal, setShowModal] = useState(false);
  const [editParish, setEditParish] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', area: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const safeParishes = Array.isArray(parishes) ? parishes : [];
  const safeAreas = Array.isArray(areas) ? areas : [];

  const handleOpen = (parish = null) => {
    setEditParish(parish);
  setForm(parish ? { name: parish.name, address: parish.address || '', area: parish.area } : { name: '', address: '', area: safeAreas[0]?.id || '' });
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setEditParish(null);
  setForm({ name: '', address: '', area: safeAreas[0]?.id || '' });
    setError('');
  };
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editParish) {
        const res = await updateParish(editParish.id, form, token);
  setParishes(safeParishes.map(p => p.id === editParish.id ? res.data : p));
      } else {
        const res = await createParish(form, token);
  setParishes([res.data, ...safeParishes]);
      }
      handleClose();
    } catch (err) {
      setError('Failed to save parish');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this parish?')) return;
    setLoading(true);
    try {
      await deleteParish(id, token);
      setParishes(parishes.filter(p => p.id !== id));
    } catch {
      setError('Failed to delete parish');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-[#281572]">Parishes</h2>
        <button
          onClick={() => handleOpen()}
          className="bg-[#281572] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1e1047] transition-colors"
        >
          Add Parish
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left w-12">No.</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-left">Address</th>
              <th className="py-2 px-4 text-left">Area</th>
              <th className="py-2 px-4 text-left">Zone</th>
              <th className="py-2 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
      {safeParishes.length === 0 ? (
              <tr><td colSpan={6} className="py-6 text-center text-gray-400">No parishes found.</td></tr>
      ) : safeParishes.map((parish, idx) => {
        const areaName = parish.area_name || (safeAreas.find(a => a.id === parish.area)?.name ?? '');
                const zoneName = parish.zone_name || '-';
                return (
                  <tr key={parish.id} className="border-b">
                    <td className="py-2 px-4">{idx + 1}</td>
                    <td className="py-2 px-4">{parish.name}</td>
                    <td className="py-2 px-4">{parish.address || '-'}</td>
                    <td className="py-2 px-4">{areaName?.name || parish.area_name}</td>
                    <td className="py-2 px-4">{zoneName}</td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => handleOpen(parish)}
                        className="text-[#281572] font-semibold px-3 py-1 rounded hover:bg-gray-100 mr-2"
                      >Edit</button>
                      <button
                        onClick={() => handleDelete(parish.id)}
                        className="text-red-600 font-semibold px-3 py-1 rounded hover:bg-red-50"
                      >Delete</button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-8 shadow-lg w-full max-w-md"
          >
            <h3 className="text-lg font-bold mb-4 text-[#281572]">{editParish ? 'Edit Parish' : 'Add Parish'}</h3>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Area</label>
              <select
                name="area"
                value={form.area}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {safeAreas.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold"
                disabled={loading}
              >Cancel</button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-[#281572] text-white font-semibold hover:bg-[#1e1047]"
                disabled={loading}
              >{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ZoneAreaParish;
