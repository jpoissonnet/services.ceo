import * as React from "react";

import { cn } from "@/lib/utils";

const Drawer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { open: boolean; onClose: () => void }
>(({ className, open, onClose, children, ...props }, ref) => {
  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      {/*eslint-disable-next-line jsx-a11y/no-static-element-interactions*/}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }} // Close on Escape key
      />
      <div
        ref={ref}
        className={cn(
          "animate-in slide-in-from-right-20 relative ml-auto h-full w-full max-w-4/5 bg-white shadow-xl transition-all",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
});
Drawer.displayName = "Drawer";

export { Drawer };
