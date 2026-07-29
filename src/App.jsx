import { useCallback, useState } from "react";
import { AbcInput } from "./components/AbcInput";
import { Notation } from "./components/Notation";
import { WhistleTab } from "./components/WhistleTab";
import { FingeringChart } from "./components/FingeringChart";
import { InstrumentSelect } from "./components/InstrumentSelect";
import { SynthPlayer } from "./components/SynthPlayer";
import { Section } from "./components/Section";
import { extractNoteSequence } from "./abc/extractTune";
import { EXAMPLES } from "./abc/examples";
import { DEFAULT_INSTRUMENT_ID, getInstrument } from "./whistle/instruments";
import "./App.css";

function App() {
  const [abc, setAbc] = useState(EXAMPLES[0].abc);
  const [instrumentId, setInstrumentId] = useState(DEFAULT_INSTRUMENT_ID);
  const [tune, setTune] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const instrument = getInstrument(instrumentId);

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

      <InstrumentSelect value={instrumentId} onChange={setInstrumentId} />

      <Section title="ABC Notation">
        <AbcInput value={abc} onChange={setAbc} />
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

export default App;
