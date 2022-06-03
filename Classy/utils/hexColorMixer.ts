/**
 * Adapted from
 * https://github.com/GirkovArpa/hex-color-mixer/blob/master/index.js.
 */

const hex2dec = (hex: string) => {
  return hex
    .replace("#", "")
    .match(/.{2}/g)
    .map((n) => parseInt(n, 16));
};

const rgb2hex = (r: number, g: number, b: number) => {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  r = Math.min(r, 255);
  g = Math.min(g, 255);
  b = Math.min(b, 255);
  return "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("");
};

const mix_rgbs = (rgbs: number[][]) => {
  let r = rgbs.map((rgb) => rgb[0]).reduce((a, b) => a + b, 0) / rgbs.length;
  let g = rgbs.map((rgb) => rgb[1]).reduce((a, b) => a + b, 0) / rgbs.length;
  let b = rgbs.map((rgb) => rgb[2]).reduce((a, b) => a + b, 0) / rgbs.length;

  return [r, g, b];
};

export const mix_hexes = (...hexes: string[]) => {
  let rgbs = hexes.map((hex) => hex2dec(hex));
  let mixture_rgb = mix_rgbs(rgbs);
  let mixture_hex = rgb2hex(...mixture_rgb);
  return mixture_hex;
};
