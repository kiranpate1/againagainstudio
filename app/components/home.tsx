import { getNotionEvents } from "@/app/actions/getEvents";
import { shapes } from "@/app/shapes";
import { formatEventDate } from "@/app/utils/dateFormatter";
import Image from "next/image";

export default async function Home() {
  const events = await getNotionEvents();

  return (
    <div className="relative inset-0 w-screen h-screen min-h-[700px] lg:min-h-[800px] flex flex-col gap-8 md:gap-14 items-start justify-start p-[72px_16px_108px_16px] lg:p-[92px_40px_92px_40px]">
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
      <div className="flex-1 w-full flex flex-col gap-3 items-stretch justify-start">
        <p className="paragraph uppercase">Upcoming Events</p>
        <div className="flex-1 flex gap-6 h-full overflow-x-scroll">
          {events.map((event: any, index: number) => (
            <a
              key={event.id}
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-full aspect-square"
            >
              <div className="relative h-full">
                {shapes[index].svg(
                  <div className="relative w-full h-full">
                    <Image
                      src={event.image || "/placeholder.png"}
                      alt={event.eventName}
                      fill
                      className="object-cover contrast-100 group-hover:contrast-120 brightness-100 group-hover:brightness-90"
                    />
                  </div>,
                )}
              </div>
              <div className="absolute inset-[auto_0_0_0] px-6 py-4 lg:py-6 flex flex-col items-start justify-end gap-3">
                <p className="caption">{formatEventDate(event.date)}</p>
                <div className="flex flex-col gap-1">
                  <h2 className="paragraph text-balance">{event.eventName}</h2>
                  <p className="caption text-pretty text-[rgba(255,255,255,0.7)]">
                    {event.description}
                  </p>
                </div>
              </div>
            </a>
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
