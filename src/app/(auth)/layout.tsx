export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(91,154,245,0.22), transparent 32%), radial-gradient(circle at bottom right, rgba(224,64,160,0.16), transparent 32%), radial-gradient(circle at center, rgba(123,79,212,0.10), transparent 60%), linear-gradient(180deg, #F3EEFF 0%, #E8DFFF 100%)",
      }}
    >
      {children}
    </div>
  );
}
