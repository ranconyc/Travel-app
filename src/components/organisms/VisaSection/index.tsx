import Block from "@/components/atoms/Block";
import Typography from "@/components/atoms/Typography";
import { BookOpenCheck } from "lucide-react";

type VisaProps = {
  visaOnArrivalNote: string;
  passportValidityNote: string;
};

export default function VisaSection({
  visaOnArrivalNote,
  passportValidityNote,
}: VisaProps) {
  return (
    <Block>
      <div className="flex items-center gap-2 mb-2">
        <BookOpenCheck size={16} />
        <Typography variant="h3" weight="bold" className="w-fit capitalize">
          Visa Entry
        </Typography>
      </div>
      {/* i will want to know the nationally of the user */}
      <div>
        <Typography variant="ui-sm" className="capitalize mb-1">
          Visa on Arrival
        </Typography>
        <Typography variant="body-sm">{visaOnArrivalNote}</Typography>
      </div>
      <div>
        <Typography variant="ui-sm" className="capitalize mb-1">
          Passport Validity
        </Typography>
        <Typography variant="body-sm">{passportValidityNote}</Typography>
      </div>
    </Block>
  );
}
