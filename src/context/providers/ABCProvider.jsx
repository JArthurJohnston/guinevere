import { useState } from "react";
import { EXAMPLES } from "../../abc/examples";
import { ABCContext } from "../abcContext";

export function ABCProvider({ children }) {
  const [abc, setAbc] = useState(EXAMPLES[0].abc);

  return (
    <ABCContext.Provider value={{ abc, setAbc }}>
      {children}
    </ABCContext.Provider>
  );
}
