
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Label } from './ui';
import { Customer, Vehicle } from '../types';

const NewRentalForm: React.FC = () => {
    const { vehicles, customers, addRental } = useData();
    const navigate = useNavigate();

    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const calculatePrice = () => {
        if (!selectedVehicleId || !startDate || !endDate) return 0;
        const vehicle = vehicles.find(v => v.id === selectedVehicleId);
        if (!vehicle) return 0;

        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        if (start >= end) return 0;

        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        return days * vehicle.pricing.perDay;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedVehicleId || !selectedCustomerId || !startDate || !endDate) {
            alert('Vyplňte prosím všechna pole.');
            return;
        }

        addRental({
            vehicleId: selectedVehicleId,
            customerId: selectedCustomerId,
            startDate,
            endDate,
            totalPrice: calculatePrice(),
            status: 'pending',
        });

        navigate('/rentals');
    };

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6">Nová zápůjčka</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="vehicle">Vozidlo</Label>
                    <select id="vehicle" value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-text-primary leading-tight focus:outline-none focus:shadow-outline border-gray-600">
                        <option value="">Vyberte vozidlo</option>
                        {vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} - {v.license_plate}</option>)}
                    </select>
                </div>
                <div>
                    <Label htmlFor="customer">Zákazník</Label>
                     <select id="customer" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-text-primary leading-tight focus:outline-none focus:shadow-outline border-gray-600">
                        <option value="">Vyberte zákazníka</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                    </select>
                </div>
                 <div>
                    <Label htmlFor="startDate">Začátek pronájmu</Label>
                    <Input id="startDate" type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="endDate">Konec pronájmu</Label>
                    <Input id="endDate" type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="text-xl font-bold">
                    Celková cena: {calculatePrice()} Kč
                </div>
                <div>
                    <Button type="submit">Vytvořit zápůjčku</Button>
                </div>
            </form>
        </Card>
    );
};

export default NewRentalForm;
