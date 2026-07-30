import { useRef } from "react";

export function UploadFileButton({ onFile, label, accept = "text/plain" }) {
  const fileInputRef = useRef(null);

  const handleFile = (e) => {
    loadFile(e.target.files?.[0]);
    e.target.value = ""; // allow re-selecting the same file
  };

  const loadFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onFile(String(reader.result));
    reader.readAsText(file);
  };

  return (
    <>
      <button className="button" type="button" onClick={() => fileInputRef.current?.click()}>
        {label}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        hidden
      />
    </>
  );
}
