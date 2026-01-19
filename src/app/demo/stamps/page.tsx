import PassportStamp from "@/app/components/common/PassportStamp";

export default function StampDemoPage() {
  const DEMO_CITIES = [
    {
      name: "Hong Kong",
      country: "China",

      color: "#1E1B4B",
    },
    {
      name: "Bangkok",
      country: "Thailand",

      color: "#065F46",
    },
    {
      name: "London",
      country: "UK",

      color: "#1E40AF",
    },
    {
      name: "Singapore",
      country: "Singapore",

      color: "#C80E0E",
    },
    {
      name: "Macau",
      country: "China",

      color: "#854D0E",
    },
    {
      name: "Paris",
      country: "France",

      color: "#7F1D1D",
    },
    {
      name: "Dubai",
      country: "UAE",

      color: "#92400E",
    },
    {
      name: "New York",
      country: "USA",
      color: "#0F172A",
    },
    {
      name: "Kuala Lumpur",
      country: "Malaysia",
      color: "#3730A3",
    },
    {
      name: "Istanbul",
      country: "Turkey",
      color: "#7C2D12",
    },
    {
      name: "Delhi",
      country: "India",
      color: "#B45309",
    },
    {
      name: "Antalya",
      country: "Turkey",
      color: "#0369A1",
    },
    {
      name: "Shenzhen",
      country: "China",
      color: "#334155",
    },
    {
      name: "Mumbai",
      country: "India",
      color: "#1E293B",
    },
    {
      name: "Phuket",
      country: "Thailand",
      color: "#15803D",
    },
    {
      name: "Rome",
      country: "Italy",
      color: "#991B1B",
    },
    {
      name: "Tokyo",
      country: "Japan",
      color: "#1E1B4B",
    },
    {
      name: "Pattaya",
      country: "Thailand",
      color: "#0E7490",
    },
    {
      name: "Taipei",
      country: "Taiwan",
      color: "#431407",
    },
    {
      name: "Mecca",
      country: "Saudi Arabia",
      color: "#064E3B",
    },
    {
      name: "Guangzhou",
      country: "China",
      color: "#111827",
    },
    {
      name: "Prague",
      country: "Czech Republic",
      color: "#78350F",
    },
    {
      name: "Seoul",
      country: "South Korea",
      color: "#4C1D95",
    },
    {
      name: "Amsterdam",
      country: "Netherlands",
      color: "#C2410C",
    },
    {
      name: "Miami",
      country: "USA",
      color: "#0891B2",
    },
    {
      name: "Barcelona",
      country: "Spain",
      color: "#1D4ED8",
    },
    {
      name: "Vienna",
      country: "Austria",
      color: "#701A75",
    },
    {
      name: "Shanghai",
      country: "China",
      color: "#3F6212",
    },
    {
      name: "Madrid",
      country: "Spain",
      color: "#9D174D",
    },
    {
      name: "Bali",
      country: "Indonesia",
      color: "#065F46",
    },
  ];

  return (
    <div className="p-8 grid grid-cols-2 gap-8 bg-gray-50">
      {DEMO_CITIES.map((city, i) => (
        <PassportStamp
          key={city.name}
          city={city.name}
          country={city.country}
          index={i}
          size="sm"
          // date="24 JUL 2024"
        />
      ))}
    </div>
  );
}
