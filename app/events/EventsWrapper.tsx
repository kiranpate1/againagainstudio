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
    events[0] || null
  );

  return (
    <>
      <div className="absolute inset-[0_0_0_58px] md:inset-[0_0_80px_0] flex flex-col md:w-full md:flex-row justify-center items-center">
        <EventsBook events={events} onActiveEventChange={setActiveEvent} />
        <div className="w-full md:max-w-[400px] h-[200px] md:h-[400px] relative p-4 md:p-12">
          <Image
            className="absolute left-0 min-w-[120%] min-h-[120%] hidden md:block"
            src="/images/events-bg.png"
            alt="Events Background"
            fill
          />
          {activeEvent && (
            <div className="relative flex flex-col gap-4 md:gap-9">
              <div className="flex flex-col gap-0 md:gap-1">
                <p className="text-[14px] md:text-[18px] tracking-[-0.01em]">
                  {formatEventDate(activeEvent.date)}
                </p>
                <h1 className="text-[30px] md:text-[40px] tracking-[-0.04em]">
                  {activeEvent.eventName}
                </h1>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[14px] md:text-[18px] tracking-[-0.01em]">
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
          )}
        </div>
      </div>
      <Calendar events={events} />
    </>
  );
}
