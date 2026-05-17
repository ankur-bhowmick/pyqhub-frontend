import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';

const UniversityPapers = () => {
    const { id } = useParams();
    const [university, setUniversity] = useState(null);
    const [papers, setPapers] = useState([]);
    const [years, setYears] = useState([]);
    const [semesters, setSemesters] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [loading, setLoading] = useState(true);
    const [viewingPdf, setViewingPdf] = useState(null);

    useEffect(() => {
        fetchData();
    }, [id, selectedYear, selectedSemester]);

    const fetchData = async () => {
        try {
            const params = new URLSearchParams();
            if (selectedYear) params.append('year', selectedYear);
            if (selectedSemester) params.append('semester', selectedSemester);
            const query = params.toString() ? `?${params.toString()}` : '';

            const [uniRes, papersRes] = await Promise.all([
                api.get(`/universities/${id}`),
                api.get(`/papers/university/${id}${query}`)
            ]);
            setUniversity(uniRes.data.university);
            setPapers(papersRes.data.papers);
            setYears(papersRes.data.years);
            setSemesters(papersRes.data.semesters || []);
        } catch (err) {
            console.error('Failed to fetch data');
        }
        setLoading(false);
    };

    const getPdfUrl = (filename) => `/uploads/${filename}`;

    const handleDownload = (paper) => {
        const link = document.createElement('a');
        link.href = getPdfUrl(paper.paperFile);
        link.download = paper.originalName || `${paper.subject}-${paper.year}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="loading">Loading papers...</div>;
    if (!university) return <div className="empty-state"><h3>University not found</h3></div>;

    return (
        <div className="container">
            <Link to="/" className="back-link">← Back to Universities</Link>

            <div className="page-header">
                <h1>🏛️ {university.name}</h1>
                <p>📍 {university.location}</p>
                {university.description && <p className="uni-about">{university.description}</p>}
            </div>

            <div className="filter-bar">
                <span className="filter-label">Filter by Year:</span>
                <button className={`filter-btn ${selectedYear === '' ? 'active' : ''}`} onClick={() => setSelectedYear('')}>All Years</button>
                {years.map(year => (
                    <button key={year} className={`filter-btn ${selectedYear === String(year) ? 'active' : ''}`} onClick={() => setSelectedYear(String(year))}>{year}</button>
                ))}
            </div>

            {semesters.length > 0 && (
                <div className="filter-bar" style={{ marginTop: '-12px' }}>
                    <span className="filter-label">Filter by Semester:</span>
                    <button className={`filter-btn ${selectedSemester === '' ? 'active' : ''}`} onClick={() => setSelectedSemester('')}>All Semesters</button>
                    {semesters.map(sem => (
                        <button key={sem} className={`filter-btn ${selectedSemester === sem ? 'active' : ''}`} onClick={() => setSelectedSemester(sem)}>{sem}</button>
                    ))}
                </div>
            )}

            {papers.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-icon">📄</span>
                    <h3>No papers found</h3>
                    <p>{selectedYear || selectedSemester ? `No papers found for the selected filters` : 'No papers uploaded yet for this university'}</p>
                </div>
            ) : (
                <div className="papers-grid">
                    {papers.map(paper => (
                        <div key={paper._id} className="paper-card">
                            <div className="paper-card-header">
                                <div>
                                    <h4>{paper.subject}</h4>
                                </div>
                                <div className="paper-card-icon">📝</div>
                            </div>
                            <div className="paper-card-meta">
                                <span className="tag">📅 {paper.year}</span>
                                {paper.semester && <span className="tag">📘 {paper.semester}</span>}
                                <span className="tag">📋 {paper.examType}</span>
                            </div>
                            <div className="paper-card-actions">
                                <button className="btn btn-sm btn-primary" onClick={() => setViewingPdf(paper)}>
                                    👁️ View PDF
                                </button>
                                <button className="btn btn-sm btn-outline" onClick={() => handleDownload(paper)}>
                                    ⬇️ Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="paper-stats">
                Showing {papers.length} paper{papers.length !== 1 ? 's' : ''}{selectedYear ? ` for ${selectedYear}` : ''}{selectedSemester ? ` · ${selectedSemester}` : ''}
            </div>

            {/* PDF Viewer Modal */}
            {viewingPdf && (
                <div className="pdf-modal-overlay" onClick={() => setViewingPdf(null)}>
                    <div className="pdf-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="pdf-modal-header">
                            <h3>📄 {viewingPdf.subject} — {viewingPdf.year} {viewingPdf.examType}</h3>
                            <div className="pdf-modal-header-actions">
                                <button className="btn btn-sm btn-outline" onClick={() => handleDownload(viewingPdf)}>
                                    ⬇️ Download
                                </button>
                                <button className="pdf-close-btn" onClick={() => setViewingPdf(null)}>✕</button>
                            </div>
                        </div>
                        <div className="pdf-modal-body">
                            <iframe
                                src={getPdfUrl(viewingPdf.paperFile)}
                                title={viewingPdf.subject}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UniversityPapers;
