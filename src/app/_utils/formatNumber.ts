export function formatNumberShort(num: number | null | undefined): string {
  if (num == null || isNaN(num)) return "";

  if (num < 1000) return String(num); // 531
  if (num < 1_000_000) return (num / 1_000).toFixed(1) + "K"; // 2.5K
  if (num < 1_000_000_000) return (num / 1_000_000).toFixed(1) + "M"; // 2.6M
  return (num / 1_000_000_000).toFixed(1) + "B"; // 1.2B
}

export function formatPopulation(num: number | null | undefined): string {
  if (num == null || isNaN(num)) return "N/A";

  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(0) + "k";
  }
  return num.toString();
}
