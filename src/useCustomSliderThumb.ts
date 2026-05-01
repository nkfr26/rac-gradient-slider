import { useSliderThumb, type AriaSliderThumbOptions } from "react-aria";
import type { useCustomSliderState } from "./useCustomSliderState";

export function useCustomSliderThumb(
  opts: AriaSliderThumbOptions,
  state: ReturnType<typeof useCustomSliderState>,
) {
  const sliderThumbAria = useSliderThumb(opts, state);
  const index = opts.index ?? 0;
  return {
    ...sliderThumbAria,
    thumbProps: {
      ...sliderThumbAria.thumbProps,
      style: {
        ...sliderThumbAria.thumbProps.style,
        background: state.value[index].color,
        zIndex: state.getThumbPercent(index + 1) === 1 ? state.values.length - index : undefined,
      },
    },
  };
}
