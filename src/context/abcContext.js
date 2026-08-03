import { createContext, useContext } from "react";

export const ABCContext = createContext();

export function useABC() {
  const { abc, setAbc } = useContext(ABCContext);
  const updateTune = (data) => setAbc(data);

  return { abc, updateTune };
}
