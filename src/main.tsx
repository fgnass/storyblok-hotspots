import { createRoot } from "react-dom/client";
import { HotspotsField } from "./HotspotsField";
import "./main.css";

const rootNode = document.createElement("main");
document.body.appendChild(rootNode);

createRoot(rootNode).render(<HotspotsField />);

// This error replaces another error which message is harder to understand and impossible to avoid util the issue https://github.com/storyblok/field-plugin/issues/107 has been resolved.
/* throw new Error(
  `This error can be safely ignored. It is caused by the legacy field plugin API. See issue https://github.com/storyblok/field-plugin/issues/107`
);
 */
