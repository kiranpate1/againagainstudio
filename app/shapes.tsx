export interface SvgElement {
  id: string;
  name: string;
  svg: () => React.ReactNode;
}

export const shapes: SvgElement[] = [
  {
    id: "shape-1",
    name: "Example Shape 1",
    svg: () => (
      <svg
        className="w-full"
        viewBox="0 0 463 698"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M463 55.6559L463 590.847L441.378 668.085L424.945 697.998L46.2716 698L22.0547 689.727L-1.79667e-07 645.352L2.61114e-05 36.3587L39.3253 25.7054L43.7772 8.74016L117.625 0.00168172L427.107 -1.58856e-06L463 55.6559Z"
          fill="var(--kiln-fire)"
          stroke="var(--bisqueware)"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: "shape-2",
    name: "Example Shape 2",
    svg: () => (
      <svg
        className="w-full"
        viewBox="0 0 463 698"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0.000208303L108.474 0.000156227C108.474 16.6176 120.32 23.7415 134.931 23.7415C149.543 23.7415 161.389 14.2449 161.389 0.000104152L416.7 0L463 40.3605V648.143L407.44 698H0V0.000208303Z"
          fill="var(--copper)"
          stroke="var(--bisqueware)"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: "shape-3",
    name: "Example Shape 3",
    svg: () => (
      <svg
        className="w-full"
        viewBox="0 0 463 698"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M33.5326 0L423.367 3.67649L446.565 34.5723L463 43.1823V643.253L446.747 659.286L423.367 698L33.5326 696.29L13.3721 655.528L0 643.572L0 57.1232H13.8445L33.5326 0Z"
          fill="var(--kiln-fire)"
          stroke="var(--bisqueware)"
          strokeWidth="2"
        />
      </svg>
    ),
  },
  {
    id: "shape-4",
    name: "Example Shape 4",
    svg: () => (
      <svg
        className="w-full"
        viewBox="0 0 463 698"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 61.7699L37.5674 0H397.446C419.74 36.3504 419.298 34.2977 462.941 62.3599L463 626.375L380.335 698L370.27 691.823L37.5674 698L2.92768e-05 636.375L0 61.7699Z"
          fill="var(--copper)"
          stroke="var(--bisqueware)"
          strokeWidth="2"
        />
      </svg>
    ),
  },
];
