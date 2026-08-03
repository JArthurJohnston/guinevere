import { ABCProvider } from "./ABCProvider";
import { InstrumentProvider } from "./InstrumentProvider";

export default function Providers({ children }) {
  return (
    <ABCProvider>
      <InstrumentProvider>{children}</InstrumentProvider>
    </ABCProvider>
  );
}
