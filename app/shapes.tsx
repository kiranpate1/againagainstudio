export interface SvgElement {
  id: string;
  name: string;
  svg: (color: string) => React.ReactNode;
}

export const shapes: SvgElement[] = [
  {
    id: "icon-1",
    name: "Example Icon 1",
    svg: (color: string) => (
      <svg
        className="w-full"
        viewBox="0 0 175 294"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 8.7738e-05L41 6.58035e-05C41 6.9994 45.4772 10 51 10C56.5228 10 61 6 61 4.3869e-05L157.5 0L175 17V273L154 294H0V8.7738e-05Z"
          fill={`var(--${color})`}
        />
      </svg>
    ),
  },
  {
    id: "icon-2",
    name: "Example Icon 2",
    svg: (color: string) => (
      <svg
        className="w-full"
        viewBox="0 0 231 431"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M114.54 431C51.2814 431 1.27978 377.035 1.27978 313.629L0 114.805C0 51.4 44.1524 0 114.54 0C177.799 0 229.08 44.9863 229.08 108.391L231 316.195C231 379.6 186.848 431 114.54 431Z"
          fill={`var(--${color})`}
        />
      </svg>
    ),
  },
  {
    id: "icon-3",
    name: "Example Icon 3",
    svg: (color: string) => (
      <svg
        className="w-full"
        viewBox="0 0 230 339"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 30L43.5 0H187.5L225.5 40L230 294.5L179 339L174 336L43.5 339L1.45435e-05 294.5L0 30Z"
          fill={`var(--${color})`}
        />
      </svg>
    ),
  },
  {
    id: "icon-4",
    name: "Example Icon 4",
    svg: (color: string) => (
      <svg
        className="w-full"
        viewBox="0 0 154 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 243.967L0.000157595 12.9836L10.7845 2.38037L18.9806 9.15527e-05H130.922L143 2.38037L154 15.1474L154 218L136.098 228.387L128.765 237.476L95.3333 259.98H17.902L0 243.967Z"
          fill={`var(--${color})`}
        />
      </svg>
    ),
  },
  {
    id: "icon-5",
    name: "Example Icon 5",
    svg: (color: string) => (
      <svg
        className="w-full"
        viewBox="0 0 211 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.0638177 319.89L0 33.4652H25.7271L38.0538 28.9148L63.1089 6.57474L78.9283 0L128.835 1.84274L146.719 9.66193L165.381 25.7112L186.046 34.3792L210.713 33.4652L210.777 309.535L22.1342 313.54L18.6725 319.714L0.0638177 319.89Z"
          fill={`var(--${color})`}
        />
      </svg>
    ),
  },
];
