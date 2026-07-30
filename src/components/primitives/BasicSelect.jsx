export function BasicSelect({ value, onChange, label, children }) {
  return (
    <label className="basic-select">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
    </label>
  );
}