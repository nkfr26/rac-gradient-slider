import type { RefObject } from "react";
import { useSlider, useLocale, type AriaSliderProps } from "react-aria";
import type { SliderState } from "react-aria-components";
import type { Except } from "type-fest";

type ColorStop = {
  id: ReturnType<typeof crypto.randomUUID>;
  value: number;
  color: string;
};

export type ColorStops = [ColorStop, ColorStop, ...ColorStop[]];

export type CustomSliderProps = Except<AriaSliderProps, "value" | "onChange" | "defaultValue"> & {
  value: ColorStops;
  onChange: React.Dispatch<React.SetStateAction<ColorStops>>;
};

export function useCustomSlider(
  props: CustomSliderProps,
  state: SliderState,
  trackRef: RefObject<Element | null>,
): ReturnType<typeof useSlider> {
  const { onChange, ...restProps } = props;
  const sliderAria = useSlider(
    {
      ...restProps,
      value: restProps.value.map((cs) => cs.value),
    },
    state,
    trackRef,
  );
  const { direction } = useLocale();
  const onDownTrack = (clientX: number, clientY: number) => {
    if (trackRef.current && !restProps.isDisabled) {
      const { height, width, top, left } = trackRef.current.getBoundingClientRect();
      const isVertical = restProps.orientation === "vertical";
      const size = isVertical ? height : width;
      const trackPosition = isVertical ? top : left;
      const clickPosition = isVertical ? clientY : clientX;
      const offset = clickPosition - trackPosition;
      let percent = offset / size;
      if (direction === "rtl" || isVertical) {
        percent = 1 - percent;
      }
      const value = state.getPercentValue(percent);
      onChange(
        (prev) =>
          [...prev, { value, id: crypto.randomUUID(), color: "#000000" }].toSorted(
            (a, b) => a.value - b.value,
          ) as ColorStops,
      );
    }
  };
  return {
    ...sliderAria,
    trackProps: {
      ...sliderAria.trackProps,
      onMouseDown: undefined,
      onPointerDown(e: React.PointerEvent) {
        if (e.pointerType === "mouse" && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
          return;
        }
        onDownTrack(e.clientX, e.clientY);
      },
      onTouchStart: undefined,
    },
  };
}
