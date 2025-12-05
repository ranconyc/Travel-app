import Link from "next/link";
import { UserRoundSearch, Binoculars, MessageCircle } from "lucide-react";

const iconsSize = 24;

export default function Navbar() {
  return (
    <nav className="fixed bottom-4 left-20 right-20">
      <ul className="flex items-center justify-around bg-white px-2 py-4 rounded-full shadow-xl">
        <li>
          <Link href="/">
            <Binoculars size={iconsSize} />
          </Link>
        </li>
        <li>
          <Link href="/nearby-mates">
            <UserRoundSearch size={iconsSize} />
          </Link>
        </li>
        <li>
          <Link href="/chats">
            <MessageCircle size={iconsSize} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
