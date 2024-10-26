
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import SignOutButton from '@/components/auth/SignOutButton';
export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Dashboard Content</div>
      <SignOutButton/>
    </ProtectedRoute>
  );
}