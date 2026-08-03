import { createContext, useContext } from "react";
import { getInstrument } from "../whistle/instruments";

export const InstrumentContext = createContext();

export function useInstrument() {
  const { instrumentId, setInstrumentId } = useContext(InstrumentContext);

  const updateInstrument = (id) => setInstrumentId(id);
  const instrument = getInstrument(instrumentId);

  return {  updateInstrument, instrument };
}
