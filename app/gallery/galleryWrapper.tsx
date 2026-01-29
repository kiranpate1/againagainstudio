"use client";

import { useState } from "react";
import GalleryBook from "./galleryBook";
import { galleryItems } from "./galleryItems";
import Image from "next/image";

type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
};

export default function GalleryWrapper() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(
    galleryItems[0] || null,
  );

  return (
    <>
      <div className="absolute inset-[0_0_0_58px] md:inset-[0_0_80px_0] flex flex-col md:w-full md:flex-row justify-center items-center">
        <GalleryBook items={galleryItems} onActiveItemChange={setActiveItem} />
        <div className="w-full md:max-w-[500px] min-h-[300px] md:min-h-[500px] relative ">
          <Image
            className="absolute left-0 min-w-full min-h-full hidden md:block"
            src="/images/events-bg.png"
            alt="Gallery Background"
            fill
          />
          {activeItem && (
            <div className="absolute flex flex-col lg:justify-between gap-2 inset-0 p-[0_16px_16px_16px] md:p-[48px_48px_64px_48px]">
              <div className="relative flex flex-col gap-4 md:gap-9">
                <div className="flex flex-col gap-0 md:gap-1">
                  <h1 className="text-[30px] md:text-[40px] tracking-[-0.04em]">
                    {activeItem.title}
                  </h1>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
