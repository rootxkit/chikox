import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import UsersPage from './pages/Users';
import ProductsPage from './pages/Products';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
