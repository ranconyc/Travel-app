"use client";

import { User } from "@/domain/user/user.schema";
import { createContext, useContext } from "react";
import { MOCK_USER } from "@/lib/auth/mock-user";

const UserContext = createContext<User | null>(null);

export function UserProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const effectiveUser = user || MOCK_USER;
  return (
    <UserContext.Provider value={effectiveUser}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
