export default function StatusIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <div
      className={`${isOnline ? "bg-success" : "bg-error"} h-2 w-2 rounded-full`}
    ></div>
  );
}
