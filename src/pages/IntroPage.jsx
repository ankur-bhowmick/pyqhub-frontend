import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IntroPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // If already logged in, skip intro
        if (user) {
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/universities');
            return;
        }
        // Trigger entrance animations
        setTimeout(() => setVisible(true), 100);
    }, [user]);

    return (
        <div className="intro-page">
            {/* Animated background elements */}
            <div className="intro-bg">
                <div className="intro-orb intro-orb-1"></div>
                <div className="intro-orb intro-orb-2"></div>
                <div className="intro-orb intro-orb-3"></div>
                <div className="intro-grid"></div>
            </div>

            <div className={`intro-content ${visible ? 'intro-visible' : ''}`}>
                {/* Floating badge */}
                <div className="intro-badge">
                    <span className="intro-badge-dot"></span>
                    Your Exam Prep Hub
                </div>

                {/* Main heading */}
                <h1 className="intro-title">
                    <span className="intro-title-line">Welcome to</span>
                    <span className="intro-title-brand">
                        <span className="intro-title-pyq">PYQ</span>
                        <span className="intro-title-hub">HUB</span>
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="intro-subtitle">
                    Your one-stop destination for university previous year question papers.
                    <br />
                    Browse, download, and ace your exams — all in one place.
                </p>

                {/* Feature pills */}
                <div className="intro-features">
                    <div className="intro-feature">
                        <span>📄</span> 1000+ Papers
                    </div>
                    <div className="intro-feature">
                        <span>🏛️</span> Top Universities
                    </div>
                    <div className="intro-feature">
                        <span>⚡</span> Instant Access
                    </div>
                    <div className="intro-feature">
                        <span>📱</span> Mobile Friendly
                    </div>
                </div>

                {/* CTA buttons */}
                <div className="intro-actions">
                    <button className="btn intro-btn-primary" onClick={() => navigate('/login')}>
                        Get Started →
                    </button>
                    <button className="btn intro-btn-ghost" onClick={() => navigate('/register')}>
                        Create Account
                    </button>
                </div>

                {/* Trust bar */}
                <div className="intro-trust">
                    <span>Trusted by students & teachers across India</span>
                </div>
            </div>

            {/* Decorative floating cards */}
            <div className={`intro-floating ${visible ? 'intro-visible' : ''}`}>
                <div className="intro-float-card intro-float-1">
                    <span>📝</span>
                    <div>
                        <strong>Mathematics</strong>
                        <small>End-Term · 2025</small>
                    </div>
                </div>
                <div className="intro-float-card intro-float-2">
                    <span>📘</span>
                    <div>
                        <strong>Computer Science</strong>
                        <small>Mid-Term · 2024</small>
                    </div>
                </div>
                <div className="intro-float-card intro-float-3">
                    <span>🔬</span>
                    <div>
                        <strong>Physics</strong>
                        <small>End-Term · 2026</small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroPage;
