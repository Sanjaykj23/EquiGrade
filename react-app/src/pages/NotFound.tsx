import React from 'react';
import { Navbar } from '../Components/common/Navbar';
import { Footer } from '../Components/common/Footer';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 container d-flex align-items-center justify-content-center py-5">
        <div className="text-center">
          <h1 className="display-1 fw-bold text-gradient">404</h1>
          <h3 className="text-white mb-3">Page Not Found</h3>
          <p className="text-muted mb-4">The page you are looking for does not exist or has been moved.</p>
          <Link to="/" className="btn-primary-gradient text-decoration-none">
            <Home size={18} className="me-2" /> Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
