"use client";

import { useState, useRef, useEffect } from "react";
import { submitContactForm } from "../actions/sendForm";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Contact() {
  // Drag state refs
  const momentumRef = useRef<HTMLDivElement>(null);
  const swingingRef = useRef<HTMLImageElement>(null);
  const swingExtra1Ref = useRef<HTMLDivElement | null>(null);
  const swingExtra2Ref = useRef<HTMLDivElement | null>(null);
  const swingExtra3Ref = useRef<HTMLDivElement | null>(null);

  const startX = useRef(0);
  const startY = useRef(0);
  const lastDeltaY = useRef(0);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const isTouchDevice = useRef(false);
  const currentRotation = useRef(0);
  const pendulumAnimationId = useRef<number | null>(null);
  const currentPendulumAngle = useRef(0);
  const swingingAnimationId = useRef<number | null>(null);
  const swingExtra1AnimationId = useRef<number | null>(null);
  const swingExtra2AnimationId = useRef<number | null>(null);
  const swingExtra3AnimationId = useRef<number | null>(null);
  const toggleFormRef = useRef<(() => void) | null>(null);
  const dragThreshold = 50;

  // Form state
  const router = useRouter();
  const pathname = usePathname();
  const contactRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const closeContactRef = useRef<HTMLAnchorElement>(null);
  const [isFormOpen, setIsFormOpen] = useState(pathname === "/contact");
  const isFormOpenRef = useRef(pathname === "/contact");
  const [previousPagePath, setPreviousPagePath] = useState<string>("/");

  // Track the previous pathname before opening contact
  useEffect(() => {
    if (pathname === "/contact") {
      // Don't update previousPagePath when already on contact
    } else {
      // Store current path as the previous path for when contact opens
      setPreviousPagePath(pathname);
    }
  }, [pathname]);

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
    // Apply UI changes based on isFormOpen state
    if (contactRef.current && formRef.current) {
      if (isFormOpen) {
        contactRef.current.classList.add("bg-[rgba(0,0,0,0.5)]");
        formRef.current.style.transform = "translateY(0)";
        contactRef.current.style.pointerEvents = "all";
      } else {
        contactRef.current.classList.remove("bg-[rgba(0,0,0,0.5)]");
        formRef.current.style.transform = "translateY(-100%)";
        contactRef.current.style.pointerEvents = "none";
      }
    }

    if (closeContactRef.current) {
      closeContactRef.current.addEventListener("click", (e) => {
        e.preventDefault();
        setIsFormOpen(false);
        router.push(previousPagePath);
      });
    }

    isFormOpenRef.current = isFormOpen;

    toggleFormRef.current = () => {
      const newFormState = !isFormOpen;
      setIsFormOpen(newFormState);
      if (newFormState) {
        router.push("/contact");
      } else {
        router.push(previousPagePath);
      }
    };
  }, [isFormOpen, router, previousPagePath]);

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
    const maxPossibleAngle = 12;
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

  // Subtle swinging animation for extra hinge points
  const animateExtraSwing = (
    ref: React.RefObject<HTMLDivElement | null>,
    animationIdRef: React.MutableRefObject<number | null>,
    fromRotation: number,
    damping: number,
    delayMs: number,
  ) => {
    // Cancel any existing animation
    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    const animDuration = 3000;
    let start: number | null = null;

    const ease = (t: number) => {
      if (t === 0 || t === 1) return t;
      const c4 = (2 * Math.PI) / 5;
      return Math.pow(2, -8 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    };

    function step(timestamp: number) {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start - delayMs;

      // Wait for delay to pass
      if (elapsed < 0) {
        animationIdRef.current = requestAnimationFrame(step);
        return;
      }

      const progress = Math.min(elapsed / animDuration, 1);
      const easedProgress = ease(progress);
      const currentValue = fromRotation * damping * (1 - easedProgress);

      if (ref.current) {
        ref.current.style.transform = `rotateZ(${currentValue}deg)`;
      }

      if (progress < 1) {
        animationIdRef.current = requestAnimationFrame(step);
      } else {
        animationIdRef.current = null;
        if (ref.current) {
          ref.current.style.transform = "rotateZ(0deg)";
        }
      }
    }

    animationIdRef.current = requestAnimationFrame(step);
  };

  // Handle drag to create pendulum effect
  useEffect(() => {
    // Unified drag start logic
    const startDrag = (
      clientX: number,
      clientY: number,
      isTouch: boolean = false,
    ) => {
      // Cancel any ongoing animations
      if (pendulumAnimationId.current !== null) {
        cancelAnimationFrame(pendulumAnimationId.current);
        pendulumAnimationId.current = null;
      }
      if (swingingAnimationId.current !== null) {
        cancelAnimationFrame(swingingAnimationId.current);
        swingingAnimationId.current = null;
      }
      if (swingExtra1AnimationId.current !== null) {
        cancelAnimationFrame(swingExtra1AnimationId.current);
        swingExtra1AnimationId.current = null;
      }
      if (swingExtra2AnimationId.current !== null) {
        cancelAnimationFrame(swingExtra2AnimationId.current);
        swingExtra2AnimationId.current = null;
      }
      if (swingExtra3AnimationId.current !== null) {
        cancelAnimationFrame(swingExtra3AnimationId.current);
        swingExtra3AnimationId.current = null;
      }

      startX.current = clientX;
      startY.current = clientY;
      lastDeltaY.current = 0;
      isDragging.current = true;
      hasDragged.current = false;
      isTouchDevice.current = isTouch;
      if (swingingRef.current) {
        swingingRef.current.style.cursor = "grabbing";
      }
      // Pin the form in place with an inline transform so we can animate it during drag
      if (!isFormOpenRef.current && formRef.current) {
        formRef.current.style.transform = "translateY(-100%)";
      }
      if (isFormOpenRef.current && formRef.current) {
        formRef.current.style.transform = "translateY(0)";
      }
    };

    // Unified drag move logic
    const moveDrag = (clientX: number, clientY: number) => {
      if (!isDragging.current || !swingingRef.current) return;

      const deltaX = clientX - startX.current;
      const deltaY = clientY - startY.current;
      lastDeltaY.current = deltaY;

      // Track if significant movement occurred (threshold: 5 pixels)
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasDragged.current = true;
      }

      // Convert drag distance to rotation angle (inverted)
      const rotation = -(deltaX / 100) * 10; // Adjust sensitivity as needed

      swingingRef.current.style.transform = `rotateZ(${rotation}deg)`;
      currentRotation.current = rotation;

      // Form follows downward drag when closed
      if (!isFormOpenRef.current && formRef.current) {
        const clampedDelta = Math.max(0, deltaY);
        formRef.current.style.transform = `translateY(calc(-100% + ${clampedDelta}px))`;
      }

      // Form follows upward drag when open
      if (isFormOpenRef.current && formRef.current) {
        const clampedDelta = Math.min(0, deltaY);
        formRef.current.style.transform = `translateY(${clampedDelta}px)`;
      }
    };

    // Unified drag end logic
    const endDrag = () => {
      isDragging.current = false;
      if (swingingRef.current) {
        swingingRef.current.style.cursor = "grab";
      }

      const draggedDown = lastDeltaY.current;
      lastDeltaY.current = 0;

      // Handle tap/click on mobile to toggle form
      if (isTouchDevice.current && !hasDragged.current) {
        currentRotation.current = 0;

        if (!isFormOpenRef.current) {
          // Open form: Animate form to fully open
          if (formRef.current) {
            formRef.current.style.transition = "transform 0.4s ease-out";
            formRef.current.style.transform = "translateY(0)";
            formRef.current.addEventListener(
              "transitionend",
              () => {
                if (formRef.current) {
                  formRef.current.style.transition = "";
                }
              },
              { once: true },
            );
          }
        } else {
          // Close form: Animate form to fully closed
          if (formRef.current) {
            formRef.current.style.transition = "transform 0.4s ease-out";
            formRef.current.style.transform = "translateY(-100%)";
            formRef.current.addEventListener(
              "transitionend",
              () => {
                if (formRef.current) {
                  formRef.current.style.transition = "";
                }
              },
              { once: true },
            );
          }
        }

        toggleFormRef.current?.();
        return;
      }

      // Animate swingingRef back to 0 using custom ease function
      animateSwingingReturn(currentRotation.current);

      // Animate extra swing elements with subtle, delayed swings
      animateExtraSwing(
        swingExtra1Ref,
        swingExtra1AnimationId,
        currentRotation.current,
        0.7,
        50,
      );
      animateExtraSwing(
        swingExtra2Ref,
        swingExtra2AnimationId,
        currentRotation.current,
        0.55,
        100,
      );
      animateExtraSwing(
        swingExtra3Ref,
        swingExtra3AnimationId,
        currentRotation.current,
        0.4,
        150,
      );

      // If dragged up enough while open, close the form
      if (isFormOpenRef.current && draggedDown < -dragThreshold) {
        currentRotation.current = 0;
        if (formRef.current) {
          formRef.current.style.transition = "transform 0.4s ease-out";
          formRef.current.style.transform = "translateY(-100%)";
          formRef.current.addEventListener(
            "transitionend",
            () => {
              if (formRef.current) {
                formRef.current.style.transition = "";
              }
            },
            { once: true },
          );
        }
        toggleFormRef.current?.();
        return;
      }

      // Snap form back to open if upward drag didn't reach threshold
      if (isFormOpenRef.current && formRef.current) {
        if (draggedDown < 0) {
          formRef.current.style.transition = "transform 0.4s ease-out";
          formRef.current.style.transform = "translateY(0)";
          formRef.current.addEventListener(
            "transitionend",
            () => {
              if (formRef.current) {
                formRef.current.style.transition = "";
              }
            },
            { once: true },
          );
        } else {
          formRef.current.style.transition = "";
          formRef.current.style.transform = "translateY(0)";
        }
      }

      // If dragged down enough, treat as drawer handle pull
      if (!isFormOpenRef.current && draggedDown > dragThreshold) {
        currentRotation.current = 0;
        // Animate form to fully open, then hand off to state
        if (formRef.current) {
          formRef.current.style.transition = "transform 0.4s ease-out";
          formRef.current.style.transform = "translateY(0)";
          formRef.current.addEventListener(
            "transitionend",
            () => {
              if (formRef.current) {
                formRef.current.style.transition = "";
                // Leave transform at translateY(0); state effect owns it now
              }
            },
            { once: true },
          );
        }
        toggleFormRef.current?.();
        return;
      }

      // Snap form back to closed if it was being pulled
      if (!isFormOpenRef.current && formRef.current) {
        if (draggedDown > 0) {
          // Animate back to closed from a partial open position
          formRef.current.style.transition = "transform 0.4s ease-out";
          formRef.current.style.transform = "translateY(-100%)";
          formRef.current.addEventListener(
            "transitionend",
            () => {
              if (formRef.current) {
                formRef.current.style.transition = "";
                // Leave transform at translateY(-100%); imperative state owns it
              }
            },
            { once: true },
          );
        } else {
          // No downward movement — restore explicit closed position immediately
          formRef.current.style.transition = "";
          formRef.current.style.transform = "translateY(-100%)";
        }
      }

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
    const handleMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
    const handleMouseUp = () => {
      endDrag();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY, false);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    // Touch event handlers
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    };
    const handleTouchEnd = () => {
      endDrag();
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY, true);
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
      if (swingExtra1AnimationId.current !== null) {
        cancelAnimationFrame(swingExtra1AnimationId.current);
      }
      if (swingExtra2AnimationId.current !== null) {
        cancelAnimationFrame(swingExtra2AnimationId.current);
      }
      if (swingExtra3AnimationId.current !== null) {
        cancelAnimationFrame(swingExtra3AnimationId.current);
      }
    };
  }, []);

  // Start pendulum animation on mount
  useEffect(() => {
    animatePendulum(120, 1, 0);
  }, []);

  return (
    <div
      className="fixed z-200 inset-0 w-screen h-screen pointer-events-none duration-500"
      ref={contactRef}
    >
      <div
        className="absolute inset-[0_0_auto_0] w-full ease-out duration-500 bg-(--slip) text-(--charm)"
        style={{ transform: "translateY(-100%)" }}
        ref={formRef}
      >
        <div className="absolute bottom-0 right-28 lg:right-78 w-16 lg:w-24 max-w-[12vh] translate-[93.8%]">
          <svg
            className="absolute z-1 top-0 -left-26/107 w-80/107"
            viewBox="0 0 80 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0H80V1.16667C66.25 1.16667 66.25 21.5833 80 21.5833V50H0V0Z"
              fill="var(--slip)"
            />
          </svg>
          <div
            className="relative aspect-107/805 origin-[50%_7%] rotate-0"
            ref={momentumRef}
          >
            <Image
              className="absolute top-0 left-0 aspect-107/209 w-full"
              src="/images/chain-final.png"
              alt="Chain"
              width={107}
              height={209}
            />
            <div
              className="absolute top-182/805 left-0 aspect-107/623 w-full origin-[45%_-1%] cursor-grab pointer-events-auto"
              ref={swingingRef}
            >
              <div className="relative aspect-107/168 w-full">
                <Image
                  className="relative z-1 w-full aspect-107/168"
                  src="/images/djfskjdvf.png"
                  alt="Lanyard string"
                  width={107}
                  height={168}
                />
                <div
                  className="absolute top-120/168 left-10/107 w-87/107 origin-[45%_0%]"
                  ref={swingExtra1Ref}
                >
                  <Image
                    className="w-full aspect-87/214"
                    src="/images/con-tag.png"
                    alt="Con badge"
                    width={87}
                    height={214}
                  />
                  <div
                    className="absolute top-208/214 -left-10/107 w-107/87 origin-[45%_-5%]"
                    ref={swingExtra2Ref}
                  >
                    <Image
                      className="w-full aspect-107/144"
                      src="/images/ta-tag.png"
                      alt="Ta tag"
                      width={107}
                      height={144}
                    />
                    <div
                      className="absolute top-140/144 right-4/107 w-87/107 origin-[40%_-3%]"
                      ref={swingExtra3Ref}
                    >
                      <Image
                        className="w-full aspect-87/154"
                        src="/images/ct-tag.png"
                        alt="Ct badge"
                        width={87}
                        height={154}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full px-5 pt-5 lg:pt-15 pb-4 lg:px-15 lg:pb-15 flex justify-center pointer-events-auto">
          <div className="relative w-full max-w-[700px] flex flex-col items-stretch gap-8">
            <div className="w-full max-w-[500px] flex flex-col gap-1">
              <a
                href="/"
                className="lg:absolute lg:left-0 lg:-translate-x-[calc(100%+2rem)] lg:translate-y-2 caption opacity-50 hover:opacity-100"
                ref={closeContactRef}
              >
                ← Home
              </a>
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
