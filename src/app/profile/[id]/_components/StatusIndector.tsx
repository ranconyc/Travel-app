"use client";

import { useSocket } from "@/lib/socket/socket-context";

type Props = {
  userId: string;
};

export default function StatusIndector({ userId }: Props) {
  const { isUserOnline } = useSocket();
  const isOnline = isUserOnline(userId);
  return isOnline ? (
    <div className="h-3 w-3 bg-green-400 rounded-full" />
  ) : (
    <div className="h-3 w-3 bg-red-400 rounded-full" />
  );
}
