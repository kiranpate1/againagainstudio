"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { shapes } from "../shapes";

export default function Info() {
  const pathname = usePathname();
  const basePageRef = useRef<string>(pathname === "/contact" ? "/" : pathname);

  if (pathname !== "/contact" && pathname !== basePageRef.current) {
    basePageRef.current = pathname;
  }

  const isInfo =
    pathname === "/info" ||
    (pathname === "/contact" && basePageRef.current === "/info");

  return (
    <div
      className="relative inset-0 w-screen h-screen flex items-start justify-center px-4 pt-18 pb-12 lg:px-10 lg:pt-23 lg:pb-23 overflow-scroll"
      style={{ display: isInfo ? "flex" : "none" }}
    >
      <div className="w-full max-w-[660px] flex flex-col items-start gap-16">
        <div className="w-full flex flex-col items-start gap-2">
          <p className="paragraph uppercase">Programming</p>
          <h1 className="heading-small text-pretty">
            Again Again offers hands-on creative programming built around shared
            experience. We host beginner-friendly workshops, shows, and social
            craft nights led by local talent. Our focus is on access, curiosity,
            and creating space to try something new without pressure.
            <br />
            <br />
            Our hosts range from seasoned professionals to first-time
            instructors. We believe everyone has something to share and deserves
            support in doing so. Pricing is set collaboratively, with 60% of
            proceeds going directly to hosts.
            <br />
            <br />
            The studio isn’t built to maximize profit. It’s built to share with
            the community.
          </h1>
          <Link
            href="/contact"
            className="paragraph text-(--charm) cursor hover:opacity-70"
          >
            Get in contact about hosting
          </Link>
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <p className="paragraph uppercase">Private Events</p>
          <h1 className="heading-small text-pretty">
            We also host private events and workshops. The space accommodates up
            to 40 guests standing or 25 seated at tables.
            <br />
            <br />
            The studio is equipped for hand building ceramics, glazing sessions,
            paint nights, and drawing classes, and is flexible enough to support
            other creative workshops you have in mind.
          </h1>
          <Link
            href="/contact"
            className="paragraph text-(--charm) cursor hover:opacity-70"
          >
            Learn more about the space
          </Link>
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <p className="paragraph uppercase">The Space</p>
          <h1 className="heading-small text-pretty">
            Our space in Downtown Toronto opened in January 2026. It sits at the
            heart of Downtown Toronto, between King Street, Adelaide, and John
            St.
            <br />
            <br />
            The location aims to be accessible as possible to those who want to
            explore their creative side.
          </h1>
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <p className="paragraph uppercase">Tatami Area</p>
          <h1 className="heading-small text-pretty">
            Tatami area can be used as a stage for performing, or as a lounge
            area for guests
          </h1>
          <div className="flex items-stretch gap-2 w-[calc(100%+32px)] md:w-full h-[clamp(250px,22vw,320px)] overflow-scroll px-4 md:px-0 -mx-4 md:mx-0 mt-4">
            <div className="relative h-full aspect-square">
              {shapes[3].svg(
                <div className="relative w-full h-full">
                  <Image
                    src={"/images/gallery/gallery-1.png"}
                    alt={"Tatami Area #1"}
                    fill
                    className="object-cover contrast-100 group-hover:contrast-120 brightness-100 group-hover:brightness-90"
                  />
                </div>,
                "tatami-1",
              )}
            </div>
            <div className="relative h-full aspect-square">
              {shapes[0].svg(
                <div className="relative w-full h-full">
                  <Image
                    src={"/images/gallery/gallery-2.png"}
                    alt={"Tatami Area #2"}
                    fill
                    className="object-cover contrast-100 group-hover:contrast-120 brightness-100 group-hover:brightness-90"
                  />
                </div>,
                "tatami-2",
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <p className="paragraph uppercase">Main Tables</p>
          <h1 className="heading-small text-pretty">
            There are 4 square tables, put together to make two large
            rectangular tables. Each table can be separated and reconfigured.
            <br />
            <br />
            There is about 8 chairs per table, with an extra 8 stools available
            to be added.
          </h1>
          <div className="flex items-stretch gap-2 w-[calc(100%+32px)] md:w-full h-[clamp(250px,22vw,320px)] overflow-scroll px-4 md:px-0 -mx-4 md:mx-0 mt-4">
            <div className="relative h-full aspect-square">
              {shapes[2].svg(
                <div className="relative w-full h-full">
                  <Image
                    src={"/images/gallery/gallery-3.png"}
                    alt={"Main Area #1"}
                    fill
                    className="object-cover contrast-100 group-hover:contrast-120 brightness-100 group-hover:brightness-90"
                  />
                </div>,
                "Main-1",
              )}
            </div>
            <div className="relative h-full aspect-square">
              {shapes[1].svg(
                <div className="relative w-full h-full">
                  <Image
                    src={"/images/gallery/gallery-4.png"}
                    alt={"Main Area #2"}
                    fill
                    className="object-cover contrast-100 group-hover:contrast-120 brightness-100 group-hover:brightness-90"
                  />
                </div>,
                "Main-2",
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex flex-col items-start gap-2">
          <p className="paragraph uppercase">Pottery Area</p>
          <h1 className="heading-small text-pretty">
            To the left of the tatami mat area, there is a small area for
            pottery. There is one large rectangular table, able to fit 8 people
            comfortable. Kiln can be moved to the side to make more space.
          </h1>
          <div className="flex items-stretch gap-2 w-[calc(100%+32px)] md:w-full h-[clamp(250px,22vw,320px)] overflow-scroll px-4 md:px-0 -mx-4 md:mx-0 mt-4">
            <div className="relative h-full aspect-square">
              {shapes[0].svg(
                <div className="relative w-full h-full">
                  <Image
                    src={"/images/gallery/gallery-5.png"}
                    alt={"Pottery Area #1"}
                    fill
                    className="object-cover contrast-100 group-hover:contrast-120 brightness-100 group-hover:brightness-90"
                  />
                </div>,
                "Pottery-1",
              )}
            </div>
            <div className="relative h-full aspect-square">
              {shapes[3].svg(
                <div className="relative w-full h-full">
                  <Image
                    src={"/images/gallery/gallery-6.png"}
                    alt={"Pottery Area #2"}
                    fill
                    className="object-cover contrast-100 group-hover:contrast-120 brightness-100 group-hover:brightness-90"
                  />
                </div>,
                "Pottery-2",
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
