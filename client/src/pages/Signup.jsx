import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, Briefcase } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post('/register', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      if (res.data.success) {
        alert("Registration successful! Please login.");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '4rem auto', textAlign: 'center' }}>
      <div className="glass" style={{ padding: '2.5rem', borderRadius: '1.5rem' }}>
        <UserPlus size={48} className="text-primary" style={{ marginBottom: '1rem' }} />
        <h2 className="title-gradient" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Create Account</h2>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button 
            onClick={() => setFormData({...formData, role: 'customer'})}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              borderRadius: '0.75rem', 
              background: formData.role === 'customer' ? 'var(--primary)' : 'var(--surface)',
              color: formData.role === 'customer' ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <User size={18} />
            Customer
          </button>
          <button 
            onClick={() => setFormData({...formData, role: 'agency'})}
            style={{ 
              flex: 1, 
              padding: '1rem', 
              borderRadius: '0.75rem', 
              background: formData.role === 'agency' ? 'var(--accent)' : 'var(--surface)',
              color: formData.role === 'agency' ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <Briefcase size={18} />
            Agency
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
             <User size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-muted)' }} />
             <input 
               type="text" 
               placeholder="Full Name" 
               required
               style={{ paddingLeft: '3rem' }}
               value={formData.name}
               onChange={(e) => setFormData({...formData, name: e.target.value})}
             />
          </div>

          <div style={{ position: 'relative' }}>
             <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-muted)' }} />
             <input 
               type="email" 
               placeholder="Email Address" 
               required
               style={{ paddingLeft: '3rem' }}
               value={formData.email}
               onChange={(e) => setFormData({...formData, email: e.target.value})}
             />
          </div>
          
          <div style={{ position: 'relative' }}>
             <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '0.85rem', color: 'var(--text-muted)' }} />
             <input 
               type="password" 
               placeholder="Password" 
               required
               style={{ paddingLeft: '3rem' }}
               value={formData.password}
               onChange={(e) => setFormData({...formData, password: e.target.value})}
             />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
