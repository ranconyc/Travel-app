import { getAllUsers } from "@/lib/db/user.repo";
import UsersTable from "@/app/admin/users/UsersTable";

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold font-sora tracking-tight mb-2">
          User Management
        </h1>
        <p className="text-secondary max-w-2xl leading-relaxed">
          View all registered users and manage their access roles.
        </p>
      </header>

      <UsersTable initialUsers={JSON.parse(JSON.stringify(users))} />
    </div>
  );
}
