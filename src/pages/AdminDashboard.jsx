import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalUniversities: 0, totalPapers: 0, totalContacts: 0 });
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        try {
            const [usersRes, unisRes, papersRes, contactsRes] = await Promise.all([
                api.get('/auth/users'),
                api.get('/universities'),
                api.get('/papers/stats'),
                api.get('/contacts')
            ]);
            setStats({
                totalUsers: usersRes.data.users.length,
                totalUniversities: unisRes.data.universities.length,
                totalPapers: papersRes.data.stats.totalPapers,
                totalContacts: contactsRes.data.contacts.length
            });
            setContacts(contactsRes.data.contacts.slice(0, 5));
        } catch (err) {
            console.error('Failed to fetch stats');
        }
        setLoading(false);
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/contacts/${id}`, { status });
            fetchAll();
        } catch (err) { console.error('Failed'); }
    };

    const deleteContact = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await api.delete(`/contacts/${id}`);
            fetchAll();
        } catch (err) { console.error('Failed'); }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;

    return (
        <div className="container">
            <div className="page-header">
                <h1>🛠️ Admin Dashboard</h1>
                <p>Manage universities, papers, and user messages</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card"><span className="stat-icon">👥</span><h3>{stats.totalUsers}</h3><p>Total Users</p></div>
                <div className="stat-card"><span className="stat-icon">🏛️</span><h3>{stats.totalUniversities}</h3><p>Universities</p></div>
                <div className="stat-card"><span className="stat-icon">📄</span><h3>{stats.totalPapers}</h3><p>Papers</p></div>
                <div className="stat-card"><span className="stat-icon">📩</span><h3>{stats.totalContacts}</h3><p>Messages</p></div>
            </div>

            <div className="admin-actions">
                <Link to="/admin/universities" className="btn btn-primary">Manage Universities</Link>
                <Link to="/admin/papers" className="btn btn-primary">Manage Papers</Link>
            </div>

            <div className="section-card">
                <h3>📩 Recent Messages</h3>
                {contacts.length === 0 ? (
                    <p className="muted">No messages yet</p>
                ) : (
                    <table className="papers-table">
                        <thead>
                            <tr><th>From</th><th>Subject</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {contacts.map(c => (
                                <tr key={c._id}>
                                    <td><strong>{c.userId?.name}</strong><br /><small>{c.userId?.email}</small></td>
                                    <td>{c.subject}<br /><small className="muted">{c.message.substring(0, 60)}...</small></td>
                                    <td><span className={`badge ${c.status === 'resolved' ? 'badge-success' : 'badge-warning'}`}>{c.status}</span></td>
                                    <td className="action-btns">
                                        {c.status === 'pending' && <button onClick={() => updateStatus(c._id, 'resolved')} className="btn btn-sm btn-success">✓ Resolve</button>}
                                        <button onClick={() => deleteContact(c._id)} className="btn btn-sm btn-danger">Delete</button>
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

export default AdminDashboard;
