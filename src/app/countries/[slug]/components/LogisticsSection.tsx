export default function LogisticsSection({ data }: { data: any }) {
  return (
    <div className="min-h-100 px-4 py-6 border border-surface-secondery bg-surface rounded-2xl">
      <span className="text-xs uppercase font-bold color secondery">
        Logistics
      </span>
      <h2 className="text-xl font-bold">Logistics</h2>
      <h3>idd</h3>
      <p>{data.idd.root}</p>
      {data.idd.suffixes.length > 0 && <p>{data.idd.suffixes[0]}</p>}
      {data.idd.suffixes.length > 1 && <p>{data.idd.suffixes[1]}</p>}
      {data.idd.suffixes.length > 2 && <p>{data.idd.suffixes[2]}</p>}

      <h3>Timezones</h3>
      <p className="text-sm">
        {data.timezones.map((t: string) => t.replace("UTC", "")).join(", ")}
      </p>
      <h3>Start of the week</h3>
      <p>{data.startOfWeek}</p>

      <h3>Car</h3>
      <p>{data.car.side}</p>
      <p>{data.car.signs[0]}</p>
    </div>
  );
}
