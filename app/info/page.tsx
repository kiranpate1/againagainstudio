"use client";

import { useState } from "react";
import { submitContactForm } from "../actions/sendForm";
import Navigation from "../components/navigation";

export default function Home() {
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
    <main className="fixed w-screen max-w-dvw h-screen max-h-dvh flex flex-col gap-10 justify-center items-center overflow-hidden">
      <Navigation />
      <div className="flex justify-center">
        <form
          action={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-md p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-700"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
              placeholder="Your message..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Submitting..." : "Submit"}
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
    </main>
  );
}
