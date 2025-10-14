import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../../shared/components/ProtectedRoute';
import { ProfilePage } from '../../modules/users/components/ProfilePage';
import { AuthPage } from '../../modules/auth/components';
import { ProjectPage } from '../../modules/projects/components';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />

      <Route element={<ProtectedRoute />}>
        <Route index element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/project" element={<ProjectPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/profile" replace />} />
    </Routes>
  );
}
