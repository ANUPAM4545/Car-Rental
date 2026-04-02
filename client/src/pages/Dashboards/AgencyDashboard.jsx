import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, Car, Inbox, Check, X, Edit3, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgencyDashboard = () => {
  const [cars, setCars] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ model: '', number: '', seats: '', rent: '' });

  const fetchData = async () => {
    try {
      const [carsRes, requestsRes] = await Promise.all([
        axios.get('/cars'),
        axios.get('/agency-requests')
      ]);
      setCars(carsRes.data);
      setRequests(requestsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/add-car', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      setFormData({ model: '', number: '', seats: '', rent: '' });
      fetchData();
    } catch (err) {
      alert("Error adding car");
    }
  };

  const handleAction = async (booking_id, action) => {
    try {
      await axios.post('/agency-requests/action', { booking_id, action }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      fetchData();
    } catch (err) {
      alert("Error taking action");
    }
  };

  if (loading) return <div>Loading Dashboard...</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', alignSelf: 'start' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <PlusCircle className="text-primary" />
           List a New Car
        </h2>
        <form onSubmit={handleAddCar}>
          <input 
            placeholder="Model (e.g. BMW M4)" 
            required 
            value={formData.model}
            onChange={e => setFormData({...formData, model: e.target.value})}
          />
          <input 
            placeholder="Plate Number" 
            required 
            value={formData.number}
            onChange={e => setFormData({...formData, number: e.target.value})}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <input 
               type="number" 
               placeholder="Seats" 
               required 
               value={formData.seats}
               onChange={e => setFormData({...formData, seats: e.target.value})}
            />
            <input 
               type="number" 
               placeholder="Rent Per Day ($)" 
               required 
               value={formData.rent}
               onChange={e => setFormData({...formData, rent: e.target.value})}
            />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Add to Fleet
          </button>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Inbox className="text-accent" />
            Booking Requests
          </h2>
          {requests.length === 0 ? (
             <p style={{ color: 'var(--text-muted)' }}>No pending requests.</p>
          ) : (
             requests.map(req => (
               <div key={req.id} style={{ borderBottom: '1px solid var(--border)', padding: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{req.customer_name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Wants {req.model} for {req.days} days
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleAction(req.id, 'confirmed')} style={{ background: '#059669', color: 'white', padding: '0.5rem', borderRadius: '0.4rem' }}>
                      <Check size={18} />
                    </button>
                    <button onClick={() => handleAction(req.id, 'rejected')} style={{ background: '#dc2626', color: 'white', padding: '0.5rem', borderRadius: '0.4rem' }}>
                      <X size={18} />
                    </button>
                  </div>
               </div>
             ))
          )}
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield className="text-primary" />
            Your Active Fleet
          </h2>
          <div className="car-grid" style={{ gridTemplateColumns: '1fr' }}>
            {cars.map(car => (
              <div key={car.id} style={{ padding: '1rem', background: 'var(--surface)', borderRadius: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{car.model}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{car.number} • ${car.rent}/day</div>
                </div>
                <Link to={`/edit-car/${car.id}`} style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>
                   <Edit3 size={18} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;
