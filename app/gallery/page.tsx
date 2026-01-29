import { getNotionEvents } from "@/app/actions/getEvents";
import GalleryWrapper from "./galleryWrapper";

export default async function Home() {
  const events = await getNotionEvents();

  return (
    <div className="">
      <GalleryWrapper />
    </div>
  );
}
