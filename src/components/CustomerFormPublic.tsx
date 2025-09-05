
import React, { useState } from 'react';
import CustomerDetailsForm from './CustomerDetailsForm';
import { Customer } from '../types';
import { Button, Card, Input, Label } from './ui';
import { useData } from '../context/DataContext';

const CustomerFormPublic: React.FC = () => {
    const [customerDetails, setCustomerDetails] = useState<Partial<Omit<Customer, 'id' | 'drivers_license_image_path'>>>({});
    const [driversLicenseImage, setDriversLicenseImage] = useState<string | null>(null);
    const [consent, setConsent] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { addRentalRequest } = useData();

    const handleCustomerChange = (field: keyof typeof customerDetails, value: string) => {
        setCustomerDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setDriversLicenseImage(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!consent) {
            alert('Musíte souhlasit se zpracováním osobních údajů.');
            return;
        }

        addRentalRequest({
            customer_details: customerDetails as Omit<Customer, 'id' | 'drivers_license_image_path'>,
            drivers_license_image_base64: driversLicenseImage,
            digital_consent_at: new Date().toISOString(),
            status: 'pending',
        });
        
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Card className="w-full max-w-lg text-center">
                    <h1 className="text-2xl font-bold mb-4">Žádost odeslána</h1>
                    <p>Děkujeme za Vaši žádost. Brzy se Vám ozveme s dalšími informacemi.</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex justify-center py-12">
            <Card className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-6">Žádost o pronájem vozidla</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <CustomerDetailsForm customer={customerDetails} onCustomerChange={handleCustomerChange} />
                    <div>
                        <Label htmlFor="drivers-license-img">Nahrát fotku řidičského průkazu (přední strana)</Label>
                        <Input id="drivers-license-img" type="file" accept="image/*" onChange={handleImageUpload} />
                    </div>
                    {driversLicenseImage && (
                        <div>
                            <p>Náhled:</p>
                            <img src={driversLicenseImage} alt="Náhled ŘP" className="max-w-xs rounded" />
                        </div>
                    )}
                    <div className="flex items-center">
                        <input id="consent" type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="h-4 w-4 rounded" />
                        <Label htmlFor="consent" className="ml-2 mb-0">
                            Souhlasím se zpracováním osobních údajů pro účely pronájmu vozidla.
                        </Label>
                    </div>
                    <Button type="submit" disabled={!consent}>Odeslat žádost</Button>
                </form>
            </Card>
        </div>
    );
};

export default CustomerFormPublic;
