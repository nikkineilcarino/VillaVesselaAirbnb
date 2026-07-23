export default function AdminLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="grid min-h-screen place-items-center px-6"
      id="main-content"
    >
      <p className="text-sm font-medium text-foreground/70">Checking administrator access&hellip;</p>
    </main>
  );
}
