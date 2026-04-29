import Sidebar from "./Sidebar";

export default function ProtectedLayout({
  children,
  heading,
}: {
  children: React.ReactNode;
  heading?: string;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-56 flex flex-col min-h-screen">
        {heading && (
          <header className="bg-white border-b border-gray-200 px-8 py-5">
            <h1 className="text-xl font-semibold text-gray-800">{heading}</h1>
          </header>
        )}
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
