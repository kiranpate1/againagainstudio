"use client";

import { useState, useRef, useEffect } from "react";
import { submitContactForm } from "../actions/sendForm";
import { usePathname, useRouter } from "next/navigation";
import BottomInfo from "./bottomInfo";
import Image from "next/image";

export default function InfoContainer() {
  const pathname = usePathname();
  const router = useRouter();
  const infoRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const openFormRef = useRef<HTMLDivElement>(null);
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

  // Scroll to info section on mount
  useEffect(() => {
    if (!infoRef.current || !openFormRef.current || !formRef.current) return;

    // Apply UI changes based on isFormOpen state
    if (formRef.current) {
      if (isFormOpen) {
        formRef.current.classList.remove("lg:opacity-0");
      } else {
        formRef.current.classList.add("lg:opacity-0");
      }
    }

    if (infoRef.current) {
      infoRef.current.style.pointerEvents = isFormOpen ? "none" : "auto";
    }

    const infoBlocks = infoRef.current
      ?.children as HTMLCollectionOf<HTMLDivElement>;

    if (isFormOpen) {
      infoBlocks[0]?.classList.add(
        "lg:transform-[translate(-33%,0)_rotateZ(6deg)]",
      );
      infoBlocks[1]?.classList.add(
        "lg:transform-[translate(33%,-15%)_rotateZ(-10deg)]",
      );
      infoBlocks[2]?.classList.add(
        "lg:transform-[translate(-30%,80%)_rotateZ(7deg)]",
      );
    } else {
      infoBlocks[0]?.classList.remove(
        "lg:transform-[translate(-33%,0)_rotateZ(6deg)]",
      );
      infoBlocks[1]?.classList.remove(
        "lg:transform-[translate(33%,-15%)_rotateZ(-10deg)]",
      );
      infoBlocks[2]?.classList.remove(
        "lg:transform-[translate(-30%,80%)_rotateZ(7deg)]",
      );
    }

    const formText = openFormRef.current?.querySelector("p");
    if (formText) {
      formText.innerHTML = isFormOpen ? "back →" : "← Sign up to get involved";
      formText.style.transform = isFormOpen
        ? "translateX(0px)"
        : "translateX(130px)";
    }

    function toggleForm() {
      const newFormState = !isFormOpen;
      setIsFormOpen(newFormState);

      // Navigate based on the new state
      if (newFormState) {
        router.push("/contact");
      } else {
        router.push("/info");
      }
    }

    openFormRef.current?.addEventListener("click", toggleForm);
    return () => {
      openFormRef.current?.removeEventListener("click", toggleForm);
    };
  }, [isFormOpen]);

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

  // Determine visibility based on route
  const isVisible = pathname === "/info" || pathname === "/contact";

  return (
    <div
      className="w-screen h-screen flex flex-col lg:justify-center items-center overflow-scroll lg:overflow-hidden duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <div
        className={`relative z-2 w-full lg:h-full flex flex-col items-center p-[100px_20px_0px_20px] lg:p-0 gap-4 ${pathname === "/contact" ? "hidden lg:flex" : ""}`}
        ref={infoRef}
      >
        <div className="relative lg:absolute lg:inset-[120px_auto_auto_20px] lg:w-[48vw] max-w-[439px] duration-600 ease-in-out transition-transform">
          <Image
            className="w-full"
            src="/images/info-1.png"
            alt="Info"
            width={439}
            height={215}
          />
          <div className="absolute inset-0 p-8 flex gap-5 items-start text-(--bisqueware)">
            <p className="paragraph uppercase">BIO</p>
            <p className="paragraph text-pretty">
              A place where we invite people to wander into new artistic
              territories. To try, to tinker, and to begin again as many times
              as they wish.
            </p>
          </div>
        </div>
        <div className="relative lg:absolute lg:inset-[64px_20px_auto_auto] lg:w-[48vw] max-w-[558px] duration-600 ease-in-out transition-transform">
          <Image
            className="w-full"
            src="/images/info-3.png"
            alt="Info"
            width={558}
            height={439}
          />
          <div className="absolute inset-[0_25%_0%_10%] lg:inset-[0_15%_0_10%] p-4 lg:p-8 flex flex-col gap-5 justify-center lg:justify-end text-(--kiln-fire)">
            <p className="paragraph uppercase">THE SPACE</p>
            <p className="paragraph text-pretty">
              Our space in Downtown Toronto opened in January 2026. It sits at
              the heart of Downtown Toronto, between King Street, Adelaide, and
              John St.
              <br />
              <br />
              The location aims to be accessible as possible to those who want
              to explore their creative side.
            </p>
          </div>
        </div>
        <div className="relative lg:absolute lg:inset-[auto_auto_64px_20px] w-full lg:w-auto max-w-[500px] lg:max-w-[970px] lg:h-full lg:max-h-[53vh] aspect-524/970 lg:aspect-auto flex lg:block items-center justify-center duration-600 ease-in-out transition-transform">
          <Image
            className="relative w-[calc(970/524*(100vw-40px))] max-w-[calc(970/524*500px)] lg:w-full lg:h-full rotate-90 lg:rotate-0"
            src="/images/info-2.png"
            alt="Info"
            width={970}
            height={524}
          />
          <div className="absolute inset-[12%_0_12%_0] lg:inset-[0_20%_0_20%] p-8 flex gap-5 items-center lg:items-start text-(--bisqueware)">
            <p className="paragraph uppercase">OUR STORY</p>
            <p className="paragraph text-pretty">
              My creative career began with community. Growing up, I was
              surrounded by peers, mentors, and teachers who encouraged me to
              pursue a creative path. After hearing countless stories of
              creative souls who were discouraged from following their passion,
              I realized what a blessing a supportive community can be.
              <br />
              <br />
              After spending years in these creative environments, I've longed
              to give back to the community that has given me everything and
              curate a space of my own. To my creative peers, I invite you to
              come and share knowledge with new friends. And if you've always
              wanted to explore creative pursuits, I hope you'll join us for our
              workshops.
              <br />
              <br />
              Come explore, try, and fail. Again and again.
            </p>
          </div>
        </div>
        <div
          className="relative lg:absolute lg:inset-[550px_20px_auto_auto] lg:w-auto max-w-[411px] hidden lg:block cursor-pointer hover:-hue-rotate-15 pointer-events-auto"
          ref={openFormRef}
        >
          <Image
            className="w-full h-full"
            src="/images/info-4.png"
            alt="Info"
            width={411}
            height={91}
          />
          <div className="absolute inset-0 p-8 flex gap-5 text-(--kiln-fire) overflow-hidden">
            <p
              className="paragraph duration-200 ease-in-out"
              style={{ transform: "translateX(130px)" }}
            >
              ← Sign up to get involved
            </p>
          </div>
        </div>
      </div>
      <div
        className="relative lg:absolute z-1 w-full max-w-[456px] p-[100px_20px_80px_20px] lg:p-0 flex flex-col gap-5 lg:opacity-0 duration-300"
        ref={formRef}
      >
        <p className="paragraph text-pretty text-(--kiln-fire)">
          We believe that everyone has a skill to share, and communicating them
          enrich the broader community.
          <br />
          <br />
          Whether it’s your first time hosting, or your fifth, Again Again
          encourages anyone can come to us with an idea for a workshop, class,
          or event.
          <br />
          <br />
          Feel free to reach out directly at hello@againagain.studio
        </p>
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
              className="px-3 py-2 border border-(--florals) rounded-xl text-(--kiln-fire) focus:text-(--kiln-fire) focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-(--florals) placeholder:opacity-100"
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
              className="px-3 py-2 border border-(--florals) rounded-xl text-(--kiln-fire) focus:text-(--kiln-fire) focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-(--florals) placeholder:opacity-100"
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
              className="px-3 py-2 border border-(--florals) rounded-xl text-(--kiln-fire) focus:text-(--kiln-fire) focus:outline-none focus:ring-2 focus:ring-black/5 placeholder:text-(--florals) placeholder:opacity-100"
              placeholder="Message"
            />
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 px-6 py-1.5 bg-(--florals) text-(--slip) rounded-full hover:bg-(--charm) disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
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
      <BottomInfo />
    </div>
  );
}
