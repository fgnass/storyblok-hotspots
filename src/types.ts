import { isAsset } from "@storyblok/field-plugin";
import { TypeFromSchema, typeGuard, union } from "type-assurance";

const hotspotSchema = {
  x: Number,
  y: Number,
};

export type Hotspot = TypeFromSchema<typeof hotspotSchema>;

const hotspotImageSchema = {
  asset: isAsset,
  hotspots: [hotspotSchema],
};

export type HotspotImage = TypeFromSchema<typeof hotspotImageSchema>;
export const isHotspotImage = typeGuard(union(hotspotImageSchema, null));
