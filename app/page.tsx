import { getNotionEvents } from "@/app/actions/getEvents";
import EventsWrapper from "./events/EventsWrapper";

export default async function Home() {
  const events = await getNotionEvents();

  return (
    <div className="">
      <EventsWrapper events={events} />
    </div>
  );
}
