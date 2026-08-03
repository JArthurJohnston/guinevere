import { useState } from "react";
import { InstrumentContext } from "../instrumentContext";
import { DEFAULT_INSTRUMENT_ID } from "../../whistle/instruments";

export function InstrumentProvider({ children }) {
  const [instrumentId, setInstrumentId] = useState(DEFAULT_INSTRUMENT_ID);

  return (
    <InstrumentContext.Provider value={{ instrumentId, setInstrumentId }}>
      {children}
    </InstrumentContext.Provider>
  );
}
