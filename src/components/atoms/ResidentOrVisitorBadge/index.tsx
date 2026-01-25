import Typography from "@/components/atoms/Typography";

type Props = { isResident: boolean };

export default function ResidentOrVisitorBadge({ isResident }: Props) {
  return (
    <div
      className={`${
        isResident ? "bg-brand-warm" : "bg-brand-success"
      } text-white px-1.5 py-1 inline-flex items-center justify-center rounded-pill shadow-sm w-fit`}
    >
      <Typography variant="micro" className="text-white font-bold leading-none">
        {isResident ? "Local" : "Visitor"}
      </Typography>
    </div>
  );
}
