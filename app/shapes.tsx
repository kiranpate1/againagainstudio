export interface SvgElement {
  id: string;
  name: string;
  svg: (imageElement?: React.ReactNode, uniqueId?: string) => React.ReactNode;
}

<svg
  width="463"
  height="463"
  viewBox="0 0 463 463"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M0 0H93.0287L147.903 6.00185L221.64 0L233.429 4.93009L359.468 0H463V62.8051L456.355 104.389L463 196.561V251.649L459.57 285.088L463 357.325V463H307.166L178.769 458.284L118.108 463H0V418.2L4.07269 372.544L0 328.387V204.063L8.35972 98.6018L0 62.8051V0Z"
    fill="#D9D9D9"
  />
</svg>;

export const shapes: SvgElement[] = [
  {
    id: "shape-1",
    name: "Example Shape 1",
    svg: (imageElement, uniqueId = "1") => (
      <>
        <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath
              id={`clip-shape-1-${uniqueId}`}
              clipPathUnits="objectBoundingBox"
            >
              <path
                transform="scale(0.00216, 0.00216)"
                d="M0 0H93.0287L147.903 6.00185L221.64 0L233.429 4.93009L359.468 0H463V62.8051L456.355 104.389L463 196.561V251.649L459.57 285.088L463 357.325V463H307.166L178.769 458.284L118.108 463H0V418.2L4.07269 372.544L0 328.387V204.063L8.35972 98.6018L0 62.8051V0Z"
              />
            </clipPath>
          </defs>
        </svg>
        {imageElement && (
          <div
            className="absolute z-1 inset-0 w-full h-full"
            style={{ clipPath: `url(#clip-shape-1-${uniqueId})` }}
          >
            {imageElement}
          </div>
        )}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0H93.0287L147.903 6.00185L221.64 0L233.429 4.93009L359.468 0H463V62.8051L456.355 104.389L463 196.561V251.649L459.57 285.088L463 357.325V463H307.166L178.769 458.284L118.108 463H0V418.2L4.07269 372.544L0 328.387V204.063L8.35972 98.6018L0 62.8051V0Z"
            fill="var(--kiln-fire)"
          />
        </svg>
        {/* <svg
          className="absolute z-2 inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={`clip-shape-1-gradient-${uniqueId}`}>
              <path d="M0 0H93.0287L147.903 6.00185L221.64 0L233.429 4.93009L359.468 0H463V62.8051L456.355 104.389L463 196.561V251.649L459.57 285.088L463 357.325V463H307.166L178.769 458.284L118.108 463H0V418.2L4.07269 372.544L0 328.387V204.063L8.35972 98.6018L0 62.8051V0Z" />
            </clipPath>
            <linearGradient
              id={`scrim-gradient-1-${uniqueId}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <g clipPath={`url(#clip-shape-1-gradient-${uniqueId})`}>
            <rect
              x="0"
              y="213"
              width="463"
              height="250"
              fill={`url(#scrim-gradient-1-${uniqueId})`}
              className="origin-bottom group-hover:scale-y-200"
            />
          </g>
        </svg> */}
      </>
    ),
  },
  {
    id: "shape-2",
    name: "Example Shape 2",
    svg: (imageElement, uniqueId = "2") => (
      <>
        <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath
              id={`clip-shape-2-${uniqueId}`}
              clipPathUnits="objectBoundingBox"
            >
              <path
                transform="scale(0.00216, 0.00216)"
                d="M0 0V118.537C8.57407 124.967 9.00278 148.546 0 155.191V227.213L7.07361 333.96L0 393.55V463H69.0213L110.177 457.856L167.194 463L321.099 457.856L349.822 463H463V407.483L456.355 344.678V270.512L463 196.561L459.142 184.128L463 146.617V0H322.171L228.713 5.7875L93.0287 0H0Z"
              />
            </clipPath>
          </defs>
        </svg>
        {imageElement && (
          <div
            className="absolute z-1 inset-0 w-full h-full"
            style={{ clipPath: `url(#clip-shape-2-${uniqueId})` }}
          >
            {imageElement}
          </div>
        )}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0V118.537C8.57407 124.967 9.00278 148.546 0 155.191V227.213L7.07361 333.96L0 393.55V463H69.0213L110.177 457.856L167.194 463L321.099 457.856L349.822 463H463V407.483L456.355 344.678V270.512L463 196.561L459.142 184.128L463 146.617V0H322.171L228.713 5.7875L93.0287 0H0Z"
            fill="var(--kiln-fire)"
          />
        </svg>
        {/* <svg
          className="absolute z-2 inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={`clip-shape-2-gradient-${uniqueId}`}>
              <path d="M0 0V118.537C8.57407 124.967 9.00278 148.546 0 155.191V227.213L7.07361 333.96L0 393.55V463H69.0213L110.177 457.856L167.194 463L321.099 457.856L349.822 463H463V407.483L456.355 344.678V270.512L463 196.561L459.142 184.128L463 146.617V0H322.171L228.713 5.7875L93.0287 0H0Z" />
            </clipPath>
            <linearGradient
              id={`scrim-gradient-2-${uniqueId}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <g clipPath={`url(#clip-shape-2-gradient-${uniqueId})`}>
            <rect
              x="0"
              y="213"
              width="463"
              height="250"
              fill={`url(#scrim-gradient-2-${uniqueId})`}
              className="origin-bottom group-hover:scale-y-200"
            />
          </g>
        </svg> */}
      </>
    ),
  },
  {
    id: "shape-3",
    name: "Example Shape 3",
    svg: (imageElement, uniqueId = "3") => (
      <>
        <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath
              id={`clip-shape-3-${uniqueId}`}
              clipPathUnits="objectBoundingBox"
            >
              <path
                transform="scale(0.00216, 0.00216)"
                d="M0 0V56.3745L4.50139 111.463V196.775L0 335.246C4.50139 361.183 9.00278 393.55 0 393.55V463H81.8824L185.629 459.785L273.513 463L318.098 456.569L364.827 463H463V360.325L456.998 171.91L463 102.246V0H411.984L341.248 3.00093L322.171 0L171.481 1.50046L49.7296 0H0Z"
              />
            </clipPath>
          </defs>
        </svg>
        {imageElement && (
          <div
            className="absolute z-1 inset-0 w-full h-full"
            style={{ clipPath: `url(#clip-shape-3-${uniqueId})` }}
          >
            {imageElement}
          </div>
        )}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0V56.3745L4.50139 111.463V196.775L0 335.246C4.50139 361.183 9.00278 393.55 0 393.55V463H81.8824L185.629 459.785L273.513 463L318.098 456.569L364.827 463H463V360.325L456.998 171.91L463 102.246V0H411.984L341.248 3.00093L322.171 0L171.481 1.50046L49.7296 0H0Z"
            fill="var(--kiln-fire)"
          />
        </svg>
        {/* <svg
          className="absolute z-2 inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={`clip-shape-3-gradient-${uniqueId}`}>
              <path d="M0 0V56.3745L4.50139 111.463V196.775L0 335.246C4.50139 361.183 9.00278 393.55 0 393.55V463H81.8824L185.629 459.785L273.513 463L318.098 456.569L364.827 463H463V360.325L456.998 171.91L463 102.246V0H411.984L341.248 3.00093L322.171 0L171.481 1.50046L49.7296 0H0Z" />
            </clipPath>
            <linearGradient
              id={`scrim-gradient-3-${uniqueId}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <g clipPath={`url(#clip-shape-3-gradient-${uniqueId})`}>
            <rect
              x="0"
              y="213"
              width="463"
              height="250"
              fill={`url(#scrim-gradient-3-${uniqueId})`}
              className="origin-bottom group-hover:scale-y-200"
            />
          </g>
        </svg> */}
      </>
    ),
  },
  {
    id: "shape-4",
    name: "Example Shape 4",
    svg: (imageElement, uniqueId = "4") => (
      <>
        <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath
              id={`clip-shape-4-${uniqueId}`}
              clipPathUnits="objectBoundingBox"
            >
              <path
                transform="scale(0.00216, 0.00216)"
                d="M0 0V116.393L4.93009 275.228L0 360.325V463H81.8824C94.1276 456.711 101.57 455.159 118.108 463H195.06L244.79 457.212L364.827 463H463V360.325L457.212 349.394L463 247.362L461.084 96.4583L463 61.0903V0H377.688L272.656 4.50139L181.77 0L126.039 6.43056L49.7296 0H0Z"
              />
            </clipPath>
          </defs>
        </svg>
        {imageElement && (
          <div
            className="absolute z-1 inset-0 w-full h-full"
            style={{ clipPath: `url(#clip-shape-4-${uniqueId})` }}
          >
            {imageElement}
          </div>
        )}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0V116.393L4.93009 275.228L0 360.325V463H81.8824C94.1276 456.711 101.57 455.159 118.108 463H195.06L244.79 457.212L364.827 463H463V360.325L457.212 349.394L463 247.362L461.084 96.4583L463 61.0903V0H377.688L272.656 4.50139L181.77 0L126.039 6.43056L49.7296 0H0Z"
            fill="var(--kiln-fire)"
          />
        </svg>
        {/* <svg
          className="absolute z-2 inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id={`clip-shape-4-gradient-${uniqueId}`}>
              <path d="M0 0V116.393L4.93009 275.228L0 360.325V463H81.8824C94.1276 456.711 101.57 455.159 118.108 463H195.06L244.79 457.212L364.827 463H463V360.325L457.212 349.394L463 247.362L461.084 96.4583L463 61.0903V0H377.688L272.656 4.50139L181.77 0L126.039 6.43056L49.7296 0H0Z" />
            </clipPath>
            <linearGradient
              id={`scrim-gradient-4-${uniqueId}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <g clipPath={`url(#clip-shape-4-gradient-${uniqueId})`}>
            <rect
              x="0"
              y="213"
              width="463"
              height="250"
              fill={`url(#scrim-gradient-4-${uniqueId})`}
              className="origin-bottom group-hover:scale-y-200"
            />
          </g>
        </svg> */}
      </>
    ),
  },
];
