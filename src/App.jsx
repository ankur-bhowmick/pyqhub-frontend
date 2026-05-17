import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import IntroPage from './pages/IntroPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UniversityPapers from './pages/UniversityPapers';
import RatingsPage from './pages/RatingsPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUniversities from './pages/AdminUniversities';
import AdminPapers from './pages/AdminPapers';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/universities" />;
    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Intro page — shown to unauthenticated users */}
            <Route path="/" element={
                user
                    ? <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/universities'} />
                    : <IntroPage />
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/universities" element={<Home />} />
            <Route path="/university/:id" element={<UniversityPapers />} />
            <Route path="/ratings" element={<RatingsPage />} />
            <Route path="/contact" element={
                <ProtectedRoute><ContactPage /></ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/universities" element={
                <ProtectedRoute adminOnly><AdminUniversities /></ProtectedRoute>
            } />
            <Route path="/admin/papers" element={
                <ProtectedRoute adminOnly><AdminPapers /></ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <main className="main-content">
                    <AppRoutes />
                </main>
            </Router>
        </AuthProvider>
    );
};

export default App;
