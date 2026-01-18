import { debugNotionDatabase, getNotionEvents } from "@/app/actions/getEvents";

export default async function TestNotionPage() {
  await debugNotionDatabase();
  const events = await getNotionEvents();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Notion Debug</h1>
      <p className="mb-4">Check your server console for property names</p>

      <h2 className="text-xl font-semibold mb-2">Events ({events.length}):</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(events, null, 2)}
      </pre>
    </div>
  );
}
