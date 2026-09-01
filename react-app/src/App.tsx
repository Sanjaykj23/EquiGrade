import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NormaliseQP from './pages/NormaliseQP';
import AnalyseQP from './pages/AnalyseQP';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/normalise" element={<NormaliseQP />} />
        <Route path="/analyse" element={<AnalyseQP />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;