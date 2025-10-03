import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';
import { LoginPage } from '../../modules/auth/components/LoginPage';
import { ProfilePage } from '../../modules/users/components/ProfilePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
}
