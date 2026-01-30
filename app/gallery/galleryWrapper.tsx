"use client";

import { useState, useRef } from "react";
import GalleryBook, { GalleryBookHandle } from "./galleryBook";
import { galleryItems } from "./galleryItems";
import BottomInfo from "../components/bottomInfo";

type GalleryItem = {
  id: number;
  title: string;
  imageUrl: string;
};

export default function GalleryWrapper() {
  const galleryBookRef = useRef<GalleryBookHandle>(null);
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(
    galleryItems[0] || null,
  );

  const handleNextCard = () => {
    galleryBookRef.current?.nextCard();
  };

  return (
    <div className="absolute w-screen h-screen inset-0 p-[166px_0_0_0] lg:p-[190px_0_0_0] flex flex-col justify-start items-center">
      <div className="relative w-[300px] max-w-[30vh] translate-x-[5%] aspect-2/3">
        <GalleryBook
          ref={galleryBookRef}
          items={galleryItems}
          onActiveItemChange={setActiveItem}
        />
      </div>
      <div className="w-full h-full max-w-[500px] relative ">
        {activeItem && (
          <div className="absolute flex flex-col justify-center gap-2 inset-0 p-4 lg:p-8">
            <div className="relative p-4 flex items-center justify-between">
              <svg
                className="absolute inset-0 pointer-events-none"
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
              <div className="w-6 h-6" />
              <h1 className="text-[30px] tracking-[-0.04em]">
                {activeItem.title}
              </h1>
              <button
                className="w-6 h-6 flex items-center justify-center cursor-pointer"
                onClick={handleNextCard}
              >
                {/* <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.85 6.69078L7.14 1.55078L6.44 2.55078L13.56 7.33078H0.5V8.58078H13.26L6.43 13.4408L7.15 14.4408L14.85 9.00078C15.0462 8.87422 15.2081 8.70124 15.3215 8.49717C15.4349 8.29309 15.4962 8.06421 15.5 7.83078C15.493 7.60212 15.4302 7.37864 15.3168 7.17991C15.2035 6.98117 15.0432 6.81323 14.85 6.69078Z"
                    fill="#96484E"
                  />
                </svg> */}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="hidden lg:block">
        <BottomInfo />
      </div>
    </div>
  );
}
