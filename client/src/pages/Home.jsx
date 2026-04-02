import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Info, Calendar } from 'lucide-react';

const Home = () => {
  const [cars, setCars] = useState([]);
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  const fetchCars = async () => {
    try {
      const res = await axios.get('/cars');
      setCars(res.data);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleRent = async (e, carId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rentData = {
      car_id: carId,
      days: formData.get('days'),
      start_date: formData.get('start_date')
    };

    try {
      const res = await axios.post('/rent', rentData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      if (res.data.success) {
        alert("Rental request submitted successfully!");
        window.location.href = '/dashboard';
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error booking car");
    }
  };

  if (loading || authLoading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Fleet...</div>;

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Premium Car Rental</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Experience the road like never before. Choose from our curated fleet of high-performance vehicles.
        </p>
      </header>

      <div className="car-grid">
        {cars.map(car => (
          <div key={car.id} className="car-card glass">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{car.model}</h3>
              <div style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '1.25rem' }}>
                ${car.rent}<span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>/day</span>
              </div>
            </div>
            
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
               <Info size={14} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
               Plate: {car.number} | {car.seats} Seats
            </p>

            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              {user && user.role === 'agency' ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                  Logged in as Agency. View fleet management to edit.
                </p>
              ) : (
                <form onSubmit={(e) => handleRent(e, car.id)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {user && user.role === 'customer' && (
                    <div style={{ position: 'relative' }}>
                      <Calendar size={18} style={{ position: 'absolute', left: '0.75rem', top: '0.75rem', color: 'var(--primary)' }} />
                      <input 
                        type="date" 
                        name="start_date" 
                        required 
                        style={{ paddingLeft: '2.5rem' }} 
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  )}
                  
                  <select name="days" required>
                    <option value="">Duration...</option>
                    <option value="1">1 Day</option>
                    <option value="2">2 Days</option>
                    <option value="3">3 Days</option>
                    <option value="7">1 Week</option>
                    <option value="14">2 Weeks</option>
                  </select>
                  
                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    {user ? 'Rent Now' : 'Login to Rent'}
                  </button>
                  
                  {!user && (
                     <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                       Login required to book a car.
                     </p>
                  )}
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
