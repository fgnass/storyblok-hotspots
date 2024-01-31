import { isAsset } from "@storyblok/field-plugin";
import { TypeFromSchema, optional, typeGuard } from "type-assurance";

const hotspotSchema = {
  x: Number,
  y: Number,
};

export type Hotspot = TypeFromSchema<typeof hotspotSchema>;

const imageSchema = {
  asset: isAsset,
  hotspots: [hotspotSchema],
};
export type HotspotImage = TypeFromSchema<typeof imageSchema>;

const contentSchema = optional(imageSchema);
export type HotspotFieldContent = TypeFromSchema<typeof contentSchema>;
export const isHotspotFieldContent = typeGuard(contentSchema);
