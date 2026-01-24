import Link from "next/link";

export default function AddSection({
  title,
  link,
}: {
  title: string;
  link: { href: string; label: string };
}) {
  return (
    <div className="bg-surface/50 p-md rounded-xl border-2 border-dashed border-surface-secondary">
      <p className="text-md text-secondary">{title}</p>
      <Link
        href={link.href}
        className="text-xs text-brand font-bold hover:underline"
      >
        {link.label}
      </Link>
    </div>
  );
}
