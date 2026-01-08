// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        {/* Um spinner simples com Tailwind */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-gray-500">Carregando eventos...</p>
      </div>
    </div>
  );
}
