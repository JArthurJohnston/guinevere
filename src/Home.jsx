import { useCallback, useState } from "react";
import { extractNoteSequence } from "./abc/extractTune";

export function Home() {
//   const [instrumentId, setInstrumentId] = useState(DEFAULT_INSTRUMENT_ID);
  const [tune, setTune] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
//   const instrument = getInstrument(instrumentId);

//   const updateTune = (data) => setAbc(data);

  const handleRendered = useCallback((renderedTune) => {
    setTune(renderedTune);
    try {
      setTabData(extractNoteSequence(renderedTune));
    } catch (err) {
      setError(err.message || "Could not build a tab from this tune.");
      setTabData(null);
    }
  }, []);

  const handleNotationError = useCallback((message, warn) => {
    setError(message);
    if (message) {
      setTabData(null);
      setTune(null);
    }
    setWarnings(warn || []);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tin Whistle Tab</h1>
        <p>
          Paste or upload ABC notation to get a fingering chart for a whistle or
          simple-system flute.
        </p>
      </header>

      <div className="control-group">
        <InstrumentSelect value={instrumentId} onChange={setInstrumentId} />
        <TuneSelect value={abc} onChange={updateTune} />
        <UploadFileButton
          onFile={updateTune}
          label="Upload .abc file"
          accept=".abc,text/plain"
        />
      </div>

      <Section title="ABC Notation">
        <AbcInput value={abc} onChange={updateTune} />
      </Section>

      <Section title="Standard Notation">
        {tune && <SynthPlayer tune={tune} />}
        <Notation
          abc={abc}
          onRendered={handleRendered}
          onError={handleNotationError}
        />
      </Section>

      <Section title="Whistle Tab" right={tabData?.header?.title}>
        <WhistleTab tune={tabData} instrument={instrument} />
      </Section>

      <Section
        title="Fingering Chart"
        right={instrument.label}
        defaultOpen={false}
      >
        <FingeringChart instrument={instrument} />
      </Section>

      {error && <div className="banner error">{error}</div>}
      {!error && warnings.length > 0 && (
        <div className="banner warning">
          {warnings.length} parsing warning{warnings.length > 1 ? "s" : ""}:{" "}
          {warnings.join("; ")}
        </div>
      )}
    </div>
  );
}