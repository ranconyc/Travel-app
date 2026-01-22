import { User } from "@/domain/user/user.schema";

export function Footer({ profileUser }: { profileUser: User }) {
  return (
    <footer className="p-4 pt-12 grayscale opacity-50">
      <p className="text-center text-xs font-medium tracking-widest uppercase">
        Member since{" "}
        {new Date(profileUser.createdAt).toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        })}
      </p>
    </footer>
  );
}
