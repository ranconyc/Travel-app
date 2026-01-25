import Typography from "@/components/atoms/Typography";

type Props = { isResident: boolean };

export default function ResidentOrVisitorBadge({ isResident }: Props) {
  return (
    <div
      className={`${
        isResident ? "bg-brand-warm" : "bg-brand-success"
      } text-white px-2 py-0.5 rounded-pill shadow-sm w-fit`}
    >
      <Typography variant="micro" className="text-white font-bold leading-none">
        {isResident ? "Local" : "Visitor"}
      </Typography>
    </div>
  );
}
