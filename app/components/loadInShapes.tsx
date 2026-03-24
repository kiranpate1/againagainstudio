export interface SvgElement {
  id: string;
  name: string;
  svg: () => SVGSVGElement;
}

function makeSvg(
  width: string,
  height: string,
  viewBox: string,
  d: string,
  fill: string,
): SVGSVGElement {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("class", "w-[0.9ch] -translate-x-1/2 -translate-y-1/2");
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("fill", "none");
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", fill);
  svg.appendChild(path);
  return svg;
}

export const loadInShapes: SvgElement[] = [
  {
    id: "shape1",
    name: "Shape 1",

    svg: () =>
      makeSvg(
        "230",
        "317",
        "0 0 230 317",
        "M116.458 -4.95077e-06C179.717 -2.18564e-06 229.719 53.9655 229.719 117.371L180.999 316.195L91.4985 316.195L116.458 219.5C55.4985 219.5 -0.00148764 172.5 -0.00148512 114.805C-0.0014826 57.1101 44.1509 -8.11143e-06 116.458 -4.95077e-06Z",
        "var(--tile)",
      ),
  },
  {
    id: "shape2",
    name: "Shape 2",
    svg: () =>
      makeSvg(
        "319",
        "266",
        "0 0 319 266",
        "M30.9709 197.689V0H179.631L319 252.545V266H187L179.631 257.72L171.372 266H30.9709L0 217.354L30.9709 197.689Z",
        "var(--charm)",
      ),
  },
  {
    id: "shape3",
    name: "Shape 3",
    svg: () =>
      makeSvg(
        "257",
        "517",
        "0 0 257 517",
        "M159.537 516.829H18.9742L116.217 257.224L0 231.025V0H256.152V166.719L159.537 516.829Z",
        "var(--glaze)",
      ),
  },
  {
    id: "shape4",
    name: "Shape 4",
    svg: () =>
      makeSvg(
        "431",
        "231",
        "0 0 431 231",
        "M0 114.54C0 51.2814 53.9655 1.27978 117.371 1.27978L316.195 0C379.6 0 431 44.1524 431 114.54C431 177.799 386.014 229.08 322.609 229.08L114.805 231C51.4 231 0 186.848 0 114.54Z",
        "var(--copper)",
      ),
  },
  {
    id: "shape5",
    name: "Shape 5",
    svg: () =>
      makeSvg(
        "338",
        "262",
        "0 0 338 262",
        "M338 0H58.6946V6.0695H45.9891L0 85.694L16.1916 90.0309V101.158L39.4671 124.425H62.7425V262H338V237.722L300.557 168.934L318.772 148.703L338 143.645V131.506L300.557 111.274V90.0309L338 21.2432V0Z",
        "var(--purple)",
      ),
  },
  {
    id: "shape6",
    name: "Shape 6",
    svg: () =>
      makeSvg(
        "104",
        "116",
        "0 0 104 116",
        "M0 0H98.129L104 4.2029V113.478L98.9677 116H60.3871V98.3478H50.3226V116H1.67742L0 110.957V0Z",
        "var(--blue-vibrant)",
      ),
  },
];
