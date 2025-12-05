import { memo } from "react";

function FormHeader() {
  return (
    <header className="bg-cyan-900 text-white font-bold text-2xl capitalize  p-4  pt-6 pb-16 md:px-6 md:max-w-1/3 md:mx-auto">
      <div className="text-base">complete your</div>
      <div className="text-5xl">profile</div>
    </header>
  );
}

export default memo(FormHeader);
