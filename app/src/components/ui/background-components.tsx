import { cn } from "@/lib/utils";

interface BackgroundProps {
  className?: string;
}

/**
 * A subtle backdrop: a faint white grid with dots, washed with a soft yellow
 * glow. Renders as a positioned layer (absolute inset-0) so it can sit behind
 * any content — e.g. behind the envelope on the landing screen.
 */
export const Component = ({ className }: BackgroundProps) => {
  return (
    <div className={cn("absolute inset-0 z-0 bg-white", className)} aria-hidden="true">
      {/* White grid with dots — kept faint so the envelope stays the focus */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.4,
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px),
            radial-gradient(circle, rgba(51,65,85,0.28) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px, 20px 20px, 20px 20px",
          backgroundPosition: "0 0, 0 0, 0 0",
        }}
      />
    </div>
  );
};

export default Component;
