import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">ResumeAI</Link>

        <div>
          <Link to="/" className="btn btn-outline-light me-2">Home</Link>
          <Link to="/results" className="btn btn-outline-light me-2">Results</Link>

          {isAuthenticated ? (
            <button onClick={logout} className="btn btn-danger">Logout</button>
          ) : (
            <Link to="/login" className="btn btn-success">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
