import { useCallback, useState } from "react";
import { AbcInput } from "./components/abc-inputs/AbcInput";
import { Notation } from "./components/Notation";
import { WhistleTab } from "./components/WhistleTab";
import { FingeringChart } from "./components/FingeringChart";
import { InstrumentSelect } from "./components/InstrumentSelect";
import { SynthPlayer } from "./components/SynthPlayer";
import { Section } from "./components/Section";
import { extractNoteSequence } from "./abc/extractTune";
import { TuneSelect } from "./components/TuneSelect";
import { UploadFileButton } from "./components/primitives/UploadFileButton";
import Providers from "./context/providers";
import "./App.css";

function App() {
  const [tune, setTune] = useState(null);
  const [tabData, setTabData] = useState(null);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);

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
    <Providers>
      <div className="app">
        <header className="app-header">
          <h1>Tin Whistle Tab</h1>
          <p>
            Paste or upload ABC notation to get a fingering chart for a whistle
            or simple-system flute.
          </p>
        </header>

        <div className="control-group">
          <InstrumentSelect />
          <TuneSelect />
          <UploadFileButton
            label="Upload .abc file"
            accept=".abc,text/plain"
          />
        </div>

        <Section title="ABC Notation">
          <AbcInput />
        </Section>

        <Section title="Standard Notation">
          {tune && <SynthPlayer tune={tune} />}
          <Notation
            onRendered={handleRendered}
            onError={handleNotationError}
          />
        </Section>

        <Section title="Whistle Tab" right={tabData?.header?.title}>
          <WhistleTab tune={tabData} />
        </Section>

        <Section
          title="Fingering Chart"
          // right={instrument.label}
          defaultOpen={false}
        >
          <FingeringChart />
        </Section>

        {error && <div className="banner error">{error}</div>}
        {!error && warnings.length > 0 && (
          <div className="banner warning">
            {warnings.length} parsing warning{warnings.length > 1 ? "s" : ""}:{" "}
            {warnings.join("; ")}
          </div>
        )}
      </div>
    </Providers>
  );
}

export default App;
