import Block from "@/components/atoms/Block";
import Title from "@/components/atoms/Title";
import { BookOpenCheck } from "lucide-react";

type VisaProps = {
  visaOnArrivalNote: string;
  passportValidityNote: string;
};

const subtitle = "text-sm font-medium capitalize mb-1";

export default function VisaSection({
  visaOnArrivalNote,
  passportValidityNote,
}: VisaProps) {
  return (
    <Block>
      <Title icon={<BookOpenCheck size={16} />}>Visa Entry</Title>
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
