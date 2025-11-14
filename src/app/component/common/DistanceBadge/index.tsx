export default function DistanceBadge({
  distanceLabel,
}: {
  distanceLabel: string;
}) {
  return distanceLabel ? (
    <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs w-fit mb-2">
      {distanceLabel}
    </div>
  ) : null;
}
