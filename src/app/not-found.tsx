import { AlertTriangle } from "lucide-react";

export default function Custom404Page() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full">
      <AlertTriangle size={128} color="white" fill="red" />
      <span className="text-3xl text-slate-500">404 - Not found</span>
      <span className="text-lg">Page will be added soon!</span>
    </div>
  );
}
