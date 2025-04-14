// components/layout/Sidebar.js
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const { projectList } = useSelector((state) => state.projects);
  const router = useRouter();

  // Check if the current route matches a project route
  const isProjectRoute = (id) => {
    return router.pathname.includes('/projects/') && router.query.id === id;
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 min-h-screen">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Role: {user?.role}</h2>
        <p className="text-sm text-gray-300">{user?.email}</p>
      </div>

      <nav>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Main</h3>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard" 
                className={`block px-4 py-2 rounded-md ${
                  router.pathname === '/dashboard' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/projects" 
                className={`block px-4 py-2 rounded-md ${
                  router.pathname === '/projects' 
                    ? 'bg-gray-900 text-white' 
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                All Projects
              </Link>
            </li>
          </ul>
        </div>

        {projectList.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">Your Projects</h3>
            <ul className="space-y-2">
              {projectList.map((project) => (
                <li key={project._id}>
                  <Link 
                    href={`/projects/${project._id}`}
                    className={`block px-4 py-2 rounded-md ${
                      isProjectRoute(project._id)
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {project.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;