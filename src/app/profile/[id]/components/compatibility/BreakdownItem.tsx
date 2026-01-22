export default function BreakdownItem({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="w-full flex justify-between">
      <h2 className="text-lg text-secondary">{title}</h2>
      <p className="text-bold font-sora text-lg">{value}</p>
    </div>
  );
}
