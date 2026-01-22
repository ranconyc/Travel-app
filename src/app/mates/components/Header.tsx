import HeaderWrapper from "@/app/components/common/Header";

export default function Header() {
  return (
    <HeaderWrapper backButton>
      <p className="text-secondary text-xl">Find</p>
      <h1 className="text-4xl font-bold">Mates</h1>
    </HeaderWrapper>
  );
}
