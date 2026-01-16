import { getUserById, getAllUsers } from "@/lib/db/user.repo";

export async function getUserProfile(id: string) {
  const user = await getUserById(id);
  return user;
}

export async function getAllUsersQuery() {
  const users = await getAllUsers();
  return users;
}
