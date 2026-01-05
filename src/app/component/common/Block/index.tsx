export default function Block({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-md flex flex-col gap-2 ${
        className === "w-fit" ? "w-fit" : "w-full"
      }`}
    >
      {children}
    </div>
  );
}
