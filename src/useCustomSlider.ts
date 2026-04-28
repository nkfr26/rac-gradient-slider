import type { RefObject } from "react";
import { useSlider, useLocale, type AriaSliderProps } from "react-aria";
import type { SliderState } from "react-aria-components";
import type { Except } from "type-fest";

type ColorStop = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  value: number;
  color: string;
};

export type CustomSliderProps = Except<AriaSliderProps, "value" | "onChange" | "defaultValue"> & {
  value: ColorStop[];
  onChange: React.Dispatch<React.SetStateAction<ColorStop[]>>;
};

export function useCustomSlider(
  props: CustomSliderProps,
  state: SliderState,
  trackRef: RefObject<Element | null>,
): ReturnType<typeof useSlider> {
  const sliderAria = useSlider(
    {
      ...props,
      value: props.value.map((cs) => cs.value),
      onChange: (value) => {
        props.onChange(props.value.map((cs, i) => ({ ...cs, value: value[i] })));
      },
    },
    state,
    trackRef,
  );
  const { direction } = useLocale();
  const onDownTrack = (clientX: number, clientY: number) => {
    if (
      trackRef.current &&
      !props.isDisabled &&
      state.values.every((_, i) => !state.isThumbDragging(i))
    ) {
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
      props.onChange((prev) =>
        [...prev, { value, id: crypto.randomUUID(), color: "#000000" }].toSorted(
          (a, b) => a.value - b.value,
        ),
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
