import { useABC } from "../../context/abcContext";
import { DragAndDrop } from "../primitives/DragAndDrop";

export function AbcInput() {
  const { abc, updateTune } = useABC();

  return (
    <div className="abc-input">
      <DragAndDrop onChange={updateTune} helperText="Drop .abc file to load">
        <textarea
          className="abc-textarea"
          value={abc}
          onChange={(e) => updateTune(e.target.value)}
          placeholder="Paste ABC notation here, upload a .abc file above, or drag one in..."
          spellCheck={false}
        />
      </DragAndDrop>
    </div>
  );
}
