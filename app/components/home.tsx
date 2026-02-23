import { getNotionEvents } from "@/app/actions/getEvents";
import { shapes } from "@/app/shapes";
import { formatEventDate } from "@/app/utils/dateFormatter";
import Image from "next/image";

export default async function Home() {
  const events = await getNotionEvents();

  return (
    <div className="relative inset-0 w-screen h-dvh lg:h-screen min-h-[700px] lg:min-h-[800px] flex flex-col gap-10 md:gap-14 items-start justify-start px-4 pt-18 pb-12 lg:px-10 lg:pt-23 lg:pb-23">
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
      <div className="flex-1 w-[calc(100%+32px)] lg:w-full -translate-x-4 lg:translate-x-0 flex flex-col gap-3 items-stretch justify-start">
        <p className="paragraph uppercase pl-4 lg:pl-0">Upcoming Events</p>
        <div className="flex-1 flex gap-6 h-full px-4 lg:px-0 overflow-x-scroll">
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
              <div className="absolute z-2 inset-[auto_0_0_0] px-6 py-6 flex flex-col items-start justify-end gap-3">
                <p className="caption">{formatEventDate(event.date)}</p>
                <div className="flex flex-col gap-1">
                  <h2 className="paragraph text-balance">{event.eventName}</h2>
                  <p className="hidden lg:block caption text-pretty text-[rgba(255,255,255,0.7)]">
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
          className="paragraph text-(--charm) cursor hover:opacity-70 pl-4 lg:pl-0"
        >
          View all events
        </a>
      </div>
    </div>
  );
}
