import { useState, useEffect } from 'react';

// auth.js - Authentication utility functions
export const API_BASE_URL = 'http://localhost:8080';

export const AuthAPI = {
    // Login function
    login: async (email, password) => {
        console.log('AuthAPI.login called');
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.token) {
            localStorage.setItem('authToken', data.token);
        }

        return data;
    },

    // Register function
    register: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        return response.json();
    },

    // Logout function
    logout: async () => {
        localStorage.removeItem('authToken'); // Clear token on logout
        return { success: true };
    },

    // Get current user
    getCurrentUser: async () => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/auth/user`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.json();
    },

    // Change user role (admin only)
    changeRole: async (targetEmail, newRoleId) => {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/auth/admin/changerole?targetEmail=${targetEmail}&newRoleId=${newRoleId}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.json();
    }
};

// Local storage helpers
export const AuthStorage = {
    setUserData: (user, token) => {
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.username);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('authToken', token);

        if (user.isAdmin) {
            localStorage.setItem('adminLoggedIn', 'true');
            localStorage.setItem('userType', 'admin');
        } else {
            localStorage.setItem('adminLoggedIn', 'false');
            localStorage.setItem('userType', 'user');
        }
    },

    clearUserData: () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('userType');
        localStorage.removeItem('authToken');
    },

    isLoggedIn: () => {
        return localStorage.getItem('userLoggedIn') === 'true';
    },

    isAdmin: () => {
        return localStorage.getItem('adminLoggedIn') === 'true';
    },

    getCurrentUser: () => {
        if (!AuthStorage.isLoggedIn()) return null;

        return {
            id: localStorage.getItem('userId'),
            email: localStorage.getItem('userEmail'),
            username: localStorage.getItem('userName'),
            role: localStorage.getItem('userRole'),
            isAdmin: AuthStorage.isAdmin()
        };
    }
};

// React hook for authentication state
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                if (AuthStorage.isLoggedIn()) {
                    const localUser = AuthStorage.getCurrentUser();
                    setUser(localUser);

                    const response = await AuthAPI.getCurrentUser();
                    if (response.success) {
                        setUser(response.user);
                        const token = localStorage.getItem('authToken');
                        AuthStorage.setUserData(response.user, token);
                    } else {
                        AuthStorage.clearUserData();
                        setUser(null);
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                AuthStorage.clearUserData();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();

        const handleLoginStatusChange = () => {
            if (AuthStorage.isLoggedIn()) {
                setUser(AuthStorage.getCurrentUser());
            } else {
                setUser(null);
            }
        };

        window.addEventListener('loginStatusChanged', handleLoginStatusChange);
        return () => window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await AuthAPI.login(email, password);
            if (response.success) {
                AuthStorage.setUserData(response.user, response.token);
                setUser(response.user);
                window.dispatchEvent(new Event('loginStatusChanged'));
                return { success: true, user: response.user };
            } else {
                return { success: false, message: response.message };
            }
        } catch (error) {
            return { success: false, message: 'Network error occurred' };
        }
    };

    const logout = async () => {
        try {
            await AuthAPI.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            AuthStorage.clearUserData();
            setUser(null);
            window.dispatchEvent(new Event('loginStatusChanged'));
        }
    };

    return {
        user,
        isLoading,
        isLoggedIn: !!user,
        isAdmin: user?.isAdmin || false,
        login,
        logout
    };
};