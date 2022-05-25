import randomColor from "randomcolor";

export default (amount = 1000, hue = "blue") => [
  "#137efc",
  "#6b3afd",
  "#009374",
  ...randomColor({
    hue,
    seed: "#0b2bbc",
    count: amount,
  }),
];
