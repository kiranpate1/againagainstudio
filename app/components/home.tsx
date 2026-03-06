"use client";

import { shapes } from "@/app/shapes";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, use } from "react";
import { getEvents } from "../actions/getEvents";
import { setRequestMeta } from "next/dist/server/request-meta";

export default function Home() {
  const pathname = usePathname();
  const basePageRef = useRef<string>(pathname === "/contact" ? "/" : pathname);
  const containerRef = useRef<HTMLDivElement>(null);

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
        console.log(
          "RAW Luma events direct from API (Browser Console):",
          lumaEvents,
        );

        const apiResponse = lumaEvents as any;
        const entries = apiResponse.entries ? apiResponse.entries : lumaEvents;

        const now = new Date();
        const upcomingEvents = entries
          .map((entry: any) => {
            // Check if we are dealing with formatted or unformatted data to keep page from crashing
            if (entry.event) {
              return {
                id: entry.api_id,
                eventName: entry.event.name,
                date: entry.event.start_at,
                description: entry.event.description || "",
                link: entry.event.url,
                image: entry.event.cover_url,
                visibility: entry.event.visibility,
              };
            }
            return entry;
          })
          .filter(
            (event: any) =>
              event.visibility !== "private" &&
              event.date &&
              new Date(event.date) > now,
          );

        setEvents(upcomingEvents);
      })
      .catch((error) => {
        console.error("Error fetching Luma events:", error);
      });
  }, []);

  const mainTitle =
    "Again Again is a creative studio in Toronto that curates social events centred on making, curiosity, and shared experience.";
  const titleSplit = mainTitle.split(" ");

  useEffect(() => {
    if (isHome && containerRef.current) {
      const elements = containerRef.current.querySelectorAll(
        "h1 span:not([data-animated]), p:not([data-animated]), a:not([data-animated]), img:not([data-animated])",
      );
      elements.forEach((el, index) => {
        const htmlEl = el as HTMLElement;
        htmlEl.setAttribute("data-animated", "true");
        htmlEl.style.animation = "none";
        // trigger reflow
        void htmlEl.offsetHeight;
        htmlEl.style.animation = `flashIn 50ms forwards ${index * 50 + 50}ms`;
      });
    }
  }, [isHome, events]);

  return (
    <div
      ref={containerRef}
      className="animate-ready relative inset-0 w-screen h-dvh lg:h-screen min-h-[700px] lg:min-h-[800px] flex flex-col gap-10 md:gap-14 items-start justify-start px-4 pt-18 pb-12 lg:px-10 lg:pt-23 lg:pb-23"
      style={{ display: isHome ? "flex" : "none" }}
    >
      <div className="md:w-[80%] max-w-[1200px] flex flex-col items-start gap-2.5">
        <h1 className="heading-large">
          {titleSplit.map((word, index) => (
            <span key={index} className="inline-block">
              {word}
              {index < titleSplit.length - 1 && <>&nbsp;</>}
            </span>
          ))}
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
              className="group relative h-full aspect-square rotate-0 hover:rotate-3"
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
