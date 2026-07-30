import { DragAndDrop } from "../primitives/DragAndDrop";

export function AbcInput({ value, onChange }) {
  return (
    <div className="abc-input">
      <DragAndDrop onChange={onChange} helperText="Drop .abc file to load">
        <textarea
          className="abc-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste ABC notation here, upload a .abc file above, or drag one in..."
          spellCheck={false}
        />
      </DragAndDrop>
    </div>
  );
}
