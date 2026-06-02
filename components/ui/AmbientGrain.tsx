import { cn } from "@/lib/utils";

export default function AmbientGrain({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 opacity-[0.04]",
        "bg-[url('data:image/svg+xml,%3Csvg viewBox%3D%220 0 256 256%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cfilter id%3D%22noise%22%3E%3CfeTurbulence type%3D%22fractalNoise%22 baseFrequency%3D%220.9%22 numOctaves%3D%224%22 stitchTiles%3D%22stitch%22/%3E%3C/filter%3E%3Crect width%3D%22100%25%22 height%3D%22100%25%22 filter%3D%22url(%23noise)%22/%3E%3C/svg%3E')]",
        className
      )}
    />
  );
}
