import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Overview from './pages/Overview';
import ForestMap from './pages/ForestMap';
import Alerts from './pages/Alerts';
import ActiveCases from './pages/ActiveCases';
import Reports from './pages/Reports';
import Rangers from './pages/Rangers';
import Sensors from './pages/Sensors';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-950 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/forest-map" element={<ForestMap />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/active-cases" element={<ActiveCases />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/rangers" element={<Rangers />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
