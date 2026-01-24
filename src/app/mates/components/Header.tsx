import HeaderWrapper from "@/components/molecules/Header";

export default function Header() {
  return (
    <HeaderWrapper backButton>
      <p className="text-secondary text-xl">Find</p>
      <h1 className="text-h1 font-bold">Mates</h1>
    </HeaderWrapper>
  );
}
