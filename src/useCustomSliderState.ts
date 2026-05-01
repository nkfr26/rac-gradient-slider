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
  const sliderState = useSliderState({
    ...props,
    value: props.value.map((cs) => cs.value),
    onChange: (value) => {
      props.onChange((prev) => prev.map((cs, i) => ({ ...cs, value: value[i] })) as ColorStops);
    },
  });
  return { ...sliderState, value: props.value, onChange: props.onChange };
}
