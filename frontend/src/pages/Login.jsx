import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="col-md-6 mx-auto">
          <div className="card p-4 shadow">
            <h3 className="text-center mb-3">Login</h3>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <input 
                id="loginEmail" 
                className="form-control mb-3" 
                name="email" 
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input 
                id="loginPassword" 
                type="password" 
                className="form-control mb-3" 
                name="password" 
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button type="submit" className="btn btn-success w-100">Login</button>
            </form>

            <p className="text-center mt-3">
              Don't have an account? 
              <Link to="/register"> Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
