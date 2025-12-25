import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const LoginScreen = ({ onLogin }) => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onLogin(username.trim());
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
            <div className="w-full max-w-md p-8 bg-card rounded-xl shadow-2xl border animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <MessageSquare className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Welcome to Chat App
                    </h1>
                    <p className="text-muted-foreground mt-2 text-center">
                        Enter your username to start chatting
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 pl-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                            placeholder="e.g. Alex"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!username.trim()}
                        className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
                    >
                        Get Started
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginScreen;
