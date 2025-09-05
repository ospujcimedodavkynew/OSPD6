
import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import Dashboard from './components/Dashboard';
import Fleet from './components/Fleet';
import Rentals from './components/Rentals';
import NewRentalForm from './components/NewRentalForm';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import ContractView from './components/ContractView';
import { DashboardIcon, FleetIcon, RentalsIcon, CalendarIcon, SettingsIcon } from './components/Icons';
import Login from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import CustomerFormPublic from './components/CustomerFormPublic';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode }> = ({ to, icon, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link to={to} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${isActive ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface'}`}>
            {icon}
            <span className="ml-3">{children}</span>
        </Link>
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, logout } = useData();

    if (!user) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <aside className="w-64 flex-shrink-0 bg-gray-800 p-4">
                <div className="text-2xl font-bold mb-8">VanRent</div>
                <nav className="space-y-2">
                    <NavLink to="/" icon={<DashboardIcon className="h-5 w-5" />}>Dashboard</NavLink>
                    <NavLink to="/fleet" icon={<FleetIcon className="h-5 w-5" />}>Vozový park</NavLink>
                    <NavLink to="/rentals" icon={<RentalsIcon className="h-5 w-5" />}>Půjčovné</NavLink>
                    <NavLink to="/calendar" icon={<CalendarIcon className="h-5 w-5" />}>Kalendář</NavLink>
                    <NavLink to="/settings" icon={<SettingsIcon className="h-5 w-5" />}>Nastavení</NavLink>
                </nav>
                <div className="absolute bottom-4">
                     <button onClick={logout} className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-text-secondary hover:bg-surface w-full text-left">
                        Odhlásit se
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
};


const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/public/request" element={<CustomerFormPublic />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/rentals/new" element={<NewRentalForm />} />
          <Route path="/rentals/:id" element={<ContractView />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
