import React from "react";
import Typography from "../Typography";

type ErrorMessageProps = {
  id: string;
  error?: string;
};

export default function ErrorMessage({ id, error }: ErrorMessageProps) {
  if (!error) return <div className="h-5" aria-hidden="true" />;

  return (
    <Typography
      as="span"
      variant="tiny"
      color="error"
      className="block mt-1"
      // @ts-ignore - id is passed to component but Typescript might complain about Typography props
      id={id}
      role="alert"
    >
      {error}
    </Typography>
  );
}
