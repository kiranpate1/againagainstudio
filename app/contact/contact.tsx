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
  const previousPagePathRef = useRef<string>(
    pathname === "/contact" ? "/" : pathname,
  );

  if (pathname !== "/contact" && pathname !== previousPagePathRef.current) {
    previousPagePathRef.current = pathname;
  }

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
        router.push(previousPagePathRef.current);
      });
    }

    isFormOpenRef.current = isFormOpen;

    toggleFormRef.current = () => {
      const newFormState = !isFormOpen;
      setIsFormOpen(newFormState);
      if (newFormState) {
        router.push("/contact");
      } else {
        router.push(previousPagePathRef.current);
      }
    };
  }, [isFormOpen, router]);

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

        // Trigger pendulum animation to dissipate the momentum that caused the closing
        const dragDirectionClose = currentRotation.current >= 0 ? 1 : -1;
        animatePendulum(
          Math.abs(currentRotation.current) * 36,
          dragDirectionClose,
          currentPendulumAngle.current,
        );

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

        // Trigger pendulum animation on momentumRef based on drag amount and direction
        const dragDirectionOpen = currentRotation.current >= 0 ? 1 : -1;
        animatePendulum(
          Math.abs(currentRotation.current) * 36, // Scale to match galleryBook's drag amount scale
          dragDirectionOpen,
          currentPendulumAngle.current,
        );

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
      className="fixed z-200 inset-0 w-screen h-screen pointer-events-none duration-500 transition-colors"
      ref={contactRef}
    >
      <div
        className="absolute inset-[0_0_auto_0] w-full ease-out duration-500 transition-transform text-(--charm)"
        style={{ transform: "translateY(-100%)" }}
        ref={formRef}
      >
        <div className="absolute bottom-0 right-30 lg:right-78 w-16 lg:w-24 max-w-[12vh] translate-[93.8%]">
          <svg
            className="absolute z-1 -top-18/805 -left-3/107 w-57/107"
            viewBox="0 0 57 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M57 4.00781C56.8339 4.00302 56.6672 4 56.5 4C47.1112 4 39.5 11.6112 39.5 21C39.5 30.3888 47.1112 38 56.5 38C56.6673 38 56.8339 37.996 57 37.9912V68H0V0H57V4.00781Z"
              fill="var(--slip)"
            />
          </svg>
          <svg
            className="absolute z-0 -top-18/805 -left-3/107 w-113/107"
            viewBox="0 0 113 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M113 68H0V0H113V68ZM56.5 4C47.1112 4 39.5 11.6112 39.5 21C39.5 30.3888 47.1112 38 56.5 38C65.8888 38 73.5 30.3888 73.5 21C73.5 11.6112 65.8888 4 56.5 4Z"
              fill="var(--slip)"
            />
          </svg>
          <div
            className="relative aspect-107/805 origin-[50%_2%] rotate-0"
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
                  src="/images/lanyard-rope.png"
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
                        src="/images/ct-tag-new.png"
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
        <div className="relative w-full px-5 pt-5 lg:pt-15 lg:px-15 bg-(--slip) flex justify-center pointer-events-auto">
          <div className="relative w-full max-w-[700px] flex flex-col items-stretch gap-8">
            <div className="w-full max-w-[500px] flex flex-col gap-1">
              <a
                href="/"
                className="absolute top-1 right-0 w-4 opacity-50 hover:opacity-100"
                ref={closeContactRef}
              >
                <svg
                  width="100%"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M11.9996 14.1216L17.3026 19.4246C17.584 19.706 17.9657 19.8641 18.3636 19.8641C18.7616 19.8641 19.1432 19.706 19.4246 19.4246C19.706 19.1432 19.8641 18.7616 19.8641 18.3636C19.8641 17.9657 19.706 17.584 19.4246 17.3026L14.1196 11.9996L19.4236 6.69662C19.5629 6.55729 19.6733 6.39189 19.7487 6.20987C19.824 6.02785 19.8628 5.83277 19.8627 5.63577C19.8627 5.43877 19.8238 5.24371 19.7484 5.06172C19.673 4.87974 19.5624 4.71439 19.4231 4.57512C19.2838 4.43586 19.1184 4.3254 18.9364 4.25005C18.7543 4.1747 18.5592 4.13595 18.3623 4.13599C18.1653 4.13604 17.9702 4.17489 17.7882 4.25032C17.6062 4.32575 17.4409 4.43629 17.3016 4.57562L11.9996 9.87862L6.6966 4.57562C6.5583 4.43229 6.39284 4.31794 6.20987 4.23924C6.0269 4.16055 5.83009 4.11907 5.63092 4.11725C5.43176 4.11543 5.23422 4.15329 5.04984 4.22862C4.86546 4.30395 4.69793 4.41526 4.55703 4.55603C4.41612 4.6968 4.30466 4.86422 4.22916 5.04853C4.15365 5.23284 4.1156 5.43034 4.11724 5.62951C4.11887 5.82868 4.16016 6.02553 4.23869 6.20857C4.31721 6.39161 4.43141 6.55718 4.5746 6.69562L9.8796 11.9996L4.5756 17.3036C4.43241 17.4421 4.31821 17.6076 4.23969 17.7907C4.16116 17.9737 4.11987 18.1706 4.11824 18.3697C4.1166 18.5689 4.15465 18.7664 4.23016 18.9507C4.30566 19.135 4.41712 19.3024 4.55803 19.4432C4.69893 19.584 4.86646 19.6953 5.05084 19.7706C5.23522 19.846 5.43276 19.8838 5.63192 19.882C5.83109 19.8802 6.0279 19.8387 6.21087 19.76C6.39384 19.6813 6.5593 19.567 6.6976 19.4236L11.9996 14.1216Z"
                    fill="var(--charm)"
                  />
                </svg>
              </a>
              <p className="heading-small text-pretty max-w-[calc(100%-24px)]">
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
                <p className="absolute -bottom-10 text-sm text-(--glaze) font-medium text-center">
                  Message sent ✓
                </p>
              )}

              {status === "error" && (
                <p className="absolute -bottom-10 text-sm text-(--tile) font-medium text-center">
                  {errorMessage}&ensp;
                  <a
                    className="underline"
                    href="mailto:hello@againagain.studio"
                  >
                    Try email?
                  </a>
                </p>
              )}
            </form>
          </div>
        </div>
        <div className="w-full flex h-10 lg:h-15">
          <div className="w-[calc(100vw-124px)] lg:w-[calc(100vw-318px)] h-full bg-(--slip)" />
          <div className="w-16 lg:w-24 h-full" />
          <div className="flex-1 h-full bg-(--slip)" />
        </div>
      </div>
    </div>
  );
}
