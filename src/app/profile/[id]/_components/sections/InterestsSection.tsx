import Block from "@/app/components/common/Block";
import Title from "@/app/components/Title";
import { MessageCircleHeart } from "lucide-react";

export const InterestsSection = () => (
  <Block>
    <Title icon={<MessageCircleHeart size={22} />}>Interests</Title>
    <div className="flex gap-2 flex-wrap">
      {["Travel", "Food", "Music"].map((interest) => (
        <div
          key={interest}
          className="border border-gray-300 px-3 py-2 rounded-lg text-sm"
        >
          {interest}
        </div>
      ))}
    </div>
  </Block>
);
