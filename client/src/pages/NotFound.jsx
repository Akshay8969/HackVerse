import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Zap } from 'lucide-react';

const NotFound = () => (
  <MainLayout>
    <div className="min-h-[80vh] flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl font-extrabold gradient-text font-['Outfit'] mb-4">404</div>
        <h1 className="text-white text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          Looks like this page went off-grid. Let's get you back to the hackathon.
        </p>
        <Link to="/" className="btn-primary text-base px-8 py-3">
          <Zap size={18} /> Back to Home
        </Link>
      </div>
    </div>
  </MainLayout>
);

export default NotFound;
