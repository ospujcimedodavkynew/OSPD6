
import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Vehicle, Customer, Rental, RentalRequest } from '../types';
import { initialVehicles, initialCustomers, initialRentals, initialRentalRequests } from '../data/mockData';

interface User {
    email: string;
}

interface DataContextType {
    vehicles: Vehicle[];
    customers: Customer[];
    rentals: Rental[];
    rentalRequests: RentalRequest[];
    addRental: (rental: Omit<Rental, 'id'>) => void;
    updateRental: (id: string, updates: Partial<Rental>) => void;
    addRentalRequest: (request: Omit<RentalRequest, 'id'>) => void;
    updateRentalRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
    user: User | null;
    login: (email: string) => void;
    logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
    const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
    const [rentals, setRentals] = useState<Rental[]>(initialRentals);
    const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>(initialRentalRequests);
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const addRental = (rental: Omit<Rental, 'id'>) => {
        const newRental: Rental = {
            ...rental,
            id: `r${rentals.length + 1}`,
        };
        setRentals(prev => [...prev, newRental]);
    };

    const updateRental = (id: string, updates: Partial<Rental>) => {
        setRentals(prev => prev.map(r => r.id === id ? {...r, ...updates} : r));
    }

    const addRentalRequest = (request: Omit<RentalRequest, 'id'>) => {
        const newRequest: RentalRequest = {
            ...request,
            id: `req${rentalRequests.length + 1}`,
        };
        setRentalRequests(prev => [...prev, newRequest]);
    };

    const updateRentalRequestStatus = (id: string, status: 'approved' | 'rejected') => {
        setRentalRequests(prev => prev.map(req => req.id === id ? {...req, status} : req));
    };

    const login = (email: string) => {
        const newUser = { email };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = useMemo(() => ({
        vehicles,
        customers,
        rentals,
        rentalRequests,
        addRental,
        updateRental,
        addRentalRequest,
        updateRentalRequestStatus,
        user,
        login,
        logout,
    }), [vehicles, customers, rentals, rentalRequests, user]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
