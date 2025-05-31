export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-light border border-accent rounded-2xl shadow-xl p-8">
        {children}
      </div>
    </div>
  );
}
