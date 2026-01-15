import { memo } from "react";

function FormHeader() {
  return (
    <header className="p-4">
      <div>
        <p className="text-lg text-secondary">complete your</p>
        <h1 className="text-3xl font-bold">profile</h1>
      </div>
    </header>
  );
}

export default memo(FormHeader);
