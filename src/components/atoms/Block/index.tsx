export default function Block({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-bg-card text-txt-main p-md rounded-pill flex flex-col gap-sm ${
        className === "w-fit" ? "w-fit" : "w-full"
      } ${className}`}
    >
      {children}
    </div>
  );
}
