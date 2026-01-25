"use client";

import { User } from "@/domain/user/user.schema";
import { createContext, useContext } from "react";
import { useAuthenticatedUser } from "@/domain/user/user.hooks";

const UserContext = createContext<User | null>(null);

export function UserProvider({
  children,
  user: initialUser,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  const { data: user } = useAuthenticatedUser(initialUser);

  return (
    <UserContext.Provider value={user || initialUser}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
