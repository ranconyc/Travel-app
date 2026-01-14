"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, X } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export const Button = ({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) => {
  const base =
    "px-4 py-4 rounded-lg font-medium transition-all active:scale-95 cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand/50 active:scale-95 disabled:bg-surface  disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brand text-white hover:opacity-90 shadow-sm",
    secondary: "bg-surface text-app-text hover:bg-brand/10",
    outline: "border-2 border-brand text-brand hover:bg-brand/10",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Buttons = () => {
  return (
    <div className="my-4 grid gap-4">
      <h1>Buttons</h1>
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  inputId?: string;
  className?: string;
}

const Input = ({
  label,
  error,
  inputId,
  className = "",
  ...props
}: InputProps) => {
  const base =
    "bg-surface text-app-text px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 cursor-pointer hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand/50 active:scale-95 disabled:bg-surface  disabled:cursor-not-allowed";

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm capitalize">
          {label}
        </label>
      )}
      <input className={`${base} ${className}`} {...props} />

      {error && <span className="text-xs text-red-500 px-1">{error}</span>}
    </div>
  );
};

//change name to SelectionCard
export const SelectionCard = ({
  id,
  label,
  description,
  icon: Icon,
  isSelected,
  onChange,
  type = "checkbox",
  ...props
}: {
  type?: "checkbox" | "radio";
  id: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ size: number }>;
  isSelected: boolean;
  onChange?: (id: string) => void;
}) => {
  return (
    <label
      key={id}
      className={`flex items-center gap-4 rounded-lg p-3 cursor-pointer border-2   ${
        isSelected ? "border-brand bg-brand/10" : "border-surface"
      } `}
    >
      <input
        type={type}
        className="sr-only"
        checked={isSelected}
        onChange={() => onChange?.(id)}
        {...props}
        aria-label={label}
        id={id}
      />
      {Icon ? (
        <div
          className={`p-2 rounded ${
            isSelected ? "bg-brand text-white" : "bg-surface"
          }`}
        >
          <Icon size={20} />
        </div>
      ) : (
        <div
          className={`w-5 h-5 rounded grid place-items-center border-2  ${
            isSelected ? "border-brand" : "border-surface"
          }`}
        >
          {isSelected && <div className="w-3 h-3 bg-brand" />}
        </div>
      )}
      <div>
        <h1>{label}</h1>
        {description && <p className="text-sm text-secondary">{description}</p>}
      </div>
    </label>
  );
};

interface CheckboxGroupProps {
  description?: string;
  selectedIds?: string[];
  options?: {
    id: string;
    label: string;
    description?: string;
    icon?: React.ComponentType<{ size: number }>;
  }[];
  onChange?: (id: string) => void;
}

export const CheckboxGroup = ({
  options,
  selectedIds,
  onChange,
  ...props
}: CheckboxGroupProps) => {
  return (
    <div className="grid gap-2 ">
      {options &&
        options.map(({ id, label, description, icon: Icon }) => {
          const isSelected = selectedIds?.includes(id);
          return (
            <label
              key={id}
              className={`flex items-center gap-4 rounded-lg p-3 cursor-pointer border-2   ${
                isSelected ? "border-brand bg-brand/10" : "border-surface"
              } `}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={isSelected}
                onChange={() => onChange?.(id)}
                {...props}
                aria-label={label}
                id={id}
              />
              {Icon ? (
                <div
                  className={`p-2 rounded ${
                    isSelected ? "bg-brand text-white" : "bg-surface"
                  }`}
                >
                  <Icon size={20} />
                </div>
              ) : (
                <div
                  className={`w-5 h-5 rounded grid place-items-center border-2  ${
                    isSelected ? "border-brand" : "border-surface"
                  }`}
                >
                  {isSelected && <div className="w-3 h-3 bg-brand" />}
                </div>
              )}
              <div>
                <h1>{label}</h1>
                {description && (
                  <p className="text-sm text-secondary">{description}</p>
                )}
              </div>
            </label>
          );
        })}
    </div>
  );
};

export const SelectedItem = ({
  item,
  onClick,
}: {
  item: string;
  onClick?: () => void;
}) => (
  <li
    key={item}
    className="flex items-center gap-2 border border-brand px-2 py-[6px] text-sm w-fit rounded bg-brand/10 cursor-pointer capitalize"
    onClick={onClick}
  >
    {item}
    <X size={16} className="text-brand" />
  </li>
);

const options = [
  { id: "1", label: "Option 1", description: "Description 1", icon: Sun },
  { id: "2", label: "Option 2", description: "Description 2", icon: Moon },
  { id: "3", label: "Option 3" },
];

const selectedInterests = ["Local Markets", "souvenir shopping", "Street Food"];

export default function Mode() {
  const [isDark, setIsDark] = useState(false);

  // Use useEffect to keep the HTML class in sync with the state
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleMode = () => {
    setIsDark((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit");
  };

  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 min-h-screen bg-app-bg text-app-text transition-colors duration-300">
      <Button onClick={toggleMode}>{isDark ? <Sun /> : <Moon />}</Button>
      <div className="p-4  rounded  bg-surface">
        <h1 className="font-sora font-bold text-2xl">Visual Mode</h1>
        <p className="font-inter mt-2">
          The background and text colors are now controlled by your CSS
          variables. The button also has a &quot;scale&quot; effect when
          clicked!
        </p>
      </div>
      <Buttons />
      <div className="my-4 grid gap-4">
        <h1 className="font-bold text-2xl capitalize">selected interests</h1>
        <ul className="flex gap-2 flex-wrap">
          {selectedInterests.map((item) => (
            <SelectedItem key={item} item={item} />
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="grid gap-2">
          <Input placeholder="Input" label="name" inputId="name" />
          <CheckboxGroup
            options={options}
            selectedIds={selected}
            onChange={handleToggle}
          />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
}
