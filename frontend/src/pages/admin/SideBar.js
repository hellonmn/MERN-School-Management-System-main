import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Home,
    School,
    BookOpen,
    GraduationCap,
    Users,
    Bell,
    AlertTriangle,
    User,
    LogOut,
    ChevronRight
} from 'lucide-react';

const SideBar = ({ sidebarOpen = true }) => {
    const location = useLocation();

    const navigationItems = [
        {
            title: 'Main',
            items: [
                {
                    name: 'Dashboard',
                    path: '/',
                    icon: Home,
                    isActive: location.pathname === '/' || location.pathname === '/Admin/dashboard'
                },
                {
                    name: 'Classes',
                    path: '/Admin/classes',
                    icon: School,
                    isActive: location.pathname.startsWith('/Admin/classes')
                },
                {
                    name: 'Subjects',
                    path: '/Admin/subjects',
                    icon: BookOpen,
                    isActive: location.pathname.startsWith('/Admin/subjects')
                },
                {
                    name: 'Teachers',
                    path: '/Admin/teachers',
                    icon: GraduationCap,
                    isActive: location.pathname.startsWith('/Admin/teachers')
                },
                {
                    name: 'Students',
                    path: '/Admin/students',
                    icon: Users,
                    isActive: location.pathname.startsWith('/Admin/students')
                },
                {
                    name: 'Notices',
                    path: '/Admin/notices',
                    icon: Bell,
                    isActive: location.pathname.startsWith('/Admin/notices')
                },
                {
                    name: 'Complaints',
                    path: '/Admin/complains',
                    icon: AlertTriangle,
                    isActive: location.pathname.startsWith('/Admin/complains')
                }
            ]
        },
        {
            title: 'Account',
            items: [
                {
                    name: 'Profile',
                    path: '/Admin/profile',
                    icon: User,
                    isActive: location.pathname.startsWith('/Admin/profile')
                },
                {
                    name: 'Logout',
                    path: '/logout',
                    icon: LogOut,
                    isActive: location.pathname.startsWith('/logout'),
                    isLogout: true
                }
            ]
        }
    ];

    const NavItem = ({ item }) => {
        const Icon = item.icon;
        
        return (
            <Link
                to={item.path}
                className={`
                    group flex gap-2 items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${item.isActive 
                        ? 'bg-blue-100 text-blue-700 shadow-sm' 
                        : item.isLogout
                            ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }
                    ${!sidebarOpen ? 'justify-center px-2' : ''}
                `}
                title={!sidebarOpen ? item.name : ''}
            >
                <Icon 
                    className={`
                        w-5 h-5 flex-shrink-0 transition-colors duration-200
                        ${item.isActive 
                            ? 'text-blue-700' 
                            : item.isLogout
                                ? 'text-red-500 group-hover:text-red-600'
                                : 'text-gray-400 group-hover:text-gray-600'
                        }
                    `}
                />
                
                {sidebarOpen && (
                    <span className="flex-1">{item.name}</span>
                )}
                
                {sidebarOpen && item.isActive && (
                    <ChevronRight className="w-4 h-4 text-blue-700" />
                )}
            </Link>
        );
    };

    const SectionHeader = ({ title }) => {
        if (!sidebarOpen) {
            return <div className="border-t border-gray-200 my-3"></div>;
        }
        
        return (
            <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {title}
                </h3>
            </div>
        );
    };

    return (
        <nav className="flex flex-col justify-between h-full">
            <div className='flex flex-col gap-2'>
                {navigationItems.map((section, sectionIndex) => (
                    <div key={section.title}>
                        {sectionIndex > 0 && <SectionHeader title={section.title} />}
                        
                        <div className="flex flex-col gap-1">
                            {section.items.map((item) => (
                                <NavItem key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
           
            {/* Help Section - only show when sidebar is open */}
            {sidebarOpen && (
                <div className="mt-4 px-3 pb-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">Need Help?</h4>
                        <p className="text-xs text-gray-600 mb-3">
                            Check our documentation or contact support for assistance.
                        </p>
                        <button className="w-full text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-3 rounded-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm">
                            Contact Support
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default SideBar;