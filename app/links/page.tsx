import { getNotionEvents } from "@/app/actions/getEvents";
import Links from "./links";

export default async function Home() {
  const events = await getNotionEvents();

  return (
    <div className="">
      <Links events={events} />
      {/* <EventsWrapper events={events} /> */}
    </div>
  );
}
