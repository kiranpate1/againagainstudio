"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import events from "./events/events";
import { shapes } from "./shapes";

export default function Home() {
  const [activeCard, setActiveCard] = useState(0);
  const [isHalfway, setIsHalfway] = useState(false);
  const isHalfwayRef = useRef(false);
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
  const dragSensitivity = useRef(1); // Store sensitivity for the current drag
  const swipeDirection = useRef<"right" | "left" | null>(null); // Track swipe direction
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

    // Unified drag start logic
    const startDrag = (clientX: number, clientY: number) => {
      startX.current = clientX;
      startY.current = clientY;
      isDragging.current = true;
      hasTriggered.current = false;
      eventCards.current?.style.setProperty("cursor", "grabbing");

      // Calculate sensitivity once based on initial drag position
      const allEvents = eventCards.current?.querySelectorAll(
        ":scope > div"
      ) as NodeListOf<HTMLElement>;
      if (allEvents && allEvents[activeCardRef.current]) {
        const cardRect =
          allEvents[activeCardRef.current].getBoundingClientRect();
        const relativeY = startY.current - cardRect.top;
        const normalizedY = Math.min(Math.max(relativeY / cardHeight, 0), 1);
        dragSensitivity.current = 1 - normalizedY * 0.9;
      }
    };

    // Unified drag move logic
    const moveDrag = (clientX: number) => {
      if (!isDragging.current) return;
      const deltaX = clientX - startX.current;
      const now = performance.now();

      const allEvents = eventCards.current?.querySelectorAll(
        ":scope > div"
      ) as NodeListOf<HTMLElement>;

      if (allEvents && allEvents[activeCardRef.current]) {
        const rotation = (deltaX / cardHeight) * dragSensitivity.current * 360;

        // Calculate velocity
        if (lastTimestamp.current > 0) {
          const timeDelta = now - lastTimestamp.current;
          const rotationDelta = rotation - lastRotation.current;
          rotationVelocity.current = rotationDelta / timeDelta;
        }

        lastRotation.current = rotation;
        lastTimestamp.current = now;

        allEvents[
          activeCardRef.current
        ].style.transform = `rotateZ(${-rotation}deg)`;
        currentRotation.current = rotation;

        // Update halfway state when crossing threshold
        const nowHalfway = Math.abs(rotation) >= 180;
        if (nowHalfway !== isHalfwayRef.current) {
          isHalfwayRef.current = nowHalfway;
          setIsHalfway(nowHalfway);
        }
      }
    };

    // Unified drag end logic
    const endDrag = () => {
      isDragging.current = false;

      // Detect swipe direction based on current rotation or velocity
      if (isHalfwayRef.current) {
        swipeDirection.current = currentRotation.current > 0 ? "right" : "left";
      } else if (Math.abs(rotationVelocity.current) > velocityThreshold) {
        swipeDirection.current =
          rotationVelocity.current > 0 ? "right" : "left";
      }

      // Check if past halfway point OR velocity threshold was reached
      if (!hasTriggered.current && isHalfwayRef.current) {
        handleNext();
        hasTriggered.current = true;
      } else if (
        !hasTriggered.current &&
        Math.abs(rotationVelocity.current) > velocityThreshold
      ) {
        handleNext();
        hasTriggered.current = true;
      } else if (!hasTriggered.current) {
        swipeDirection.current = null;
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
    };

    // Mouse event handlers
    const handleMouseMove = (e: MouseEvent) => moveDrag(e.clientX);
    const handleMouseUp = () => {
      endDrag();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    // Touch event handlers
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent pull-to-refresh and scrolling
      moveDrag(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
      endDrag();
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault(); // Prevent default touch behavior
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    };

    next.current?.addEventListener("click", handleNext);
    eventCards.current?.addEventListener("mousedown", handleMouseDown);
    eventCards.current?.addEventListener("touchstart", handleTouchStart);

    return () => {
      next.current?.removeEventListener("click", handleNext);
      eventCards.current?.removeEventListener("mousedown", handleMouseDown);
      eventCards.current?.removeEventListener("touchstart", handleTouchStart);
      // Clean up any lingering listeners
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
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
    // Determine rotation direction based on swipe direction
    let to;
    if (swipeDirection.current === "right") {
      to = 360; // Rotate clockwise
    } else if (swipeDirection.current === "left") {
      to = -360; // Rotate counter-clockwise
    } else {
      // Default behavior (e.g., button click)
      to = countedUp ? 360 : 0;
    }

    // Trigger z-index swap at halfway point of animation
    setTimeout(() => {
      allEvents.forEach((event, index) => {
        const offset = (index - activeCard + events.length) % events.length;
        const zIndex = events.length - offset;
        event.style.zIndex = `${zIndex}`;

        // Add slight rotation for shuffle effect - cards behind rotate slightly
        const shuffleRotation = offset * 4; // 4 degrees per card position
        event.style.rotate = `${-shuffleRotation}deg`;
      });
    }, duration / 8);

    animateCardRotation(previousActive, from, to, duration, () => {
      currentRotation.current = 0;
      swipeDirection.current = null; // Reset swipe direction
    });
  }, [activeCard]);

  // Update z-indices when rotation crosses halfway threshold
  useEffect(() => {
    console.log("test1");
    const allEvents = eventCards.current?.querySelectorAll(
      ":scope > div"
    ) as NodeListOf<HTMLElement>;

    if (!allEvents) return;

    allEvents.forEach((event, index) => {
      let offset, zIndex;

      if (isHalfway) {
        // Past halfway - next card should be on top
        const nextCard = (activeCardRef.current + 1) % events.length;
        offset = (index - nextCard + events.length) % events.length;
      } else {
        // Before halfway - current card should be on top
        offset =
          (index - activeCardRef.current + events.length) % events.length;
      }

      zIndex = events.length - offset;
      event.style.zIndex = `${zIndex}`;

      // Update slight rotation for shuffle effect
      const shuffleRotation = offset * 4;
      event.style.rotate = `${-shuffleRotation}deg`;
    });
  }, [isHalfway]);

  return (
    <main className="fixed w-screen max-w-dvw h-screen max-h-dvh flex flex-col gap-10 justify-center items-center overflow-hidden">
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
                transformOrigin: "50% -1%",
                transition: "rotate 0.3s ease",
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
