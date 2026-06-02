export default function CallbackLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-f2m-cream to-slate-50">
      <main className="mx-auto max-w-lg px-4 py-16">{children}</main>
    </div>
  );
}
