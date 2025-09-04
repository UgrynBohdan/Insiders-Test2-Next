"use client";

import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  user: any;
  loggedIn: boolean;
  loading: boolean;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loggedIn: false,
  loading: true,
  refreshUser: () => {},
});

async function fetchUser() {
  const res = await fetch("/api/auth/me");
  if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: fetchUser,
    retry: false,
  });

  const refreshUser = () => {
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
  };

  const value: AuthContextType = {
    user: data?.user ?? null,
    loggedIn: data?.loggedIn ?? false,
    loading: isLoading,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
