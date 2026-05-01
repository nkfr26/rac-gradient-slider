import type { RefObject } from "react";
import { useSlider, useLocale, type AriaSliderProps } from "react-aria";
import type { Except } from "type-fest";
import { formatHex, interpolate } from "culori";
import type { ColorStops, useCustomSliderState } from "./useCustomSliderState";

export type CustomSliderProps = Except<AriaSliderProps, "value" | "onChange">;

export function useCustomSlider(
  props: CustomSliderProps,
  state: ReturnType<typeof useCustomSliderState>,
  trackRef: RefObject<Element | null>,
): ReturnType<typeof useSlider> {
  const sliderAria = useSlider(props, state, trackRef);

  const { direction } = useLocale();
  const onDownTrack = (clientX: number, clientY: number) => {
    if (trackRef.current && !props.isDisabled) {
      const { height, width, top, left } = trackRef.current.getBoundingClientRect();
      const isVertical = props.orientation === "vertical";
      const size = isVertical ? height : width;
      const trackPosition = isVertical ? top : left;
      const clickPosition = isVertical ? clientY : clientX;
      const offset = clickPosition - trackPosition;
      let percent = offset / size;
      if (direction === "rtl" || isVertical) {
        percent = 1 - percent;
      }
      const value = state.getPercentValue(percent);
      const interpolator = interpolate(
        state.value.map((cs) => [cs.color, state.getValuePercent(cs.value)]),
        "oklab",
      );
      const color = formatHex(interpolator(state.getValuePercent(value)));
      state.onChange((prev) => {
        return [...prev, { id: crypto.randomUUID(), value, color }].toSorted(
          (a, b) => a.value - b.value,
        ) as ColorStops;
      });
    }
  };

  const generateBackground = () => {
    let to: string;
    if (props.orientation === "vertical") {
      to = "top";
    } else if (direction === "ltr") {
      to = "right";
    } else {
      to = "left";
    }
    const linearColorStop = state.value
      .map(({ color, value }) => `${color} ${state.getValuePercent(value) * 100}%`)
      .join(", ");
    return `linear-gradient(in oklab to ${to}, ${linearColorStop})`;
  };
  return {
    ...sliderAria,
    trackProps: {
      ...sliderAria.trackProps,
      onMouseDown: undefined,
      onTouchStart: undefined,
      onPointerDown(e: React.PointerEvent) {
        if (e.pointerType === "mouse" && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
          return;
        }
        onDownTrack(e.clientX, e.clientY);
      },
      style: {
        ...sliderAria.trackProps.style,
        background: generateBackground(),
      },
    },
  };
}
