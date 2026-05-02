import { useRef } from "react";
import { formatHex, interpolate } from "culori";
import { useSliderState, type SliderStateOptions } from "react-stately";
import type { Except } from "type-fest";

type ColorStop = {
  id: string;
  value: number;
  color: string;
};

export type ColorStops = [ColorStop, ColorStop, ...ColorStop[]];

export type CustomSliderStateOptions = Except<
  SliderStateOptions<number[]>,
  "value" | "onChange"
> & {
  value: ColorStops;
  onChange: React.Dispatch<React.SetStateAction<ColorStops>>;
};

export function useCustomSliderState(props: CustomSliderStateOptions) {
  const state = useSliderState({
    ...props,
    value: props.value.map((cs) => cs.value),
    onChange: (value) => {
      props.onChange((prev) => prev.map((cs, i) => ({ ...cs, value: value[i] })) as ColorStops);
    },
  });

  const draggingRef = useRef(new Set<number>());

  const isThumbDragging = (index: number) => {
    return draggingRef.current.has(index);
  };

  const setThumbDragging = (index: number, dragging: boolean) => {
    if (dragging) {
      draggingRef.current.add(index);
    } else {
      draggingRef.current.delete(index);
    }
    state.setThumbDragging(index, dragging);
  };

  const getInterpolatedColor = (value: number, mode: "oklab" | "oklch", filterIndex?: number) => {
    const interpolator = interpolate(
      props.value
        .filter((_, index) => index !== filterIndex)
        .map((cs) => [cs.color, state.getValuePercent(cs.value)]),
      mode,
    );
    return formatHex(interpolator(state.getValuePercent(value)));
  };
  return {
    ...state,
    isThumbDragging,
    setThumbDragging,
    value: props.value,
    onChange: props.onChange,
    getInterpolatedColor,
  };
}
