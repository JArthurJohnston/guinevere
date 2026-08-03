import { useRef } from "react";
import { useABC } from "../../context/abcContext";

export function UploadFileButton({ label, accept = "text/plain" }) {
  const fileInputRef = useRef(null);
  const { updateTune } = useABC();

  const handleFile = (e) => {
    loadFile(e.target.files?.[0]);
    e.target.value = ""; // allow re-selecting the same file
  };

  const loadFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateTune(String(reader.result));
    reader.readAsText(file);
  };

  return (
    <>
      <button
        className="button"
        type="button"
        onClick={() => fileInputRef.current?.click()}
      >
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
