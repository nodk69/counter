export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-4 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
      {children}
    </h3>
  );
}
