import { getNotionEvents } from "@/app/actions/getEvents";
import Navigation from "./components/navigation";
import EventsWrapper from "./events/EventsWrapper";

export default async function Home() {
  const events = await getNotionEvents();

  return (
    <main className="fixed w-screen max-w-dvw h-screen max-h-dvh overflow-hidden">
      <Navigation />
      <EventsWrapper events={events} />
    </main>
  );
}
