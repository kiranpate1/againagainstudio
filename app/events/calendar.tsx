"use client";

import { useRef, useEffect, useState } from "react";
import { shapes } from "../shapes";
import { eventColors } from "../utils/eventColors";

type props = {
  events: any[];
};

export default function Calendar({ events }: props) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 3);

    const tempDays: Date[] = [];
    const currentDate = new Date(today);

    while (currentDate <= endDate) {
      tempDays.push(new Date(currentDate));
      // Using native Date setDate handles month rollovers and leap years automatically
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDays(tempDays);
  }, []);

  // Helper function to parse event date and get a comparable date string
  const getDateString = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  // Helper function to parse event date safely
  const parseEventDate = (isoDate: string | null): Date | null => {
    if (!isoDate) return null;

    const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(isoDate);

    if (isDateOnly) {
      const [year, month, day] = isoDate.split("-").map(Number);
      return new Date(year, month - 1, day);
    } else {
      return new Date(isoDate);
    }
  };

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    const dayString = getDateString(day);
    return events.filter((event) => {
      const eventDate = parseEventDate(event.date);
      if (!eventDate) return false;
      return getDateString(eventDate) === dayString;
    });
  };

  // Get the index of the first event for a day (for color mapping)
  const getEventIndex = (event: any) => {
    return events.findIndex((e) => e.id === event.id);
  };

  return (
    <div className="absolute inset-[54px_auto_0_0] md:inset-[auto_0_0_0]">
      <svg
        className="absolute inset-[0px_24px_auto_24px]"
        viewBox="0 0 1462 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 6.00195H182.688L280 2.50195L292.5 6.00195H730.75L788.5 11.002L793 6.00195H1127.25L1448.5 0.501953L1461.5 6.00195"
          stroke="#461407"
          strokeOpacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div 
        className="relative h-full md:h-auto w-auto md:w-full overflow-y-scroll md:overflow-x-scroll"
        onWheel={(e) => {
          if (window.innerWidth >= 768) { // md breakpoint
        e.currentTarget.scrollLeft += e.deltaY;
        e.preventDefault();
          }
        }}
      >
        <div
          className="h-max md:w-max flex flex-col md:flex-row gap-2 items-center py-12 lg:py-4 md:px-4"
          ref={calendarRef}
        >
          {days.map((day, index) => {
            const showMonth =
              day.getDate() === 1 || (index === 0 && day.getDate() <= 27);
            const dayEvents = getEventsForDay(day);
            const hasEvents = dayEvents.length > 0;
            const firstEvent = dayEvents[0];
            const eventIndex = firstEvent ? getEventIndex(firstEvent) : 0;

            return (
              <div
                key={day.toISOString()}
                className="relative w-16 h-16 flex items-center justify-center text-(--copper)"
              >
                {showMonth && (
                  <div className="absolute w-full md:w-auto flex flex-col items-center bottom-full left-0 mb-1 px-1 text-xs font-semibold whitespace-nowrap bg-(--bisqueware)">
                    <span className="md:hidden text-center">
                      {day.toLocaleString("default", { month: "short" })}
                    </span>
                    <span className="hidden md:inline">
                      {day.toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {/* Event shape indicator */}
                {hasEvents && (
                  <div className="absolute z-1 inset-0 flex items-center justify-center pointer-events-none scale-50">
                    {shapes[eventIndex % shapes.length].svg(
                      eventColors[eventIndex % eventColors.length][0],
                    )}
                  </div>
                )}

                <div className="relative">
                  <p className="text-[20px]">{day.getDate()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
