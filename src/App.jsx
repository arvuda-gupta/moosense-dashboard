import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Cows from './pages/Cows';
import CowProfile from './pages/CowProfile';
import Devices from './pages/Devices';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cows" element={<Cows />} />
          <Route path="/cows/:id" element={<CowProfile />} />
          <Route path="/devices" element={<Devices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
