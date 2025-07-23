import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

async function enableMSWclient() {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "warn" });
}

enableMSWclient().then(() => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  });
});
