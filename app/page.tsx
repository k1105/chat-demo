import Chat from "./components/Chat";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <Chat />
      </div>
    </main>
  );
}
