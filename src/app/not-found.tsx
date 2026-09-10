import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <span className="font-sans text-8xl font-bold tabular-nums text-gold-500">404</span>
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-semibold">
          Esta página no existe
        </h1>
        <p className="text-muted-400 max-w-md">
          La propiedad o sección que buscas ya no está disponible, o la
          dirección tiene un error.
        </p>
      </div>
      <Link
        href="/propiedades"
        className="rounded-pill bg-gold-500 px-6 py-3 font-medium text-scrim transition-colors hover:bg-gold-400"
      >
        Ver propiedades disponibles
      </Link>
    </div>
  );
}
