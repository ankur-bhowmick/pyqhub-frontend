import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-brand">
                    <span className="nav-icon">🎓</span>
                    <span className="nav-title">PYQHUB</span>
                </Link>

                <div className="nav-links">
                    <Link to="/universities" className="nav-link">Universities</Link>
                    <Link to="/ratings" className="nav-link">Ratings</Link>

                    {user ? (
                        <>
                            {user.role !== 'admin' && (
                                <Link to="/contact" className="nav-link">Contact</Link>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
                                    <Link to="/admin/universities" className="nav-link">Universities</Link>
                                    <Link to="/admin/papers" className="nav-link">Papers</Link>
                                </>
                            )}
                            <div className="nav-user">
                                <span className="nav-avatar">{user.name[0].toUpperCase()}</span>
                                <div>
                                    <span className="nav-username">{user.name}</span>
                                    <span className="nav-role">{user.role}</span>
                                </div>
                            </div>
                            <button onClick={handleLogout} className="btn btn-sm btn-outline">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-sm btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
