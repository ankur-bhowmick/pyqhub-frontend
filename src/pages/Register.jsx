import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate('/universities');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!/^[A-Za-z\s]+$/.test(name.trim())) {
            setError('Name can only contain letters and spaces.');
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            setLoading(false);
            return;
        }

        const result = await register(name, email, password, role);
        if (!result.success) setError(result.message);
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon">📝</span>
                    <h2>Create Account</h2>
                    <p>Register to browse question papers</p>
                </div>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value.replace(/[^A-Za-z\s]/g, ''))} placeholder="Enter your name (letters only)" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 6 characters" required />
                    </div>
                    <div className="form-group">
                        <label>I am a</label>
                        <div className="role-selector">
                            <button type="button" className={`role-btn ${role === 'student' ? 'active' : ''}`} onClick={() => setRole('student')}>🎓 Student</button>
                            <button type="button" className={`role-btn ${role === 'teacher' ? 'active' : ''}`} onClick={() => setRole('teacher')}>👩‍🏫 Teacher</button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>
                <p className="auth-footer">Already have an account? <Link to="/login">Login here</Link></p>
            </div>
        </div>
    );
};

export default Register;
