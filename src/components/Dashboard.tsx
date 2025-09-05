
import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { rentals, vehicles, rentalRequests } = useData();

    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const pendingRequests = rentalRequests.filter(r => r.status === 'pending').length;
    const totalVehicles = vehicles.length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold text-text-secondary">Aktivní zápůjčky</h2>
                    <p className="text-4xl font-bold">{activeRentals}</p>
                </Card>
                <Card>
                    <h2 className="text-xl font-semibold text-text-secondary">Čekající žádosti</h2>
                    <p className="text-4xl font-bold">{pendingRequests}</p>
                </Card>
                <Card>
                    <h2 className="text-xl font-semibold text-text-secondary">Celkem vozidel</h2>
                    <p className="text-4xl font-bold">{totalVehicles}</p>
                </Card>
            </div>
            <div className="mt-8">
                 <Card>
                    <h2 className="text-xl font-semibold mb-4">Rychlé akce</h2>
                    <div className="flex space-x-4">
                        <Link to="/rentals/new" className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded">
                            Nová zápůjčka
                        </Link>
                         <Link to="/fleet" className="bg-secondary hover:opacity-90 text-white font-bold py-2 px-4 rounded">
                            Spravovat vozový park
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
