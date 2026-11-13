import { BrowserRouter } from "react-router-dom";

import UiPreview from "@/dev/UiPreview";
import { SessionProvider } from "@/providers/session-provider";
import { AppRoutes } from "@/routes/AppRoutes";

import "./App.css";

function App() {
  if (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).has("ui-preview")
  ) {
    return <UiPreview />;
  }

  return (
    <SessionProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
