// app/loading.tsx
export default function Loading() {
  // Puedes personalizar esta UI de carga como prefieras.
  // Aquí usamos un spinner SVG y un texto, similar a otros estados de carga del proyecto.
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-4">
      <svg
        aria-hidden="true"
        className="animate-spin h-12 w-12 text-sky-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="mt-4 text-lg font-medium text-slate-300">Cargando...</p>
    </div>
  );
}