// components/layout/Header.js
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Header = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <header className="bg-indigo-600">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between border-b border-indigo-500 lg:border-none">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-white text-lg font-medium">
              Batuhan Task Management
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              <Link href="/dashboard" className="text-base font-medium text-white hover:text-indigo-50">
                Dashboard
              </Link>
              <Link href="/projects" className="text-base font-medium text-white hover:text-indigo-50">
                Projects
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">{user?.name} ({user?.role})</span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          <Link href="/dashboard" className="text-base font-medium text-white hover:text-indigo-50">
            Dashboard
          </Link>
          <Link href="/projects" className="text-base font-medium text-white hover:text-indigo-50">
            Projects
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;