import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const Home = () => {
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUniversities();
    }, []);

    const fetchUniversities = async () => {
        try {
            const res = await api.get('/universities');
            setUniversities(res.data.universities);
        } catch (err) {
            console.error('Failed to fetch universities');
        }
        setLoading(false);
    };

    const filtered = universities.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.location.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading">Loading universities...</div>;

    return (
        <div className="container">
            <div className="hero">
                <h1>
                    Find Your <span className="gradient-text">Question Papers</span>
                </h1>
                <p>Browse previous year question papers from top universities — organized, searchable, and ready to view.</p>
            </div>

            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by university name or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">🏫</span>
                    <h3>No universities found</h3>
                    <p>{search ? 'Try a different search term' : 'Universities will appear here once added by admin'}</p>
                </div>
            ) : (
                <div className="uni-grid">
                    {filtered.map(uni => (
                        <Link to={`/university/${uni._id}`} key={uni._id} className="uni-card">
                            <div className="uni-icon">🏛️</div>
                            <h3>{uni.name}</h3>
                            <p className="uni-location">📍 {uni.location}</p>
                            {uni.description && <p className="uni-desc">{uni.description}</p>}
                            <div className="uni-meta">
                                <span className="paper-count">📄 {uni.paperCount || 0} Papers</span>
                                <span className="view-link">View Papers →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
