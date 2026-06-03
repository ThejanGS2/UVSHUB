import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './StudentAuth.css';

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    whatsappNumber: '',
    nic: '',
    guardianName: '',
    guardianNumber: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/student/home');
      } else {
        alert('Registration successful! Please check your email if verification is required.');
        navigate('/student/login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '700px' }}>
        <h2 className="auth-title">Join the Hub</h2>
        {error && <div className="error-message">{error}</div>}
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Secure password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="whatsappNumber">WhatsApp Number</label>
              <input
                type="text"
                id="whatsappNumber"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                placeholder="+94 77..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="nic">NIC (Optional)</label>
              <input
                type="text"
                id="nic"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                placeholder="199912345678"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Home Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="123 Main St"
              />
            </div>
            <div className="form-group">
              <label htmlFor="guardianName">Guardian's Name</label>
              <input
                type="text"
                id="guardianName"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="guardianNumber">Guardian's Number</label>
              <input
                type="text"
                id="guardianNumber"
                name="guardianNumber"
                value={formData.guardianNumber}
                onChange={handleChange}
                required
                placeholder="+94 77..."
              />
            </div>
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>
        <div className="auth-link">
          Already have an account? <Link to="/student/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;
