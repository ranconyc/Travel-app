"use client";

import { X } from "lucide-react";

export const SelectedItem = ({
  item,
  onClick,
}: {
  item: string;
  onClick?: () => void;
}) => (
  <li
    className="flex items-center gap-2 border border-brand/30 px-3 py-1.5 text-sm w-fit rounded-full bg-brand/10 text-brand font-medium hover:bg-brand/20 transition-colors cursor-pointer capitalize"
    onClick={onClick}
  >
    {item}
    <X size={14} />
  </li>
);

export default SelectedItem;
