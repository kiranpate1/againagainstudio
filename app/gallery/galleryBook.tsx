"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { shapes } from "../shapes";
import GalleryRing from "./galleryRing";

type props = {
  items: any[];
  onActiveItemChange?: (item: any) => void;
};

export default function GalleryBook({ items, onActiveItemChange }: props) {
  const [activeCard, setActiveCard] = useState(0);

  // Notify parent when active card changes
  useEffect(() => {
    if (onActiveItemChange && items[activeCard]) {
      onActiveItemChange(items[activeCard]);
    }
  }, [activeCard, items, onActiveItemChange]);
  const [isHalfway, setIsHalfway] = useState(false);
  const isHalfwayRef = useRef(false);
  const activeCardRef = useRef(0);
  const prevActiveCard = useRef(activeCard);
  const next = useRef<HTMLButtonElement>(null);
  const galleryCards = useRef<HTMLDivElement>(null);
  const duration = 3000; // in ms
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
  const activeCardAnimationId = useRef<number | null>(null); // Track active card animation
  const [cardWidth, setCardWidth] = useState(200);

  // Generic animation function that can be called from different triggers
  const animateCardRotation = (
    cardIndex: number,
    fromRotation: number,
    toRotation: number,
    animDuration: number,
    onComplete?: () => void,
  ) => {
    const allGalleries = galleryCards.current?.querySelectorAll(
      ":scope > div",
    ) as NodeListOf<HTMLElement>;

    if (!allGalleries || !allGalleries[cardIndex]) return;

    let start: number | null = null;
    let animationFrameId: number;
    const ease = (t: number) => {
      if (t === 0 || t === 1) return t;
      const c4 = (2 * Math.PI) / 4.5;
      // return (
      //   Math.pow(2, -13 * t) * Math.sin((Math.pow(t, 1.5) * 10 - 0.75) * c4) + 1
      // );
      return Math.pow(2, -18 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    };

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / animDuration, 1);
      const easedProgress = ease(progress);
      const currentValue =
        fromRotation + (toRotation - fromRotation) * easedProgress;

      allGalleries[cardIndex].style.transform = `rotateZ(${-currentValue}deg)`;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
        // Store if this is the active card
        if (cardIndex === activeCardRef.current) {
          activeCardAnimationId.current = animationFrameId;
        }
      } else {
        if (onComplete) onComplete();
        // Clear the animation ID when done
        if (cardIndex === activeCardRef.current) {
          activeCardAnimationId.current = null;
        }
      }
    }

    animationFrameId = requestAnimationFrame(step);
    // Store if this is the active card
    if (cardIndex === activeCardRef.current) {
      activeCardAnimationId.current = animationFrameId;
    }
  };

  //  Handle drag to rotate cards
  useEffect(() => {
    const cardHeight = (cardWidth * 3) / 2;
    const velocityThreshold = cardWidth / 1500 + 0.03; // degrees per millisecond
    const handleNext = () => {
      setActiveCard((prevActiveCard) => (prevActiveCard + 1) % items.length);
    };

    // Unified drag start logic
    const startDrag = (clientX: number, clientY: number) => {
      // Cancel any ongoing animation on the active card
      if (activeCardAnimationId.current !== null) {
        cancelAnimationFrame(activeCardAnimationId.current);
        activeCardAnimationId.current = null;
      }

      startX.current = clientX;
      startY.current = clientY;
      isDragging.current = true;
      hasTriggered.current = false;
      galleryCards.current?.style.setProperty("cursor", "grabbing");

      // Calculate sensitivity once based on initial drag position
      const allGalleries = galleryCards.current?.querySelectorAll(
        ":scope > div",
      ) as NodeListOf<HTMLElement>;
      if (allGalleries && allGalleries[activeCardRef.current]) {
        const cardRect =
          allGalleries[activeCardRef.current].getBoundingClientRect();
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

      const allGalleries = galleryCards.current?.querySelectorAll(
        ":scope > div",
      ) as NodeListOf<HTMLElement>;

      if (allGalleries && allGalleries[activeCardRef.current]) {
        const rotation = (deltaX / cardHeight) * dragSensitivity.current * 360;

        // Calculate velocity
        if (lastTimestamp.current > 0) {
          const timeDelta = now - lastTimestamp.current;
          const rotationDelta = rotation - lastRotation.current;
          rotationVelocity.current = rotationDelta / timeDelta;
        }

        lastRotation.current = rotation;
        lastTimestamp.current = now;

        allGalleries[activeCardRef.current].style.transform =
          `rotateZ(${-rotation}deg)`;
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
          duration / 2,
          () => {
            currentRotation.current = 0;
          },
        );
      }

      // Reset velocity tracking
      hasTriggered.current = false;
      lastRotation.current = 0;
      lastTimestamp.current = 0;
      rotationVelocity.current = 0;
      galleryCards.current?.style.setProperty("cursor", "grab");
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

    const nextButton = next.current;
    const cardsContainer = galleryCards.current;

    nextButton?.addEventListener("click", handleNext);
    cardsContainer?.addEventListener("mousedown", handleMouseDown);
    cardsContainer?.addEventListener("touchstart", handleTouchStart);

    return () => {
      nextButton?.removeEventListener("click", handleNext);
      cardsContainer?.removeEventListener("mousedown", handleMouseDown);
      cardsContainer?.removeEventListener("touchstart", handleTouchStart);
      // Clean up any lingering listeners
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [cardWidth, items.length]);

  // Handle active card change
  useEffect(() => {
    const countedUp =
      activeCard > prevActiveCard.current ||
      (activeCard === 0 && prevActiveCard.current === items.length - 1);
    prevActiveCard.current = activeCard;
    activeCardRef.current = activeCard;
    //add counted down here

    const allGalleries = galleryCards.current?.querySelectorAll(
      ":scope > div",
    ) as NodeListOf<HTMLElement>;

    const previousActive = countedUp
      ? (activeCard - 1 + items.length) % items.length
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

    allGalleries.forEach((gallery, index) => {
      const offset = (index - activeCard + items.length) % items.length;
      const zIndex = items.length - offset;
      gallery.style.zIndex = `${zIndex}`;

      // Add slight rotation for shuffle effect - cards behind rotate slightly
      const shuffleRotation = offset * -2; // 4 degrees per card position
      gallery.style.rotate = `${-shuffleRotation}deg`;
    });

    animateCardRotation(previousActive, from, to, duration, () => {
      currentRotation.current = 0;
      swipeDirection.current = null; // Reset swipe direction
    });
  }, [activeCard]);

  // Update z-indices and rotation staggering on halfway state change
  useEffect(() => {
    const allGalleries = galleryCards.current?.querySelectorAll(
      ":scope > div",
    ) as NodeListOf<HTMLElement>;

    if (!allGalleries) return;

    allGalleries.forEach((gallery, index) => {
      let offset, zIndex;

      if (isHalfway) {
        // Past halfway - next card should be on top
        const nextCard = (activeCardRef.current + 1) % items.length;
        offset = (index - nextCard + items.length) % items.length;
      } else {
        // Before halfway - current card should be on top
        offset = (index - activeCardRef.current + items.length) % items.length;
      }

      zIndex = items.length - offset;
      gallery.style.zIndex = `${zIndex}`;

      // Update slight rotation for shuffle effect
      const shuffleRotation = offset * -2;
      gallery.style.rotate = `${-shuffleRotation}deg`;
    });
  }, [isHalfway]);

  useEffect(() => {
    function handleCardSizing() {
      const windowWidth = window.innerWidth;

      if (windowWidth <= 333) {
        setCardWidth(200);
      } else if (windowWidth > 333 && windowWidth < 500) {
        setCardWidth(window.innerWidth * 0.6);
      } else if (windowWidth >= 500) {
        setCardWidth(300);
      }
    }
    window.addEventListener("resize", handleCardSizing);
    handleCardSizing();

    return () => {
      window.removeEventListener("resize", handleCardSizing);
    };
  }, []);

  return (
    <div className="relative w-full md:w-[300px] h-full md:h-[400px] flex items-center justify-center">
      <div className="absolute z-100 -bottom-[20%] -right-[20%] flex">
        <button ref={next}>{`>`}</button>
      </div>
      <div className="relative flex justify-center items-center">
        <div
          className="absolute flex justify-center items-start cursor-grab aspect-2/3 max-w-[22vh] lg:max-w-[30vh]"
          style={{ width: cardWidth }}
        >
          <div
            className="absolute left-1/2 origin-bottom-left"
            style={{
              minWidth: 20,
              top: "0%",
              transform: "translate(-50%,-57%)",
            }}
          >
            <GalleryRing />
          </div>
        </div>
        <div
          className="absolute flex justify-center items-start cursor-grab aspect-2/3 max-w-[22vh] lg:max-w-[30vh]"
          style={{ width: cardWidth }}
          ref={galleryCards}
        >
          {items.map((item, n) => {
            const shapeIndex = n % shapes.length;
            const shape = shapes[shapeIndex];

            return (
              <div
                key={n}
                className="absolute w-full"
                style={{
                  transformOrigin: "50% -0.75%",
                  transition: "rotate 0.3s ease",
                }}
              >
                <div
                  className="relative inset-0 w-full"
                  // style={{
                  //   transform: `rotateZ(${((n * 7) % 10) - 5}deg)`,
                  // }}
                >
                  <div
                    className="absolute z-99 top-0 left-1/2 aspect-[1.25/1] overflow-hidden"
                    style={{
                      width: 20,
                    }}
                  >
                    <div className="absolute bottom-0 right-0 min-w-[200%]">
                      <GalleryRing />
                    </div>
                  </div>

                  <svg
                    className="w-full absolute inset-0"
                    viewBox="0 0 463 698"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <clipPath id={`clip-${n}`}>
                        {shapeIndex === 0 && (
                          <path d="M463 55.6559L463 590.847L441.378 668.085L424.945 697.998L46.2716 698L22.0547 689.727L-1.79667e-07 645.352L2.61114e-05 36.3587L39.3253 25.7054L43.7772 8.74016L117.625 0.00168172L427.107 -1.58856e-06L463 55.6559Z" />
                        )}
                        {shapeIndex === 1 && (
                          <path d="M0 0.000208303L108.474 0.000156227C108.474 16.6176 120.32 23.7415 134.931 23.7415C149.543 23.7415 161.389 14.2449 161.389 0.000104152L416.7 0L463 40.3605V648.143L407.44 698H0V0.000208303Z" />
                        )}
                        {shapeIndex === 2 && (
                          <path d="M33.5326 0L423.367 3.67649L446.565 34.5723L463 43.1823V643.253L446.747 659.286L423.367 698L33.5326 696.29L13.3721 655.528L0 643.572L0 57.1232H13.8445L33.5326 0Z" />
                        )}
                        {shapeIndex === 3 && (
                          <path d="M0 61.7699L37.5674 0H397.446C419.74 36.3504 419.298 34.2977 462.941 62.3599L463 626.375L380.335 698L370.27 691.823L37.5674 698L2.92768e-05 636.375L0 61.7699Z" />
                        )}
                      </clipPath>
                    </defs>
                    {item.imageUrl && (
                      <image
                        href={item.imageUrl}
                        width="463"
                        height="698"
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={`url(#clip-${n})`}
                      />
                    )}
                  </svg>

                  {shape.svg()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
