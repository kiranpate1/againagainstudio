import { getNotionEvents } from "@/app/actions/getEvents";
import { shapes } from "@/app/shapes";

export default async function Info() {
  const events = await getNotionEvents();

  return (
    <div className="absolute inset-0 w-screen h-screen min-h-[800px] flex flex-col gap-18 md:gap-16.5 items-start justify-start px-4 lg:px-10 py-[72px] lg:py-[100px]">
      <div className="md:w-[80%] flex flex-col items-start gap-2">
        <h1 className="heading-large">
          Again Again is a creative studio in Toronto that curates social events
          centred on making, curiosity, and shared experience.
        </h1>
        <a
          href="/info"
          className="paragraph text-(--charm) cursor hover:opacity-70"
        >
          Learn more about the space
        </a>
      </div>
      <div className="flex-1 w-full flex flex-col gap-3 items-start justify-start">
        <p className="paragraph uppercase">Upcoming Events</p>
        <div className="flex-1 flex gap-1 h-full">
          {events.map((event: any, index: number) => (
            <div key={event.id} className="relative h-full aspect-square">
              <div className="relative h-full">{shapes[index].svg()}</div>
              <div className="absolute inset-0 flex flex-col">
                <h2 className="text-xl font-bold mb-2">{event.eventName}</h2>
                <p className="text-gray-600">{event.date}</p>
                <p className="mt-2">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
        <a
          href="https://luma.com/againagain"
          target="_blank"
          rel="noopener noreferrer"
          className="paragraph text-(--charm) cursor hover:opacity-70"
        >
          View all events
        </a>
      </div>
    </div>
  );
}
