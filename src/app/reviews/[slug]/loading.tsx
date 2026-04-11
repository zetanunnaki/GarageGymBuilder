export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse px-6 pt-32 pb-20">
      <div className="mb-6 h-3 w-24 bg-zinc-800" />
      <div className="mb-4 h-12 w-3/4 bg-zinc-800" />
      <div className="mb-4 h-12 w-1/2 bg-zinc-800" />
      <div className="mb-8 h-4 w-full bg-zinc-800/50" />
      <div className="mb-4 flex items-center gap-4">
        <div className="h-3 w-20 bg-zinc-800/50" />
        <div className="h-3 w-24 bg-zinc-800/50" />
        <div className="h-3 w-16 bg-zinc-800/50" />
      </div>
      <div className="mt-12 space-y-4">
        <div className="h-4 w-full bg-zinc-800/30" />
        <div className="h-4 w-5/6 bg-zinc-800/30" />
        <div className="h-4 w-4/5 bg-zinc-800/30" />
        <div className="h-4 w-full bg-zinc-800/30" />
        <div className="h-4 w-3/4 bg-zinc-800/30" />
      </div>
      <div className="mt-12 h-64 w-full bg-zinc-800/20" />
      <div className="mt-8 space-y-4">
        <div className="h-4 w-full bg-zinc-800/30" />
        <div className="h-4 w-5/6 bg-zinc-800/30" />
        <div className="h-4 w-full bg-zinc-800/30" />
      </div>
    </div>
  );
}
