"use client";

import { useState } from "react";

const predefinedLinks = [
  "sportapp://deeplink?test=1",
  "sportapp://b3nb2.app.goo.gl?test=1",
];

export default function Home() {
  const [url, setUrl] = useState(predefinedLinks[0]);
  const [jsOpenError, setJsOpenError] = useState<string | null>(null);

  const handleOpenWithJs = () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setJsOpenError("URL jest pusty.");
      return;
    }

    setJsOpenError(null);

    let appSwitchDetected = false;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        appSwitchDetected = true;
      }
    };

    const handleBlur = () => {
      appSwitchDetected = true;
    };

    const cleanupListeners = () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    const failureTimeoutId = window.setTimeout(() => {
      cleanupListeners();

      if (!appSwitchDetected) {
        setJsOpenError(
          "Nie udalo sie otworzyc deeplinka (brak handlera dla schematu albo blokada w przegladarce)."
        );
      }
    }, 1200);

    try {
      window.location.href = trimmedUrl;
    } catch {
      window.clearTimeout(failureTimeoutId);
      cleanupListeners();
      setJsOpenError("Nie udalo sie otworzyc deeplinka przez JS.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 p-6">
      <main className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-zinc-900">Deeplink Tester</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Wpisz URL lub wybierz gotowy deeplink poniżej.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setJsOpenError(null);
            }}
            placeholder="Wpisz URL, np. sportapp://deeplink?test=1"
            className="h-11 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 outline-none ring-0 transition focus:border-zinc-500"
          />
          <button
            type="button"
            onClick={handleOpenWithJs}
            className="h-11 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-700"
          >
            Otworz (JS)
          </button>
        </div>

        <div className="mt-4 text-sm">
          <a href={url} className="text-blue-600 underline underline-offset-2">
            Otworz przez tag A
          </a>
        </div>

        {jsOpenError && (
          <p className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {jsOpenError}
          </p>
        )}

        <div className="mt-8 border-t border-zinc-200 pt-4">
          <p className="mb-3 text-sm font-medium text-zinc-700">Predefiniowane linki:</p>
          <div className="flex flex-wrap gap-2">
            {predefinedLinks.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => {
                  setUrl(link);
                  setJsOpenError(null);
                }}
                className="rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-2 text-left text-xs text-zinc-800 transition hover:bg-zinc-100"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
