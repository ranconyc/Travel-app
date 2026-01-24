type ErrorMessageProps = {
  id: string;
  error?: string;
};

export default function ErrorMessage({ id, error }: ErrorMessageProps) {
  if (!error) return <div className="h-5" aria-hidden="true" />;

  return (
    <span
      id={id}
      role="alert"
      className="block text-xs font-medium text-red-500 mt-1"
    >
      {error}
    </span>
  );
}
