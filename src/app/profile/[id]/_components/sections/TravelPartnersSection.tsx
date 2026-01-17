import Block from "@/app/components/common/Block";
import Title from "@/app/components/Title";
import { Users } from "lucide-react";
import { UserLink } from "../UserLink";
import { ProfileUser } from "@/types/user";

export const TravelPartnersSection = ({ user }: { user: ProfileUser }) => (
  <Block>
    <Title icon={<Users size={22} />}>Travel Partners</Title>
    {/* later you can pass a real list of mates instead of the same user */}
    <UserLink user={user} />
  </Block>
);
