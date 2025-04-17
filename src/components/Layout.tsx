
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, User, LogOut, Package, Settings, ArrowRightLeft, Wrench, Route } from "lucide-react";
import { useAuth } from '../hooks/useAuth';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="text-xl font-bold text-blue-600 flex items-center gap-2">
              <Package className="h-6 w-6" />
              Asset Nexus
            </Link>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:block">
                <ul className="flex space-x-6">
                  <li>
                    <Link 
                      to="/dashboard"
                      className={`text-sm font-medium ${location.pathname === '/dashboard' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/items"
                      className={`text-sm font-medium ${location.pathname.startsWith('/items') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      Items
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/item-types"
                      className={`text-sm font-medium ${location.pathname.startsWith('/item-types') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      Item Types
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/areas"
                      className={`text-sm font-medium ${location.pathname.startsWith('/areas') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      Areas
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/repairs"
                      className={`text-sm font-medium ${location.pathname.startsWith('/repairs') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      Repairs
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/issuance"
                      className={`text-sm font-medium ${location.pathname.startsWith('/issuance') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                    >
                      Issuances
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <>
                      <li>
                        <Link 
                          to="/users"
                          className={`text-sm font-medium ${location.pathname.startsWith('/users') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                        >
                          Users
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/trails"
                          className={`text-sm font-medium ${location.pathname.startsWith('/trails') ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
                        >
                          Trails
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.firstname} {user.lastname}</span>
                      <span className="text-xs font-normal text-slate-500">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Asset Nexus. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
