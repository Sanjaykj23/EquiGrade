import React from 'react';
import { Navbar } from '../Components/common/Navbar';
import { Footer } from '../Components/common/Footer';
import { QPAnalyzer } from '../Components/analyse/QPAnalyzer';

const AnalyseQP: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <QPAnalyzer />
      </main>
      <Footer />
    </div>
  );
};

export default AnalyseQP;
