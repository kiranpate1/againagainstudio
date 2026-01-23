"use client";

import { useState } from "react";
import EventsBook from "./eventsBook";
import Calendar from "./calendar";
import { Event } from "../actions/getEvents";
import { formatEventDate } from "../utils/dateFormatter";
import Image from "next/image";

type Props = {
  events: Event[];
};

export default function EventsWrapper({ events }: Props) {
  const [activeEvent, setActiveEvent] = useState<Event | null>(
    events[0] || null,
  );

  return (
    <>
      <div className="absolute inset-[0_0_0_58px] md:inset-[0_0_80px_0] flex flex-col md:w-full md:flex-row justify-center items-center">
        <EventsBook events={events} onActiveEventChange={setActiveEvent} />
        <div className="w-full md:max-w-[500px] min-h-[250px] md:min-h-[500px] relative ">
          <Image
            className="absolute left-0 min-w-full min-h-full hidden md:block"
            src="/images/events-bg.png"
            alt="Events Background"
            fill
          />
          {activeEvent && (
            <div className="absolute flex flex-col lg:justify-between gap-2 inset-0 p-4 md:p-[48px_48px_64px_48px]">
              <div className="relative flex flex-col gap-4 md:gap-9">
                <div className="flex flex-col gap-0 md:gap-1">
                  <p className="paragraph">
                    {formatEventDate(activeEvent.date)}
                  </p>
                  <h1 className="text-[30px] md:text-[40px] tracking-[-0.04em]">
                    {activeEvent.eventName}
                  </h1>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="paragraph">
                    {activeEvent.description}
                    {activeEvent.hostName && (
                      <>
                        <br />
                        <br />
                        Hosted by {activeEvent.hostName}
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="relative flex lg:justify-end">
                {activeEvent.link ? (
                  <a
                    href={activeEvent.link}
                    target="_blank"
                    className="underline paragraph hover:opacity-70"
                  >
                    TICKETS →
                  </a>
                ) : (
                  <p className="paragraph opacity-60">Coming soon</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Calendar events={events} />
    </>
  );
}
