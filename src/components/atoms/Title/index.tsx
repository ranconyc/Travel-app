export default function Title({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const title = (
    <h1 className="text-p font-bold w-fit capitalize">{children}</h1>
  );
  return icon ? (
    <div className="flex items-center gap-2 mb-2">
      {icon}
      {title}
    </div>
  ) : (
    title
  );
}
