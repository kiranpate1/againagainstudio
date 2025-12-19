"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import events from "./events/events";
import { shapes } from "./shapes";

export default function Home() {
  const [activeCard, setActiveCard] = useState(0);
  const activeCardRef = useRef(0);
  const prevActiveCard = useRef(activeCard);
  const next = useRef<HTMLButtonElement>(null);
  const eventCards = useRef<HTMLDivElement>(null);
  const duration = 600; // in ms
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const hasTriggered = useRef(false);
  const currentRotation = useRef(0);
  const lastRotation = useRef(0);
  const lastTimestamp = useRef(0);
  const rotationVelocity = useRef(0);
  const cardHeight = 320; // h-80 = 320px
  const velocityThreshold = 0.2; // degrees per millisecond

  // Generic animation function that can be called from different triggers
  const animateCardRotation = (
    cardIndex: number,
    fromRotation: number,
    toRotation: number,
    animDuration: number,
    onComplete?: () => void
  ) => {
    const allEvents = eventCards.current?.querySelectorAll(
      ":scope > div"
    ) as NodeListOf<HTMLElement>;

    if (!allEvents || !allEvents[cardIndex]) return;

    let start: number | null = null;
    const ease = (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / animDuration, 1);
      const easedProgress = ease(progress);
      const currentValue =
        fromRotation + (toRotation - fromRotation) * easedProgress;

      allEvents[cardIndex].style.transform = `rotateZ(${-currentValue}deg)`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(step);
  };

  /*  Handle drag to rotate cards */
  useEffect(() => {
    const handleNext = () => {
      setActiveCard((prevActiveCard) => (prevActiveCard + 1) % events.length);
    };

    next.current?.addEventListener("click", handleNext);
    eventCards.current?.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startX.current = e.clientX;
      startY.current = e.clientY;
      isDragging.current = true;
      hasTriggered.current = false;
      eventCards.current?.style.setProperty("cursor", "grabbing");
    });
    eventCards.current?.addEventListener("mousemove", (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - startX.current;
      const now = performance.now();

      const allEvents = eventCards.current?.querySelectorAll(
        ":scope > div"
      ) as NodeListOf<HTMLElement>;

      if (allEvents && allEvents[activeCardRef.current]) {
        const cardRect =
          allEvents[activeCardRef.current].getBoundingClientRect();
        const relativeY = startY.current - cardRect.top; // Y position relative to card top
        const normalizedY = Math.min(Math.max(relativeY / cardHeight, 0), 1); // 0 at top, 1 at bottom
        const sensitivity = 1 - normalizedY * 0.8; // Top = 1.0, Bottom = 0.3

        // Rotation is more sensitive at top, less at bottom
        const rotation = (deltaX / cardHeight) * sensitivity * 360;

        // Calculate velocity
        if (lastTimestamp.current > 0) {
          const timeDelta = now - lastTimestamp.current;
          const rotationDelta = rotation - lastRotation.current;
          rotationVelocity.current = rotationDelta / timeDelta; // degrees per millisecond
        }

        lastRotation.current = rotation;
        lastTimestamp.current = now;

        allEvents[
          activeCardRef.current
        ].style.transform = `rotateZ(${-rotation}deg)`;
        currentRotation.current = rotation;
      }
    });
    document.addEventListener("mouseup", () => {
      isDragging.current = false;

      // Check if velocity threshold was reached
      if (
        !hasTriggered.current &&
        rotationVelocity.current > velocityThreshold
      ) {
        // Fast swipe right - trigger next card
        handleNext();
        hasTriggered.current = true;
      } else if (!hasTriggered.current) {
        // Not fast enough - animate back to 0
        animateCardRotation(
          activeCardRef.current,
          currentRotation.current,
          0,
          400,
          () => {
            currentRotation.current = 0;
          }
        );
      }

      // Reset velocity tracking
      hasTriggered.current = false;
      lastRotation.current = 0;
      lastTimestamp.current = 0;
      rotationVelocity.current = 0;
      eventCards.current?.style.setProperty("cursor", "grab");
    });

    return () => {
      next.current?.removeEventListener("click", handleNext);
      eventCards.current?.removeEventListener("mousedown", () => {});
      eventCards.current?.removeEventListener("mousemove", () => {});
      eventCards.current?.removeEventListener("mouseup", () => {});
    };
  }, []);

  useEffect(() => {
    const countedUp =
      activeCard > prevActiveCard.current ||
      (activeCard === 0 && prevActiveCard.current === events.length - 1);
    prevActiveCard.current = activeCard;
    activeCardRef.current = activeCard;

    const allEvents = eventCards.current?.querySelectorAll(
      ":scope > div"
    ) as NodeListOf<HTMLElement>;

    const previousActive = countedUp
      ? (activeCard - 1 + events.length) % events.length
      : activeCard;

    const from = currentRotation.current;
    const to = countedUp ? 360 : 0;

    // Update z-indices at halfway point
    let hasUpdatedZIndex = false;
    const checkZIndexUpdate = () => {
      if (!hasUpdatedZIndex) {
        hasUpdatedZIndex = true;
        setTimeout(() => {
          allEvents.forEach((event, index) => {
            const offset = (index - activeCard + events.length) % events.length;
            const zIndex = events.length - offset;
            event.style.zIndex = `${zIndex}`;
          });
        }, duration / 8);
      }
    };

    checkZIndexUpdate();

    animateCardRotation(previousActive, from, to, duration, () => {
      currentRotation.current = 0;
    });
  }, [activeCard]);

  return (
    <main className="relative min-w-screen min-h-screen flex flex-col gap-10 justify-center items-center">
      <div className="absolute top-12 left-12 flex">
        <button ref={next}>{`>`}</button>
      </div>
      <div className="relative flex justify-center items-center">
        <div
          className="absolute flex justify-center items-center cursor-grab"
          // style={{ transform: "rotateY(20deg)" }}
          ref={eventCards}
        >
          {events.map((event, n) => (
            <div
              key={event.name}
              className="absolute"
              style={{
                transformOrigin: "50% -5%",
              }}
            >
              {shapes.map((shape, i) =>
                i === n ? (
                  <div
                    key={shape.id}
                    className="relative inset-0 h-80 w-50"
                    // style={{
                    //   transform: `rotateZ(${((n * 7) % 10) - 5}deg)`,
                    // }}
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
