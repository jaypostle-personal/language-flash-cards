import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { CompletionScreen } from "@/screens/CompletionScreen";
import { DeckSelectionScreen } from "@/screens/DeckSelectionScreen";
import { NotFoundScreen } from "@/screens/NotFoundScreen";
import { QuizScreen } from "@/screens/QuizScreen";

export function AppRoutes() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.querySelector<HTMLElement>("main h1")?.focus();
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<DeckSelectionScreen />} />
      <Route path="/quiz" element={<QuizScreen />} />
      <Route path="/complete" element={<CompletionScreen />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}
