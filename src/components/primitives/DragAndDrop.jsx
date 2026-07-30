import { useRef, useState } from "react";

export function DragAndDrop({ onChange, children, helperText = '' }) {
  const [isDragging, setIsDragging] = useState(false);
  const dragDepth = useRef(0);

    const loadFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsText(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (!e.dataTransfer.types.includes("Files")) return;
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div
      className={`abc-dropzone${isDragging ? " dragging" : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}
      {isDragging && (
        <div className="abc-dropzone-overlay">
          <span>{helperText}</span>
        </div>
      )}
    </div>
  );
}
