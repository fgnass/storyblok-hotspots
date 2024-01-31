import { useFieldPlugin } from "@storyblok/field-plugin/react";
import { HotspotFieldContent, isHotspotFieldContent } from "./types";
import { HotspotsField } from "./HotspotsField";

export function App() {
  const { type, data, actions } = useFieldPlugin<HotspotFieldContent>({
    validateContent: (value: unknown) => ({
      content: isHotspotFieldContent(value) ? value : undefined,
    }),
  });
  if (type !== "loaded") {
    return null;
  }
  return <HotspotsField data={data} actions={actions} />;
}
