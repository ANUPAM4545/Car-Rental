import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { History, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('/my-bookings');
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={18} className="text-accent" />;
      case 'pending': return <Clock size={18} style={{ color: '#fbbf24' }} />;
      default: return <XCircle size={18} className="text-error" />;
    }
  };

  if (loading) return <div>Loading Bookings...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h2 className="title-gradient" style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <History size={32} />
           My Rentals
        </h2>
        <p style={{ color: 'var(--text-muted)' }}>Track the status of your car rental requests.</p>
      </header>

      <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
             <Calendar size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem', opacity: 0.3 }} />
             <p style={{ color: 'var(--text-muted)' }}>No bookings found. Time to hit the road!</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <th style={{ textAlign: 'left', padding: '1rem' }}>Vehicle</th>
                <th style={{ textAlign: 'center', padding: '1rem' }}>Duration</th>
                <th style={{ textAlign: 'right', padding: '1rem' }}>Total Cost</th>
                <th style={{ textAlign: 'right', padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>{booking.model}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>License: {booking.number}</div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>{booking.days} Days</td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <span style={{ fontWeight: 700 }}>${booking.rent * booking.days}</span>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                      {getStatusIcon(booking.status)}
                      <span style={{ textTransform: 'capitalize' }}>{booking.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
