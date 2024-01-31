import { MouseEvent, useEffect, useState } from "react";

import { useFieldPlugin } from "@storyblok/field-plugin/react";
import { Asset } from "@storyblok/field-plugin";
import { HotspotMarker } from "./HotspotMarker";
import { HotspotImage, isHotspotImage, Hotspot } from "./types";
import { ImageIcon, ReplaceIcon, TrashIcon } from "./icons";

export function HotspotsField() {
  const { type, data, actions } = useFieldPlugin<HotspotImage | null>({
    validateContent: (value: unknown) => ({
      content: isHotspotImage(value) ? value : null,
    }),
  });
  const color = data?.options.color;
  const [asset, setAsset] = useState<Asset | undefined>(data?.content?.asset);
  const [hotSpots, setHotspots] = useState<Hotspot[]>(
    data?.content?.hotspots ?? []
  );
  const [moving, setMoving] = useState<number | null>(null);

  useEffect(() => {
    // Listen on document so we can detect events that happen outside ...
    const stopMoving = () => setMoving(null);
    document.addEventListener("mouseup", stopMoving);
    return () => document.removeEventListener("mouseup", stopMoving);
  });

  if (type !== "loaded") {
    return null;
  }

  const updateHotspots = (update: (prevValue: Hotspot[]) => Hotspot[]) => {
    setHotspots((prevValue) => {
      const newValue = update(prevValue);
      actions.setContent(asset ? { asset, hotspots: newValue } : null);
      return newValue;
    });
  };

  const addHotspot = (ev: MouseEvent<HTMLImageElement>) => {
    const h = getCoords(ev);
    updateHotspots((v) => [...v, h]);
  };

  const deleteHotspot = (index: number) => {
    updateHotspots((v) => [...v.slice(0, index), ...v.slice(index + 1)]);
  };

  const updateHotspot = (index: number, h: Hotspot) => {
    updateHotspots((v) => [...v.slice(0, index), h, ...v.slice(index + 1)]);
  };

  const onMove = (ev: MouseEvent<HTMLElement>) => {
    if (moving !== null) {
      updateHotspot(moving, getCoords(ev));
    }
  };

  const handleSelectAsset = async () => {
    setAsset(await actions.selectAsset());
  };

  const removeAsset = async () => {
    setAsset(undefined);
    setHotspots([]);
    actions.setContent(null);
  };

  if (asset) {
    return (
      <>
        <div
          className="image-wrapper"
          onClick={addHotspot}
          onContextMenu={(ev) => ev.preventDefault()}
          onMouseMove={onMove}
        >
          <img src={asset.filename} draggable={false} />
          {hotSpots.map((h, index) => (
            <HotspotMarker
              {...h}
              key={index}
              index={index}
              color={color}
              onMouseDown={(ev) => {
                if (ev.button === 0) {
                  setMoving(index);
                }
              }}
              onClick={(ev) => ev.stopPropagation()}
              onContextMenu={(ev) => {
                deleteHotspot(index);
                ev.preventDefault();
              }}
            />
          ))}
        </div>
        <div className="footer">
          <div className="hint">
            Click on the image to add hotspots, move them by dragging.
            Right-click to remove.
          </div>
          <div className="btn-group">
            <button onClick={handleSelectAsset}>
              <ReplaceIcon />
            </button>
            <button onClick={removeAsset}>
              <TrashIcon />
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <button className="empty" onClick={handleSelectAsset}>
      <div className="placeholder">
        <ImageIcon />
      </div>
      <div className="label">+ Add Asset</div>
    </button>
  );
}

function round(v: number, precision = 4) {
  const c = Math.pow(10, precision);
  return Math.round(v * c) / c;
}

function clamp(v: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v));
}

function getCoords(ev: MouseEvent<HTMLElement>) {
  const { clientX, clientY, currentTarget } = ev;
  const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = currentTarget;
  const x = round(clamp((clientX - offsetLeft) / offsetWidth));
  const y = round(clamp((clientY - offsetTop) / offsetHeight));
  return { x, y };
}
