export default function Block({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white p-4 rounded-md flex flex-col gap-2 w-full">
      {children}
    </div>
  );
}
