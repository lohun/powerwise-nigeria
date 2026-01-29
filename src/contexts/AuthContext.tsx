import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
    email: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("powerwise_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem("powerwise_user");
            }
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        // MOCK LOGIN
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const newUser = { email, token: "mock-jwt-token-12345" };
                setUser(newUser);
                localStorage.setItem("powerwise_user", JSON.stringify(newUser));
                resolve();
            }, 1000); // Simulate network delay
        });
    };

    const signup = async (email: string, password: string) => {
        // MOCK SIGNUP
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                // Auto-login after signup
                const newUser = { email, token: "mock-jwt-token-12345" };
                setUser(newUser);
                localStorage.setItem("powerwise_user", JSON.stringify(newUser));
                resolve();
            }, 1000); // Simulate network delay
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("powerwise_user");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
