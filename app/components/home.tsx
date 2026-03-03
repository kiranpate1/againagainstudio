"use client";

import { shapes } from "@/app/shapes";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, use } from "react";
import { getEvents } from "../actions/getEvents";

export default function Home() {
  const pathname = usePathname();
  const basePageRef = useRef<string>(pathname === "/contact" ? "/" : pathname);

  if (pathname !== "/contact" && pathname !== basePageRef.current) {
    basePageRef.current = pathname;
  }

  const isHome =
    pathname === "/" ||
    (pathname === "/contact" && basePageRef.current === "/");

  const [events, setEvents] = useState<any[]>([]);

  // useEffect(() => {
  //   getNotionEvents().then(setEvents);
  // }, []);

  useEffect(() => {
    // console.log("Fetching Luma events...");
    getEvents()
      .then((lumaEvents) => {
        // console.log("Luma events fetched:", lumaEvents);

        const now = new Date();
        const upcomingEvents = lumaEvents.filter(
          (event) => event.date && new Date(event.date) > now,
        );

        setEvents(upcomingEvents);
      })
      .catch((error) => {
        console.error("Error fetching Luma events:", error);
      });
  }, []);

  return (
    <div
      className="relative inset-0 w-screen h-dvh lg:h-screen min-h-[700px] lg:min-h-[800px] flex flex-col gap-10 md:gap-14 items-start justify-start px-4 pt-18 pb-12 lg:px-10 lg:pt-23 lg:pb-23"
      style={{ display: isHome ? "flex" : "none" }}
    >
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
        <div className="w-full flex items-center justify-between">
          <p className="paragraph uppercase">Upcoming Events</p>
          <a
            href="https://luma.com/againagain"
            target="_blank"
            rel="noopener noreferrer"
            className="paragraph text-(--charm) cursor hover:opacity-70"
          >
            View all
            <span className="paragraph lowercase inline-block translate-y-px -rotate-45">
              →
            </span>
          </a>
        </div>
        <div className="flex-1 flex gap-6 h-full w-[calc(100%+32px)] lg:w-[calc(100%+80px)] -mx-4 lg:-mx-10 px-4 lg:px-10 overflow-x-scroll">
          {events.map((event: any, index: number) => (
            <a
              key={event.id}
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative h-full aspect-square"
            >
              <div className="relative h-full">
                {shapes[index % shapes.length].svg(
                  <div className="relative w-full h-full">
                    <Image
                      src={event.image || "/placeholder.png"}
                      alt={event.eventName}
                      fill
                      className="object-cover contrast-100 group-hover:contrast-160 brightness-100 group-hover:brightness-80"
                    />
                  </div>,
                  `home-${event.id}`,
                )}
              </div>
              {/* <div className="absolute z-2 inset-[auto_0_0_0] px-6 py-6 flex flex-col items-start justify-end gap-3">
                <p className="caption">{formatEventDate(event.date)}</p>
                <div className="flex flex-col gap-1">
                  <h2 className="paragraph text-balance">{event.eventName}</h2>
                  <p className="hidden lg:block caption text-pretty text-[rgba(255,255,255,0.7)] max-h-9 overflow-hidden text-ellipsis">
                    {event.description}
                  </p>
                </div>
              </div> */}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
