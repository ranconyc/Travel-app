"use client";

interface ArrayFieldEditorProps {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}

export default function ArrayFieldEditor({
  label,
  items = [],
  onChange,
  placeholder = "Add item...",
}: ArrayFieldEditorProps) {
  const currentArray = Array.isArray(items) ? items : [];

  const handleUpdate = (idx: number, value: string) => {
    const newArray = [...currentArray];
    newArray[idx] = value;
    onChange(newArray);
  };

  const handleRemove = (idx: number) => {
    const newArray = currentArray.filter((_, i) => i !== idx);
    onChange(newArray);
  };

  const handleAdd = () => {
    onChange([...currentArray, ""]);
  };

  return (
    <div>
      <label className="block text-xs font-medium text-secondary mb-2 capitalize">
        {label}
      </label>
      <div className="space-y-2">
        {currentArray.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => handleUpdate(idx, e.target.value)}
              placeholder={placeholder}
              className="flex-1 p-2 bg-surface border border-surface-secondary rounded focus:border-brand outline-none transition-colors text-sm"
            />
            <button
              onClick={() => handleRemove(idx)}
              className="px-3 py-2 bg-error/10 text-error hover:bg-error/20 rounded transition-colors text-sm"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          onClick={handleAdd}
          className="w-full p-2 border-2 border-dashed border-surface-secondary hover:border-brand rounded transition-colors text-sm text-secondary hover:text-primary"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
}
