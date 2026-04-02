import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit2, ShieldAlert, ArrowLeft } from 'lucide-react';

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ model: '', number: '', seats: '', rent: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await axios.get('/api/car/' + id);
        setFormData(res.data);
      } catch (err) {
        alert("Car not found");
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/edit-car/' + id, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      alert("Car updated successfully!");
      navigate('/dashboard');
    } catch (err) {
      alert("Error updating car");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <button onClick={() => navigate('/dashboard')} className="nav-link" style={{ background: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="glass" style={{ padding: '2.5rem', borderRadius: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
           <Edit2 size={32} className="text-primary" />
           <h2 className="title-gradient" style={{ fontSize: '2rem' }}>Edit Vehicle</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Model Name</label>
          <input 
             value={formData.model} 
             onChange={e => setFormData({...formData, model: e.target.value})} 
             required 
          />

          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>License Plate</label>
          <input 
             value={formData.number} 
             onChange={e => setFormData({...formData, number: e.target.value})} 
             required 
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
               <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Seats</label>
               <input 
                  type="number"
                  value={formData.seats} 
                  onChange={e => setFormData({...formData, seats: e.target.value})} 
                  required 
               />
            </div>
            <div>
               <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rent/Day ($)</label>
               <input 
                  type="number"
                  value={formData.rent} 
                  onChange={e => setFormData({...formData, rent: e.target.value})} 
                  required 
               />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={saving}>
             {saving ? 'Saving...' : 'Update Details'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
           <ShieldAlert size={16} />
           <span>Only the fleet owner can modify these details.</span>
        </div>
      </div>
    </div>
  );
};

export default EditCar;
