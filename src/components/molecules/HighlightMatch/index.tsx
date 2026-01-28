export default function highlightMatch(text: string, query: string) {
  if (!query) return text;

  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  const start = lower.indexOf(q);

  if (start === -1) return text;

  const end = start + q.length;

  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-blue-200 rounded px-0.5">
        {text.slice(start, end)}
      </mark>
      {text.slice(end)}
    </>
  );
}
