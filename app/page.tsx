"use client";

import Image from "next/image";
import { useState, useEffect, useRef, use } from "react";
import events from "./events/events";
import { shapes } from "./shapes";
import EventsBook from "./events/eventsBook";
import Calendar from "./events/calendar";
import { getNotionEvents } from "@/app/actions/getEvents";
import Navigation from "./components/navigation";

export default function Home() {
  useEffect(() => {
    getNotionEvents().then((data) => {
      console.log("Fetched Notion Events:", data);
    });
  }, []);
  return (
    <main className="fixed w-screen max-w-dvw h-screen max-h-dvh flex flex-col gap-10 justify-center items-center overflow-hidden">
      <Navigation />
      <div className="flex justify-center">
        <EventsBook />
        <div className="w-[300px] h-[400px] relative">
          <h1>Test</h1>
        </div>
      </div>
      <Calendar />
    </main>
  );
}
