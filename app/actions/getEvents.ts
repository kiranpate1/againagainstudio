"use server";

type Event = {
  id: string;
  eventName: string;
  date: string | null;
  description: string;
  link: string | null;
  image: string | null;
  hasHost: boolean;
  hostName: string;
};

type LumaEventData = {
  api_id: string;
  event: {
    api_id: string;
    name: string;
    start_at: string;
    cover_url: string;
    url: string;
    description?: string;
  };
};

export async function getEvents(): Promise<Event[]> {
  const res = await fetch("https://api.lu.ma/public/v1/calendar/list-events", {
    method: "GET",
    headers: {
      accept: "application/json",
      "x-luma-api-key": process.env.LUMA_API_KEY || "",
    },
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data as any;
}
