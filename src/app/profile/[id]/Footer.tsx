import { User } from "@/domain/user/user.schema";

export function Footer({ profileUser }: { profileUser: User }) {
  return (
    <footer className="pt-12 border-t border-surface grayscale opacity-50">
      <p className="text-center text-xs font-medium tracking-widest uppercase">
        Travelmate Profile &bull; Member since{" "}
        {new Date(profileUser.createdAt).toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </p>
    </footer>
  );
}
