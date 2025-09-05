
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Card, Button } from './ui';
import SignaturePad from './SignaturePad';

const ContractView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { rentals, vehicles, customers, updateRental } = useData();
    const [isSigningCustomer, setIsSigningCustomer] = useState(false);
    const [isSigningCompany, setIsSigningCompany] = useState(false);
    
    const rental = rentals.find(r => r.id === id);

    if (!rental) {
        return <div>Smlouva nenalezena.</div>;
    }

    const vehicle = vehicles.find(v => v.id === rental.vehicleId);
    const customer = customers.find(c => c.id === rental.customerId);

    if (!vehicle || !customer) {
        return <div>Data o vozidle nebo zákazníkovi nenalezena.</div>;
    }
    
    const handleSaveSignature = (field: 'customer_signature' | 'company_signature', dataUrl: string) => {
        updateRental(rental.id, { [field]: dataUrl });
        setIsSigningCustomer(false);
        setIsSigningCompany(false);
    }

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6">Smlouva o pronájmu vozidla č. {rental.id}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-2">Informace o vozidle</h2>
                    <p><strong>Vozidlo:</strong> {vehicle.brand} ({vehicle.year})</p>
                    <p><strong>SPZ:</strong> {vehicle.license_plate}</p>
                    <p><strong>VIN:</strong> {vehicle.vin}</p>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Informace o zákazníkovi</h2>
                    <p><strong>Jméno:</strong> {customer.first_name} {customer.last_name}</p>
                    <p><strong>Email:</strong> {customer.email}</p>
                    <p><strong>Telefon:</strong> {customer.phone}</p>
                    <p><strong>Číslo OP:</strong> {customer.id_card_number}</p>
                    <p><strong>Číslo ŘP:</strong> {customer.drivers_license_number}</p>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-2">Podrobnosti o pronájmu</h2>
                <p><strong>Začátek:</strong> {new Date(rental.startDate).toLocaleString()}</p>
                <p><strong>Konec:</strong> {new Date(rental.endDate).toLocaleString()}</p>
                <p><strong>Celková cena:</strong> {rental.totalPrice} Kč</p>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-2">Podpis zákazníka</h2>
                    {rental.customer_signature ? (
                        <img src={rental.customer_signature} alt="Podpis zákazníka" className="bg-white rounded border border-gray-300" />
                    ) : (
                        isSigningCustomer ? (
                            <SignaturePad onSave={(data) => handleSaveSignature('customer_signature', data)} onCancel={() => setIsSigningCustomer(false)} />
                        ) : (
                            <Button onClick={() => setIsSigningCustomer(true)}>Podepsat</Button>
                        )
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Podpis společnosti</h2>
                    {rental.company_signature ? (
                        <img src={rental.company_signature} alt="Podpis společnosti" className="bg-white rounded border border-gray-300" />
                    ) : (
                         isSigningCompany ? (
                            <SignaturePad onSave={(data) => handleSaveSignature('company_signature', data)} onCancel={() => setIsSigningCompany(false)} />
                        ) : (
                            <Button onClick={() => setIsSigningCompany(true)}>Podepsat</Button>
                        )
                    )}
                </div>
            </div>

        </Card>
    );
};

export default ContractView;
