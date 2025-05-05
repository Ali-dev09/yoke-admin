
import { useState ,useEffect} from 'react';
import '../styles/Auth.css';
import axios from 'axios';
import { backendUrl } from '../constants.js';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
    username: '',
    password: '',
    secret: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/admin/login`, formData);
      if(response.data.token) {
        localStorage.setItem('token', response.data.token);
        setLoading(false)
        navigate('/home');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Authentication failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Admin Login</h2>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Secret:</label>
          <input
            type="password"
            name="secret"
            value={formData.secret}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className='login-button'>{loading ?   'loading...':'log in'}</button>
      </form>
    </div>
  );
}
