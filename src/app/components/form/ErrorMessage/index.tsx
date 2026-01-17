type ErrorMessageProps = {
  id: string;
  error?: string;
};

export default function ErrorMessage({ id, error }: ErrorMessageProps) {
  return error ? (
    <span id={id} role="alert" className="block text-sm text-red-600">
      {error}
    </span>
  ) : (
    <div className="block h-5" />
  );
}
