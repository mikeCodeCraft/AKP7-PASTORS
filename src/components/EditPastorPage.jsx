import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AddPastorForm from './AddPastorForm';
import { getPastor } from '../api/pastors';

const EditPastorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getPastor(id, token);
        if (!cancelled) setData(res?.data || null);
      } catch (e) {
        if (!cancelled) setError(e?.response?.status ? `Failed to load (${e.response.status})` : (e?.message || 'Failed to load'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading…</div>;
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 border rounded bg-red-50 text-red-700">{error}</div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-4 border rounded bg-yellow-50 text-yellow-800">Pastor not found</div>
      </div>
    );
  }

  return (
    <AddPastorForm
      pastorId={id}
      initialData={data}
      onCancel={() => navigate('/dashboard')}
      onSubmit={() => navigate('/dashboard')}
    />
  );
};

export default EditPastorPage;
