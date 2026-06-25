"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User, LoginCredentials, RegisterData } from "@/types";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  loginWithCredentials: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    api.getCurrentUser()
      .then((freshUser) => {
        localStorage.setItem("user", JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback((user: User, token: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    router.push("/dashboard");
  }, [router]);

  const loginWithCredentials = useCallback(async (credentials: LoginCredentials) => {
    const response = await api.login(credentials);
    if (response.requires_2fa_setup && response.challenge_token) {
      router.push(`/2fa/setup?token=${response.challenge_token}`);
    } else if (response.requires_2fa && response.challenge_token) {
      router.push(`/2fa/verify?token=${response.challenge_token}`);
    } else if (response.token && response.user) {
      login(response.user, response.token);
    }
  }, [login, router]);

  const register = useCallback(async (data: RegisterData) => {
    const response = await api.register(data);
    if (response.requires_2fa_setup && response.challenge_token) {
      router.push(`/2fa/setup?token=${response.challenge_token}`);
    } else if (response.token && response.user) {
      login(response.user, response.token);
    }
  }, [login, router]);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      router.push("/login");
    }
  }, [router]);

  const value = useMemo(() => ({
    user,
    token,
    login,
    loginWithCredentials,
    register,
    logout,
    isLoading,
  }), [user, token, login, loginWithCredentials, register, logout, isLoading]);

  return (
    <AuthContext.Provider value={value}>
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
