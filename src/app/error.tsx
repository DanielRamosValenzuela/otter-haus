"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <h1 className="font-display text-3xl font-semibold">
        Algo salió mal
      </h1>
      <p className="text-muted-400 max-w-md">
        Ocurrió un error inesperado. Puedes intentar de nuevo.
      </p>
      <button
        onClick={reset}
        className="rounded-pill bg-gold-500 px-6 py-3 font-medium text-scrim transition-colors hover:bg-gold-400"
      >
        Reintentar
      </button>
    </div>
  );
}
