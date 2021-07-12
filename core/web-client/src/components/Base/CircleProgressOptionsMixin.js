import vars from "@/styles/vars.scss";

export default {
  name: "CircleProgressOptionsMixin",
  data: () => ({
    circleOptions: {
      size: 50,
      thickness: 2,
      emptyThickness: 2,
      emptyColor: "rgba(52,96,252, 0.1)",
      fontSize: "0.7rem",
      fontColor: vars.fontPrimaryColor,
      lineCode: { mode: "normal", offset: 0 },
      color: {
        gradient: {
          radial: false,
          direction: "",
          colors: [
            {
              color: vars.circleFrom,
              offset: "00",
              opacity: "0.8",
            },
            {
              color: vars.circleTo,
              offset: "100",
              opacity: "1",
            },
          ],
        },
      },
      colorFill: "transparent",
    },
  }),
};
