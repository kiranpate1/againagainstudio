"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import events from "./events/events";
import { shapes } from "./shapes";

export default function Home() {
  const [activeCard, setActiveCard] = useState(0);
  const prevActiveCard = useRef(activeCard);
  const prev = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const eventCards = useRef<HTMLDivElement>(null);
  const duration = 600; // in ms

  useEffect(() => {
    const handleNext = () => {
      setActiveCard((prevActiveCard) => (prevActiveCard + 1) % events.length);
    };

    const handlePrev = () => {
      setActiveCard(
        (prevActiveCard) => (prevActiveCard - 1 + events.length) % events.length
      );
    };

    next.current?.addEventListener("click", handleNext);
    prev.current?.addEventListener("click", handlePrev);

    return () => {
      next.current?.removeEventListener("click", handleNext);
      prev.current?.removeEventListener("click", handlePrev);
    };
  }, []);

  useEffect(() => {
    const countedUp =
      activeCard > prevActiveCard.current ||
      (activeCard === 0 && prevActiveCard.current === events.length - 1);
    prevActiveCard.current = activeCard;
    console.log("countedUp:", countedUp);

    const allEvents = eventCards.current?.querySelectorAll(
      ":scope > div"
    ) as NodeListOf<HTMLElement>;

    const animation = () => {
      let start: number | null = null;
      const from = countedUp ? 0 : 360;
      const to = countedUp ? 360 : 0;
      const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); // easeInOutQuad

      function step(timestamp: number) {
        if (start === null) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = ease(progress);
        const currentValue = from + (to - from) * easedProgress;
        const previousActive = countedUp
          ? (activeCard - 1 + events.length) % events.length
          : activeCard;

        // animate
        allEvents[
          previousActive
        ].style.transform = `rotateX(${currentValue}deg)`;
        setTimeout(() => {}, duration);

        if (progress >= 0.1) {
          allEvents.forEach((event, index) => {
            // Calculate position relative to activeCard in circular array
            const offset = (index - activeCard + events.length) % events.length;
            // Active card gets highest zIndex (length), then count down
            const zIndex = events.length - offset;
            event.style.zIndex = `${zIndex}`;
          });
        }
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    };

    animation();
    // console.log(activeCard);
  }, [activeCard]);

  return (
    <main className="relative min-w-screen min-h-screen flex flex-col gap-10 justify-center items-center">
      <div className="absolute top-12 left-12 flex">
        <button ref={prev}>{`<`}</button>
        <button ref={next}>{`>`}</button>
      </div>
      <div className="relative flex justify-center items-center transform-3d perspective-[20000px]">
        <div
          className="absolute flex justify-center items-center transform-3d perspective-[20000px]"
          style={{ transform: "rotateY(20deg)" }}
          ref={eventCards}
        >
          {events.map((event, n) => (
            <div
              key={event.name}
              className="absolute transform-3d perspective-[20000px]"
              style={{
                transformOrigin: "50% -2.5%",
              }}
            >
              {shapes.map((shape, i) =>
                i === n ? (
                  <div
                    key={shape.id}
                    className="relative inset-0 h-80 w-50"
                    style={{
                      transform: `rotateZ(${((n * 7) % 10) - 5}deg)`,
                    }}
                  >
                    {shape.svg}
                  </div>
                ) : null
              )}
              {/* <Image
              src={event.cover}
              alt={event.name}
              width={200}
              height={120}
              // layout="fill"
              objectFit="cover"
              className=""
            />
            <div className=" bg-black bg-opacity-50 flex flex-col justify-end p-4">
              <h2 className="text-white text-xl font-bold">{event.name}</h2>
              <p className="text-white text-sm">{event.description}</p>
              <p className="text-white text-xs mt-1">{event.date}</p>
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block bg-blue-500 text-white px-3 py-1 rounded"
              >
                Learn More
              </a>
            </div> */}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
