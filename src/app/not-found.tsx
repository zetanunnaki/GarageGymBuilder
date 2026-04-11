import Link from "next/link";
import { Dumbbell, MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-20 text-center">
      <Dumbbell className="mb-6 h-16 w-16 text-zinc-800" />
      <h1 className="mb-2 text-8xl font-black uppercase italic tracking-tighter text-orange-600">
        404
      </h1>
      <p className="mb-2 text-2xl font-black uppercase italic tracking-tighter">
        Page Not Found
      </p>
      <p className="mb-8 max-w-md text-zinc-500">
        Looks like this page skipped leg day. It doesn&apos;t exist — but the
        rest of the gym is still here.
      </p>
      <Link
        href="/"
        className="skew-x-[-12deg] bg-orange-600 px-8 py-4 font-black uppercase italic tracking-tighter text-white transition hover:bg-orange-500"
      >
        <span className="flex skew-x-[12deg] items-center gap-2">
          <MoveLeft size={18} />
          Back to Home
        </span>
      </Link>
    </div>
  );
}
