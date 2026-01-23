export default function BottomInfo() {
  return (
    <nav className="relative lg:fixed z-100 lg:inset-[auto_16px_8px_16px] p-[0px_20px_100px_20px] lg:p-[12px_18px_20px_12px] flex flex-col lg:flex-row gap-4 justify-between items-center">
      <svg
        className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-full"
        width="100%"
        height="100%"
        viewBox="0 0 1481 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M149 50H6L0.5 43V2.5L652 6L664 2.5L1274 0.5L1321.5 7.5L1334.5 0.5H1474L1479.5 46L1476.5 51L1128.5 46L1105.62 50H870L858 55.5L834 50H737.25L304.5 47L289 43L149 50Z"
          stroke="#461407"
          fill="var(--bisqueware)"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative flex flex-col lg:flex-row items-center gap-4 lg:gap-20 text-(--kiln-fire)">
        <a
          className="paragraph cursor hover:opacity-70"
          href="https://instagram.com/againagain.studio"
          target="_blank"
        >
          Instagram
        </a>
        <a
          className="paragraph cursor hover:opacity-70"
          href="/"
          target="_blank"
        >
          Discord
        </a>
        <a
          className="paragraph cursor hover:opacity-70"
          href="mailto:hello@againagain.studio"
          target="_blank"
        >
          hello@againagain.studio
        </a>
        <p className="paragraph">30 Duncan St. Unit 608</p>
        <p className="paragraph">Toronto, ON</p>
      </div>
      <svg
        className="relative"
        width="36"
        height="26"
        viewBox="0 0 36 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.40567 25.4702H0.999714L6.12325 13.5805L0 12.1973V0H13.4961V8.80214L8.40567 25.4702Z"
          fill="#461407"
        />
        <path
          d="M31.7649 16.1345H29.7344V0H35.5184L31.7649 16.1345Z"
          fill="#461407"
        />
        <path
          d="M18.8362 -2.0557e-07C21.4629 -9.07539e-08 23.5391 2.25145 23.5391 4.89672L21.5161 13.1917L17.7998 13.1917L18.8362 9.15759C16.3049 9.15759 14.0004 7.19674 14.0004 4.78969C14.0004 2.38265 15.8338 -3.36809e-07 18.8362 -2.0557e-07Z"
          fill="#461407"
        />
        <path
          d="M23.5391 7.00176L24.1944 5.1354L24.4393 0H29.2216L28.8264 5.1354L27.8101 7.00176H23.5391Z"
          fill="#461407"
        />
      </svg>
    </nav>
  );
}
