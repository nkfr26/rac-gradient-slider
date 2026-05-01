import type { RefObject } from "react";
import { useSlider, useLocale, type AriaSliderProps } from "react-aria";
import type { SliderState } from "react-stately";
import type { Except } from "type-fest";
import { formatHex, interpolate } from "culori";

type ColorStop = {
  id: string;
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
  const { value: propsValue, onChange, ...restProps } = props;
  const sliderAria = useSlider(restProps, state, trackRef);

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
      const interpolator = interpolate(
        propsValue.map((cs) => [cs.color, state.getValuePercent(cs.value)]),
        "oklab",
      );
      const color = formatHex(interpolator(state.getValuePercent(value)));
      onChange(
        (prev) =>
          [...prev, { id: crypto.randomUUID(), value, color }].toSorted(
            (a, b) => a.value - b.value,
          ) as ColorStops,
      );
    }
  };

  const generateBackground = () => {
    let to: string;
    if (restProps.orientation === "vertical") {
      to = "top";
    } else if (direction === "ltr") {
      to = "right";
    } else {
      to = "left";
    }
    const linearColorStop = propsValue
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
