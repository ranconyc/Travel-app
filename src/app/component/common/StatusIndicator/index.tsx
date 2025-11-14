export default function StatusIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <div
      className={`${
        isOnline ? "bg-green-500" : "bg-red-500"
      } h-2 w-2 rounded-full`}
    ></div>
  );
}
