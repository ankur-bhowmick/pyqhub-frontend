import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const AdminPapers = () => {
    const [papers, setPapers] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState({ universityId: '', subject: '', year: '', semester: '', examType: 'End-Term' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    useEffect(() => { fetchAll(); }, []);

    const fetchAll = async () => {
        try {
            const [papersRes, unisRes] = await Promise.all([
                api.get('/papers/all'),
                api.get('/universities')
            ]);
            setPapers(papersRes.data.papers);
            setUniversities(unisRes.data.universities);
        } catch (err) { console.error('Failed'); }
        setLoading(false);
    };

    const resetForm = () => {
        setForm({ universityId: '', subject: '', year: '', semester: '', examType: 'End-Term' });
        setSelectedFile(null);
        setEditId(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!editId && !selectedFile) {
            setError('Please select a PDF file to upload');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('universityId', form.universityId);
            formData.append('subject', form.subject);
            formData.append('year', form.year);
            formData.append('semester', form.semester);
            formData.append('examType', form.examType);
            if (selectedFile) {
                formData.append('paperFile', selectedFile);
            }

            if (editId) {
                await api.put(`/papers/${editId}`, formData);
            } else {
                await api.post('/papers', formData);
            }
            resetForm();
            setShowForm(false);
            fetchAll();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed');
        }
    };

    const handleEdit = (paper) => {
        setForm({
            universityId: paper.universityId?._id || '',
            subject: paper.subject,
            year: String(paper.year),
            semester: paper.semester || '',
            examType: paper.examType
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setEditId(paper._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this paper? The PDF file will also be removed.')) return;
        try {
            await api.delete(`/papers/${id}`);
            fetchAll();
        } catch (err) { console.error('Failed'); }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError('Only PDF files are allowed');
                return;
            }
            if (file.size > 20 * 1024 * 1024) {
                setError('File size must be under 20MB');
                return;
            }
            setError('');
            setSelectedFile(file);
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="container">
            <div className="page-header-row">
                <div>
                    <h1>📄 Manage Papers</h1>
                    <p>Upload, edit, or remove question papers (PDF)</p>
                </div>
                <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); resetForm(); }}>
                    {showForm ? '✕ Cancel' : '+ Upload Paper'}
                </button>
            </div>

            {showForm && (
                <div className="section-card form-card">
                    <h3>{editId ? '✏️ Edit Paper' : '📤 Upload New Paper'}</h3>
                    {error && <div className="alert alert-error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>University</label>
                                <select value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })} required>
                                    <option value="">Select University</option>
                                    {universities.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Mathematics" required />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Year</label>
                                <input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} placeholder="e.g. 2024" required />
                            </div>
                            <div className="form-group">
                                <label>Semester</label>
                                <input type="text" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} placeholder="e.g. 1st Semester" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Exam Type</label>
                                <select value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value })}>
                                    <option value="End-Term">End-Term</option>
                                    <option value="Mid-Term">Mid-Term</option>
                                    <option value="Supplementary">Supplementary</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>PDF File {editId ? '(optional — upload to replace)' : ''}</label>
                                <div className="file-upload-area">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        ref={fileInputRef}
                                    />
                                    <div className="file-upload-icon">📁</div>
                                    <div className="file-upload-text">
                                        {selectedFile ? '' : 'Click or drag PDF here'}
                                    </div>
                                    <div className="file-upload-hint">PDF only, max 20MB</div>
                                </div>
                                {selectedFile && (
                                    <div className="file-selected">
                                        <span>✅ {selectedFile.name} ({formatFileSize(selectedFile.size)})</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">{editId ? '💾 Update' : '📤 Upload'} Paper</button>
                    </form>
                </div>
            )}

            {papers.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📄</span>
                    <h3>No papers uploaded yet</h3>
                    <p>Click "Upload Paper" to add your first question paper</p>
                </div>
            ) : (
                <div className="papers-table-wrap">
                    <table className="papers-table">
                        <thead>
                            <tr>
                                <th>University</th>
                                <th>Subject</th>
                                <th>Year</th>
                                <th>Sem</th>
                                <th>Type</th>
                                <th>File</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {papers.map(p => (
                                <tr key={p._id}>
                                    <td>{p.universityId?.name || '—'}</td>
                                    <td><strong style={{ color: 'var(--text-primary)' }}>{p.subject}</strong></td>
                                    <td>{p.year}</td>
                                    <td>{p.semester || '—'}</td>
                                    <td><span className="badge">{p.examType}</span></td>
                                    <td>
                                        {p.paperFile ? (
                                            <span className="badge badge-success" title={p.originalName || p.paperFile}>
                                                📎 {(p.originalName || p.paperFile).substring(0, 20)}{(p.originalName || p.paperFile).length > 20 ? '...' : ''}
                                            </span>
                                        ) : (
                                            <span className="badge badge-warning">⚠️ Legacy (URL)</span>
                                        )}
                                    </td>
                                    <td className="action-btns">
                                        {p.paperFile ? (
                                            <a href={`/uploads/${p.paperFile}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">👁️</a>
                                        ) : p.paperUrl ? (
                                            <a href={p.paperUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-ghost">🔗</a>
                                        ) : null}
                                        <button onClick={() => handleEdit(p)} className="btn btn-sm btn-outline">✏️</button>
                                        <button onClick={() => handleDelete(p._id)} className="btn btn-sm btn-danger">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPapers;
