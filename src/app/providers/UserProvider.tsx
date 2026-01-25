"use client";

import { User } from "@/domain/user/user.schema";
import { createContext, useContext } from "react";
import { useAuthenticatedUser } from "@/domain/user/user.hooks";

const UserContext = createContext<User | null>(null);

import { useUnreadCount } from "@/hooks/useUnreadCount";

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
      <GlobalListeners />
      {children}
    </UserContext.Provider>
  );
}

function GlobalListeners() {
  useUnreadCount();
  return null;
}

export function useUser() {
  return useContext(UserContext);
}
