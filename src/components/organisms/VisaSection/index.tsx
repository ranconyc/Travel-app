import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { BookOpenCheck } from "lucide-react";

type VisaProps = {
  visaOnArrivalNote: string;
  passportValidityNote: string;
};

const subtitle = "text-ui-sm capitalize mb-1";

export default function VisaSection({
  visaOnArrivalNote,
  passportValidityNote,
}: VisaProps) {
  return (
    <Block>
      <div className="flex items-center gap-2 mb-2">
        <BookOpenCheck size={16} />
        <Typography variant="h1" className="font-bold w-fit capitalize">
          Visa Entry
        </Typography>
      </div>
      {/* i will want to know the nationally of the user */}
      <div>
        <h2 className={subtitle}>Visa on Arrival</h2>
        <p className="text-sm">{visaOnArrivalNote}</p>
      </div>
      <div>
        <h2 className={subtitle}>Passport Validity</h2>
        <p className="text-sm">{passportValidityNote}</p>
      </div>
    </Block>
  );
}
