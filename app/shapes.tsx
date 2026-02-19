export interface SvgElement {
  id: string;
  name: string;
  svg: (imageElement?: React.ReactNode) => React.ReactNode;
}

export const shapes: SvgElement[] = [
  {
    id: "shape-1",
    name: "Example Shape 1",
    svg: (imageElement) => (
      <>
        <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="clip-shape-1" clipPathUnits="objectBoundingBox">
              <path
                transform="scale(0.00216, 0.00216)"
                d="M463 36.9179L463 411.923L445.378 449.157L424.945 462.999L46.2716 463L22.0547 457.512L2.65688e-06 428.078L2.76463e-05 44.1176L27.5 25L38.7772 5.79756L52.6251 0.00111552L427.107 -1.05373e-06L463 36.9179Z"
              />
            </clipPath>
          </defs>
        </svg>
        {imageElement && (
          <div
            className="absolute z-1 inset-0 w-full h-full"
            style={{ clipPath: "url(#clip-shape-1)" }}
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
            d="M463 36.9179L463 411.923L445.378 449.157L424.945 462.999L46.2716 463L22.0547 457.512L2.65688e-06 428.078L2.76463e-05 44.1176L27.5 25L38.7772 5.79756L52.6251 0.00111552L427.107 -1.05373e-06L463 36.9179Z"
            fill="var(--copper)"
          />
        </svg>
        <svg
          className="absolute z-2 inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="clip-shape-1-gradient">
              <path d="M463 36.9179L463 411.923L445.378 449.157L424.945 462.999L46.2716 463L22.0547 457.512L2.65688e-06 428.078L2.76463e-05 44.1176L27.5 25L38.7772 5.79756L52.6251 0.00111552L427.107 -1.05373e-06L463 36.9179Z" />
            </clipPath>
            <linearGradient
              id="scrim-gradient-1"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <g clipPath="url(#clip-shape-1-gradient)">
            <rect
              x="0"
              y="213"
              width="463"
              height="250"
              fill="url(#scrim-gradient-1)"
              className="origin-bottom group-hover:scale-y-200"
            />
          </g>
        </svg>
      </>
    ),
  },
  {
    id: "shape-2",
    name: "Example Shape 2",
    svg: (imageElement) => (
      <>
        <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="clip-shape-2" clipPathUnits="objectBoundingBox">
              <path
                transform="scale(0.00216, 0.00216)"
                d="M0 0.000138172L108.474 0.000103629C108.474 11.0229 120.32 15.7483 134.931 15.7483C149.543 15.7483 161.389 9.44898 161.389 6.90862e-05L416.7 0L463 26.7721V429.928L407.44 463H0V0.000138172Z"
              />
            </clipPath>
          </defs>
        </svg>
        {imageElement && (
          <div
            className="absolute z-1 inset-0 w-full h-full"
            style={{ clipPath: "url(#clip-shape-2)" }}
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
            d="M0 0.000138172L108.474 0.000103629C108.474 11.0229 120.32 15.7483 134.931 15.7483C149.543 15.7483 161.389 9.44898 161.389 6.90862e-05L416.7 0L463 26.7721V429.928L407.44 463H0V0.000138172Z"
            fill="var(--green-800)"
          />
        </svg>
        <svg
          className="absolute z-2 inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="clip-shape-2-gradient">
              <path d="M0 0.000138172L108.474 0.000103629C108.474 11.0229 120.32 15.7483 134.931 15.7483C149.543 15.7483 161.389 9.44898 161.389 6.90862e-05L416.7 0L463 26.7721V429.928L407.44 463H0V0.000138172Z" />
            </clipPath>
            <linearGradient
              id="scrim-gradient-2"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <g clipPath="url(#clip-shape-2-gradient)">
            <rect
              x="0"
              y="213"
              width="463"
              height="250"
              fill="url(#scrim-gradient-2)"
              className="origin-bottom group-hover:scale-y-200"
            />
          </g>
        </svg>
      </>
    ),
  },
  {
    id: "shape-3",
    name: "Example Shape 3",
    svg: (imageElement) => (
      <>
        <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="clip-shape-3" clipPathUnits="objectBoundingBox">
              <path
                transform="scale(0.00216, 0.00216)"
                d="M33.5326 0L423.367 2.43871L446.565 22.9327L463 28.6438V436.685L446.747 447.32L423.367 463L33.5326 461.866L13.3721 444.828L0 436.897L0 23.8912H13.8445L33.5326 0Z"
              />
            </clipPath>
          </defs>
        </svg>
        {imageElement && (
          <div
            className="absolute z-1 inset-0 w-full h-full"
            style={{ clipPath: "url(#clip-shape-3)" }}
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
            d="M33.5326 0L423.367 2.43871L446.565 22.9327L463 28.6438V436.685L446.747 447.32L423.367 463L33.5326 461.866L13.3721 444.828L0 436.897L0 23.8912H13.8445L33.5326 0Z"
            fill="var(--red-800)"
          />
        </svg>
        <svg
          className="absolute z-2 inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="clip-shape-3-gradient">
              <path d="M33.5326 0L423.367 2.43871L446.565 22.9327L463 28.6438V436.685L446.747 447.32L423.367 463L33.5326 461.866L13.3721 444.828L0 436.897L0 23.8912H13.8445L33.5326 0Z" />
            </clipPath>
            <linearGradient
              id="scrim-gradient-3"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <g clipPath="url(#clip-shape-3-gradient)">
            <rect
              x="0"
              y="213"
              width="463"
              height="250"
              fill="url(#scrim-gradient-3)"
              className="origin-bottom group-hover:scale-y-200"
            />
          </g>
        </svg>
      </>
    ),
  },
  {
    id: "shape-4",
    name: "Example Shape 4",
    svg: (imageElement) => (
      <>
        <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="clip-shape-4" clipPathUnits="objectBoundingBox">
              <path
                transform="scale(0.00216, 0.00216)"
                d="M0 40.9735L37.5674 0H417.446C426 24.5 439 28 462.941 37.3648L463 415.489L410.335 463L400.27 458.903L37.5674 463L2.92768e-05 422.122L0 40.9735Z"
              />
            </clipPath>
          </defs>
        </svg>
        {imageElement && (
          <div
            className="absolute z-1 inset-0 w-full h-full"
            style={{ clipPath: "url(#clip-shape-4)" }}
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
            d="M0 40.9735L37.5674 0H417.446C426 24.5 439 28 462.941 37.3648L463 415.489L410.335 463L400.27 458.903L37.5674 463L2.92768e-05 422.122L0 40.9735Z"
            fill="var(--copper)"
          />
        </svg>
        <svg
          className="absolute z-2 inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 463 463"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="clip-shape-4-gradient">
              <path d="M0 40.9735L37.5674 0H417.446C426 24.5 439 28 462.941 37.3648L463 415.489L410.335 463L400.27 458.903L37.5674 463L2.92768e-05 422.122L0 40.9735Z" />
            </clipPath>
            <linearGradient
              id="scrim-gradient-4"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="black" stopOpacity="0" />
              <stop offset="100%" stopColor="black" stopOpacity="0.85" />
            </linearGradient>
          </defs>
          <g clipPath="url(#clip-shape-4-gradient)">
            <rect
              x="0"
              y="213"
              width="463"
              height="250"
              fill="url(#scrim-gradient-4)"
              className="origin-bottom group-hover:scale-y-200"
            />
          </g>
        </svg>
      </>
    ),
  },
];
