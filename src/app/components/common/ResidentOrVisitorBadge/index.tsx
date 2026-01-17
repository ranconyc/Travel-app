type Props = { isResident: boolean };

export default function ResidentOrVisitorBadge({ isResident }: Props) {
  return (
    <div
      className={`${
        isResident ? "bg-blue-500" : "bg-yellow-500"
      } text-white px-2 py-1 rounded-full text-xs capitalize w-fit`}
    >
      {isResident ? "resident" : "visitor"}
    </div>
  );
}
