const data = [
  {
    header: "thailand",
    description:
      "Thailand is a vibrant Southeast Asian country known for beautiful islands, rich culture, Buddhist temples, delicious street food, and warm hospitality. From Bangkok’s energy to peaceful beaches, it offers unforgettable travel experiences.",
  },
];

const darkModeHeader = "text-white";
const lightModeHeader = "text-stone-700";

const ErrorCard = ({ mode }: { mode: string }) => {
  const lightMode = "text-rose-900 bg-rose-200 border border-rose-400";
  const darkMode = "text-rose-200 bg-rose-900 border border-rose-600";

  return (
    <div
      className={`flex flex-col gap-2 p-md rounded my-4 ${
        mode === "dark" ? darkMode : lightMode
      }`}
    >
      <h1 className="text-2xl font-bold capitalize">error</h1>
      <p className={pStyle}>Something went wrong!</p>
    </div>
  );
};
const SuccessCard = ({ mode }: { mode: string }) => {
  const lightMode = "text-green-900 bg-green-200 border border-green-400";
  const darkMode = "text-green-200 bg-green-900 border border-green-600";

  return (
    <div
      className={`flex flex-col gap-2 p-md rounded my-4 ${
        mode === "dark" ? darkMode : lightMode
      }`}
    >
      <h1 className="text-2xl font-bold capitalize"> success</h1>
      <p className={pStyle}>you reday for next step.</p>
    </div>
  );
};

const WarningCard = ({ mode }: { mode: string }) => {
  const lightMode = "text-yellow-900 bg-yellow-200 border border-yellow-400";
  const darkMode = "text-yellow-200 bg-yellow-900 border border-yellow-600";

  return (
    <div
      className={`flex flex-col gap-2 p-md rounded my-4 ${
        mode === "dark" ? darkMode : lightMode
      }`}
    >
      <h1 className="text-2xl font-bold capitalize">warning</h1>
      <p className={pStyle}>be careful!</p>
    </div>
  );
};

const Button = ({
  mode,
  children,
  type,
}: {
  mode: string;
  children: React.ReactNode;
  type?: "primary" | "secondary" | "disabled";
}) => {
  const disabledMode =
    mode === "dark"
      ? "text-gray-600 bg-gray-900 border border-gray-600 cursor-not-allowed "
      : "text-gray-300 bg-gray-50 border border-gray-300 cursor-not-allowed";

  const primaryMode = `bg-amber-500 border border-amber-600 ${
    mode === "dark" ? "" : "text-rose-200"
  }`;

  const secondaryMode =
    mode === "dark"
      ? "text-white bg-slate-600 border border-slate-600"
      : "text-slate-700 bg-white border border-slate-600";

  return (
    <button
      className={`flex flex-col gap-2 py-2 px-6 rounded capitalize cursor-pointer my-4 ${
        type === "disabled"
          ? disabledMode
          : type === "secondary"
            ? secondaryMode
            : primaryMode
      }`}
    >
      {children}
    </button>
  );
};

const DarkMode = () => (
  <div className="h-full w-1/2 text-white bg-slate-900 p-md">
    <h1 className={`text-2xl font-bold capitalize ${darkModeHeader}`}>
      dark mode
    </h1>
    <div className="flex flex-col gap-2 p-md bg-slate-600 border border-slate-400 rounded my-4 ">
      <h1 className="text-2xl font-bold capitalize">{data[0].header}</h1>
      <p className={pStyle}>{data[0].description}</p>
    </div>
    <div className="flex gap-2">
      <Button mode="dark" type="primary">
        primary
      </Button>
      <Button mode="dark" type="secondary">
        secondary
      </Button>
      <Button mode="dark" type="disabled">
        disabled
      </Button>
    </div>
    <ErrorCard mode="dark" />
    <SuccessCard mode="dark" />
    <WarningCard mode="dark" />
  </div>
);

const LightMode = () => (
  <div className="h-full w-1/2 text-stone-700 bg-stone-200 p-md">
    <h1 className={`text-2xl font-bold capitalize ${lightModeHeader}`}>
      light mode
    </h1>
    <div className="flex flex-col gap-2 p-md bg-stone-50 border border-stone-300 rounded shadow-sm my-4 ">
      <h1 className="text-2xl font-bold capitalize">{data[0].header}</h1>
      <p className={pStyle}>{data[0].description}</p>
    </div>
    <div className="flex gap-2">
      <Button mode="light" type="primary">
        primary
      </Button>
      <Button mode="light" type="secondary">
        secondary
      </Button>
      <Button mode="light" type="disabled">
        disabled
      </Button>
    </div>
    <ErrorCard mode="light" />
    <SuccessCard mode="light" />
    <WarningCard mode="light" />
  </div>
);

const pStyle = "text-lg ltext-sm/6";
export default function Page() {
  return (
    <div className="h-screen w-screen flex">
      <DarkMode />
      <LightMode />
    </div>
  );
}
