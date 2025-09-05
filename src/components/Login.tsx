
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Button, Card, Input, Label } from './ui';

const Login: React.FC = () => {
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password');
    const navigate = useNavigate();
    const { login } = useData();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login
        if (email && password) {
            login(email);
            navigate('/');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <Card className="w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-6">VanRent - Přihlášení</h1>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="password">Heslo</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Button type="submit">
                            Přihlásit se
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Login;
