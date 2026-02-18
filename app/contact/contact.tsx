"use client";

import { useState, useRef, useEffect } from "react";
import { submitContactForm } from "../actions/sendForm";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Contact() {
  const momentumRef = useRef<HTMLDivElement>(null);
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

  return (
    <div className="fixed z-200 inset-0 w-screen h-screen pointer-events-none">
      <div className="absolute inset-[0_0_auto_0] w-full -translate-y-full">
        <div
          className="absolute z-1 bottom-0 right-48 w-32 aspect-157/709 translate-y-[93%] origin-[33%_6%] pointer-events-auto"
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
            className="absolute top-[25.8%] left-[3%] aspect-157/529 w-full"
            src="/images/lanyard-new.png"
            alt="lanyard"
            width={157}
            height={529}
          />
        </div>
        <div
          className="relative w-full px-5 pt-15 pb-4 lg:px-15 lg:pb-15 bg-(--slip) text-(--charm) flex justify-center pointer-events-auto"
          ref={formRef}
        >
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
