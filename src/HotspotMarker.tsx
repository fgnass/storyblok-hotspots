import { ComponentPropsWithoutRef } from "react";
import { Hotspot } from "./types";

type Props = Hotspot & {
  index: number;
  color?: string;
} & ComponentPropsWithoutRef<"div">;

export function HotspotMarker({
  x,
  y,
  index,
  color = "#00b3b0",
  ...props
}: Props) {
  return (
    <div
      className="hotspot"
      style={{
        top: y * 100 + "%",
        left: x * 100 + "%",
        backgroundColor: color,
      }}
      {...props}
    >
      {index + 1}
    </div>
  );
}
