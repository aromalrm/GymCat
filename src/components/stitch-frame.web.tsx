import { createElement } from "react";

export function StitchFrame({ src }: { src: string }) {
  return createElement("iframe", {
    src,
    title: src,
    style: {
      border: "none",
      width: "100%",
      height: "100vh",
      background: "#0B0F17",
    },
  });
}
