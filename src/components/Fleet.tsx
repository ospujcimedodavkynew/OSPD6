
import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';

const Fleet: React.FC = () => {
    const { vehicles } = useData();

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Vozový park</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                    <Card key={vehicle.id}>
                        <h2 className="text-xl font-bold">{vehicle.brand}</h2>
                        <p className="text-text-secondary">{vehicle.year}</p>
                        <div className="mt-4 space-y-2">
                            <p><strong>SPZ:</strong> {vehicle.license_plate}</p>
                            <p><strong>VIN:</strong> {vehicle.vin}</p>
                            <p><strong>Cena/den:</strong> {vehicle.pricing.perDay} Kč</p>
                            <p><strong>STK do:</strong> {new Date(vehicle.stk_date).toLocaleDateString()}</p>
                            <p><strong>Dálniční známka do:</strong> {new Date(vehicle.vignette_until).toLocaleDateString()}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Fleet;
