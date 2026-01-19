export default function StatsSection({
  requests,
  continentStats,
  visitedCountries,
}: {
  requests: any;
  continentStats: any;
  visitedCountries: any;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold">{requests?.length || 0}</h1>
          <h2 className="text-xs font-bold text-secondary uppercase">
            {requests?.length > 1 ? "Friends" : "Friend"}
          </h2>
        </div>
        <div>
          <h1 className="text-lg font-bold">{continentStats.count}</h1>
          <h2 className="text-xs font-bold text-secondary uppercase">
            {continentStats.count > 1 ? "Continents" : "Continent"}
          </h2>
        </div>
        <div>
          <h1 className="text-lg font-bold">{visitedCountries?.length || 0}</h1>
          <h2 className="text-xs font-bold text-secondary uppercase">
            countries
          </h2>
        </div>
      </div>
    </div>
  );
}
