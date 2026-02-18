"use client";

import { useState, useRef, useEffect } from "react";
import { submitContactForm } from "../actions/sendForm";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Contact() {
  const momentumRef = useRef<HTMLDivElement>(null);
  const swingingRef = useRef<HTMLImageElement>(null);

  // Drag state refs
  const startX = useRef(0);
  const startY = useRef(0);
  const isDragging = useRef(false);
  const currentRotation = useRef(0);
  const pendulumAnimationId = useRef<number | null>(null);
  const currentPendulumAngle = useRef(0);
  const swingingAnimationId = useRef<number | null>(null);

  const pathname = usePathname();
  const formRef = useRef<HTMLDivElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(pathname === "/contact");

  // Sync form state with pathname changes
  useEffect(() => {
    if (pathname === "/contact") {
      setIsFormOpen(true);
    } else {
      // Close form when navigating to any other page (including home)
      setIsFormOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!formRef.current) return;

    // Apply UI changes based on isFormOpen state
    if (formRef.current) {
      if (isFormOpen) {
        formRef.current.classList.remove("-translate-y-full");
      } else {
        formRef.current.classList.add("-translate-y-full");
      }
    }

    // function toggleForm() {
    //   const newFormState = !isFormOpen;
    //   setIsFormOpen(newFormState);

    //   // Navigate based on the new state
    //   if (newFormState) {
    //     router.push("/contact");
    //   } else {
    //     router.push("/");
    //   }
    // }

    // openFormRef.current?.addEventListener("click", toggleForm);
    // return () => {
    //   openFormRef.current?.removeEventListener("click", toggleForm);
    // };
  }, [isFormOpen]);

  // form stuff

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    setErrorMessage("");

    const result = await submitContactForm(formData);

    if (result.success) {
      setStatus("success");
      // Reset form after 2 seconds
      setTimeout(() => setStatus("idle"), 2000);
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Something went wrong");
    }
  }

  // Pendulum animation function
  const animatePendulum = (
    dragAmount: number = 0,
    dragDirection: number = 1,
    initialAngle: number = 0,
  ) => {
    // Get the actual current angle from the element if animation is running
    let actualCurrentAngle = initialAngle;
    if (momentumRef.current) {
      const transform = momentumRef.current.style.transform;
      const match = transform.match(/rotateZ\(([-\d.]+)deg\)/);
      if (match) {
        actualCurrentAngle = parseFloat(match[1]);
      }
    }

    // Cancel any existing pendulum animation
    if (pendulumAnimationId.current !== null) {
      cancelAnimationFrame(pendulumAnimationId.current);
      pendulumAnimationId.current = null;
    }

    // Scale maxAngle based on drag amount (0-360 maps to 0-15)
    const maxPossibleAngle = 8;
    const maxAngle = Math.min(
      maxPossibleAngle,
      (Math.abs(dragAmount) / 360) * maxPossibleAngle,
    );

    // Don't animate if drag was too small (unless it's initial load)
    if (maxAngle < 0.5 && dragAmount > 0) return;

    // Use full amplitude for initial load
    const effectiveMaxAngle = dragAmount === 0 ? maxPossibleAngle : maxAngle;

    const swingDuration = 1000; // Duration of one complete swing (milliseconds)
    const dampingFactor = 0.92; // How quickly the pendulum loses energy (closer to 1 = slower damping)
    const minAngle = 0.1; // Stop when swing is less than this

    // Calculate phase offset to start from actualCurrentAngle smoothly
    const frequency = (2 * Math.PI) / swingDuration;
    let phaseOffset = 0;

    if (Math.abs(actualCurrentAngle) > 0.01) {
      // Normalize the angle to the effective max angle
      const normalizedAngle =
        actualCurrentAngle / (effectiveMaxAngle * -dragDirection);
      const clampedNormalized = Math.max(-1, Math.min(1, normalizedAngle));

      // Use asin to get the phase, accounting for the current position
      // This ensures smooth continuation from the current angle
      phaseOffset = Math.asin(clampedNormalized);

      // Adjust for the correct quadrant if needed
      if (Math.abs(actualCurrentAngle) > effectiveMaxAngle * 0.5) {
        phaseOffset = Math.PI - phaseOffset;
      }
    }

    let startTime: number | null = null;
    let currentAmplitude = effectiveMaxAngle;

    function swing(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;

      // Apply damping over time
      currentAmplitude =
        effectiveMaxAngle * Math.pow(dampingFactor, elapsed / 100);

      // Stop if amplitude is too small
      if (currentAmplitude < minAngle) {
        if (momentumRef.current) {
          momentumRef.current.style.transform = "rotateZ(0deg)";
          currentPendulumAngle.current = 0;
        }
        pendulumAnimationId.current = null;
        return;
      }

      // Calculate pendulum position using sine wave
      // Invert the direction based on drag direction
      const angle =
        currentAmplitude *
        Math.sin(frequency * elapsed + phaseOffset) *
        -dragDirection;

      if (momentumRef.current) {
        momentumRef.current.style.transform = `rotateZ(${angle}deg)`;
        currentPendulumAngle.current = angle;
      }

      pendulumAnimationId.current = requestAnimationFrame(swing);
    }

    pendulumAnimationId.current = requestAnimationFrame(swing);
  };

  // Swinging animation function with custom ease
  const animateSwingingReturn = (fromRotation: number) => {
    // Cancel any existing swinging animation
    if (swingingAnimationId.current !== null) {
      cancelAnimationFrame(swingingAnimationId.current);
      swingingAnimationId.current = null;
    }

    const animDuration = 2500;
    let start: number | null = null;

    const ease = (t: number) => {
      if (t === 0 || t === 1) return t;
      const c4 = (2 * Math.PI) / 4.5;
      return Math.pow(2, -10 * t) * Math.sin((t * 12 - 0.75) * c4) + 1;
    };

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / animDuration, 1);
      const easedProgress = ease(progress);
      const currentValue = fromRotation + (0 - fromRotation) * easedProgress;

      if (swingingRef.current) {
        swingingRef.current.style.transform = `rotateZ(${currentValue}deg)`;
      }

      if (progress < 1) {
        swingingAnimationId.current = requestAnimationFrame(step);
      } else {
        swingingAnimationId.current = null;
      }
    }

    swingingAnimationId.current = requestAnimationFrame(step);
  };

  // Handle drag to create pendulum effect
  useEffect(() => {
    // Unified drag start logic
    const startDrag = (clientX: number, clientY: number) => {
      // Cancel any ongoing animations
      if (pendulumAnimationId.current !== null) {
        cancelAnimationFrame(pendulumAnimationId.current);
        pendulumAnimationId.current = null;
      }
      if (swingingAnimationId.current !== null) {
        cancelAnimationFrame(swingingAnimationId.current);
        swingingAnimationId.current = null;
      }

      startX.current = clientX;
      startY.current = clientY;
      isDragging.current = true;
      if (swingingRef.current) {
        swingingRef.current.style.cursor = "grabbing";
      }
    };

    // Unified drag move logic
    const moveDrag = (clientX: number) => {
      if (!isDragging.current || !swingingRef.current) return;

      const deltaX = clientX - startX.current;
      // Convert drag distance to rotation angle (inverted)
      const rotation = -(deltaX / 100) * 10; // Adjust sensitivity as needed

      swingingRef.current.style.transform = `rotateZ(${rotation}deg)`;
      currentRotation.current = rotation;
    };

    // Unified drag end logic
    const endDrag = () => {
      isDragging.current = false;
      if (swingingRef.current) {
        swingingRef.current.style.cursor = "grab";
      }

      // Animate swingingRef back to 0 using custom ease function
      animateSwingingReturn(currentRotation.current);

      // Trigger pendulum animation on momentumRef based on drag amount and direction
      const dragDirection = currentRotation.current >= 0 ? 1 : -1;
      animatePendulum(
        Math.abs(currentRotation.current) * 36, // Scale to match galleryBook's drag amount scale
        dragDirection,
        currentPendulumAngle.current,
      );

      // Reset current rotation
      currentRotation.current = 0;
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
      e.preventDefault();
      moveDrag(e.touches[0].clientX);
    };
    const handleTouchEnd = () => {
      endDrag();
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    };

    const swingingElement = swingingRef.current;

    swingingElement?.addEventListener("mousedown", handleMouseDown);
    swingingElement?.addEventListener("touchstart", handleTouchStart);

    return () => {
      swingingElement?.removeEventListener("mousedown", handleMouseDown);
      swingingElement?.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);

      // Cancel any ongoing animations
      if (pendulumAnimationId.current !== null) {
        cancelAnimationFrame(pendulumAnimationId.current);
      }
      if (swingingAnimationId.current !== null) {
        cancelAnimationFrame(swingingAnimationId.current);
      }
    };
  }, []);

  // Start pendulum animation on mount
  useEffect(() => {
    animatePendulum(120, 1, 0);
  }, []);

  return (
    <div className="fixed z-200 inset-0 w-screen h-screen pointer-events-none">
      <div
        className="absolute inset-[0_0_auto_0] w-full -translate-y-full ease-out duration-500"
        ref={formRef}
      >
        <div
          className="absolute z-1 bottom-0 right-48 w-32 aspect-157/709 translate-y-[93%] origin-[33%_6%] pointer-events-auto rotate-0"
          ref={momentumRef}
        >
          <Image
            className="absolute top-0 left-0 aspect-103/209 w-2/3"
            src="/images/chain-new.png"
            alt="Chain"
            width={103}
            height={209}
          />
          <Image
            className="absolute top-[25.8%] left-[3%] aspect-157/529 w-full origin-[29%_0%] cursor-grab"
            ref={swingingRef}
            src="/images/lanyard-new.png"
            alt="lanyard"
            width={157}
            height={529}
          />
        </div>
        <div className="relative w-full px-5 pt-15 pb-4 lg:px-15 lg:pb-15 bg-(--slip) text-(--charm) flex justify-center pointer-events-auto">
          <div className="w-full max-w-[700px] flex flex-col items-stretch gap-8">
            <div className="w-full max-w-[500px] flex flex-col gap-1">
              <p className="heading-small text-pretty">
                Host an event or inquire for private classes
              </p>
              <p className="paragraph text-pretty opacity-50">
                We believe everyone has skills to share, enriching the
                community. Whether it's your first or fifth time hosting, Again
                Again welcomes ideas for workshops, classes, or events.
              </p>
            </div>
            <form
              action={handleSubmit}
              className="w-full flex flex-col items-center gap-1.5"
            >
              <div className="flex flex-col w-full">
                <label htmlFor="name">{/* Name */}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="px-3 py-2 border border-(--green-light) rounded-xl text-(--green-light) focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-(--green-light) placeholder:opacity-100"
                  placeholder="Name"
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="email">{/* Email Address */}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="px-3 py-2 border border-(--green-light) rounded-xl text-(--green-light) focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-(--green-light) placeholder:opacity-100"
                  placeholder="Email address"
                />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="message">{/* Message */}</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="px-3 py-2 border border-(--green-light) rounded-xl text-(--green-light) focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-(--green-light) placeholder:opacity-100"
                  placeholder="Message"
                />
              </div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 px-6 py-1.5 bg-(--charm) text-(--slip) rounded-full hover:bg-(--charm) disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                {status === "submitting" ? "Submitting..." : "Submit form"}
              </button>

              {status === "success" && (
                <p className="text-sm text-green-600 font-medium text-center">
                  ✓ Message sent successfully!
                </p>
              )}

              {status === "error" && (
                <p className="text-sm text-red-600 font-medium text-center">
                  {errorMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
