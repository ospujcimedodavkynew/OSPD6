
import React from 'react';
import { Customer } from '../types';
import { Input, Label } from './ui';

interface CustomerDetailsFormProps {
    customer: Partial<Omit<Customer, 'id' | 'drivers_license_image_path'>>;
    onCustomerChange: (field: keyof Omit<Customer, 'id'|'drivers_license_image_path'>, value: string) => void;
    isReadonly?: boolean;
}

const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({ customer, onCustomerChange, isReadonly = false }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onCustomerChange(name as keyof typeof customer, value);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="first_name">Křestní jméno</Label>
                <Input id="first_name" name="first_name" value={customer.first_name || ''} onChange={handleChange} readOnly={isReadonly} />
            </div>
            <div>
                <Label htmlFor="last_name">Příjmení</Label>
                <Input id="last_name" name="last_name" value={customer.last_name || ''} onChange={handleChange} readOnly={isReadonly} />
            </div>
            <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={customer.email || ''} onChange={handleChange} readOnly={isReadonly} />
            </div>
            <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" name="phone" type="tel" value={customer.phone || ''} onChange={handleChange} readOnly={isReadonly} />
            </div>
            <div>
                <Label htmlFor="id_card_number">Číslo OP</Label>
                <Input id="id_card_number" name="id_card_number" value={customer.id_card_number || ''} onChange={handleChange} readOnly={isReadonly} />
            </div>
            <div>
                <Label htmlFor="drivers_license_number">Číslo ŘP</Label>
                <Input id="drivers_license_number" name="drivers_license_number" value={customer.drivers_license_number || ''} onChange={handleChange} readOnly={isReadonly} />
            </div>
        </div>
    );
};

export default CustomerDetailsForm;
