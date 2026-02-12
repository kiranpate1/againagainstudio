import { getNotionEvents } from "@/app/actions/getEvents";

export default async function Home() {
  const events = await getNotionEvents();

  return <div className=""></div>;
}
