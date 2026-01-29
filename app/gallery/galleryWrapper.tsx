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
      <div className="absolute inset-[80px_0_0_0] flex flex-col md:w-full md:flex-row justify-center items-center">
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
              <div className="relative p-4 flex items-center justify-center">
                <svg
                  className="absolute inset-0"
                  width="100%"
                  height="100%"
                  viewBox="0 0 315 65"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M303.51 12.8047L303.63 12.8994L303.783 12.9102L314.5 13.6826V53.2246L303.875 54.667L303.77 54.6816L303.68 54.7373L287.895 64.499L22.958 62.9062L9.36328 54.3867L9.26855 54.3281L9.15918 54.3145L0.5 53.249V13.0918H9.61035L9.75195 12.9639L23.0059 1.11035L287.863 0.5L303.51 12.8047Z"
                    stroke="var(--copper)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <h1 className="text-[30px] md:text-[40px] tracking-[-0.04em]">
                  {activeItem.title}
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
