export default function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-2 py-1 bg-surface border border-brand font-bold text-[10px] uppercase tracking-wider text-brand rounded-full absolute -bottom-2 left-1/2 -translate-x-1/2 shadow-sm z-10">
      {children}
    </div>
  );
}
