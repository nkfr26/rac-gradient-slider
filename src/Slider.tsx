import { createContext, useContext, useRef } from "react";
import { useNumberFormatter, mergeProps, useFocusRing, VisuallyHidden } from "react-aria";
import { filterDOMProps } from "react-aria/filterDOMProps";
import { useCustomSlider, type CustomSliderProps } from "./useCustomSlider";
import { useCustomSliderState, type CustomSliderStateOptions } from "./useCustomSliderState";
import type { Except } from "type-fest";
import { useCustomSliderThumb } from "./useCustomSliderThumb";

type SliderContextValue = {
  state: ReturnType<typeof useCustomSliderState>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  trackProps: React.HTMLAttributes<HTMLDivElement>;
};

const SliderContext = createContext<SliderContextValue | null>(null);

function useSliderContext() {
  const ctx = useContext(SliderContext);
  if (!ctx) throw new Error();
  return ctx;
}

type SliderProps = CustomSliderProps &
  Except<CustomSliderStateOptions, "numberFormatter"> &
  Except<React.HTMLAttributes<HTMLDivElement>, "onChange">;

export function Slider(props: SliderProps) {
  const numberFormatter = useNumberFormatter();
  const state = useCustomSliderState({
    ...props,
    numberFormatter,
  });
  const trackRef = useRef<HTMLDivElement | null>(null);
  const { groupProps, trackProps } = useCustomSlider(props, state, trackRef);
  return (
    <SliderContext.Provider value={{ state, trackRef, trackProps }}>
      <div
        {...mergeProps(filterDOMProps(props), groupProps)}
        className={props.className}
        data-orientation={state.orientation}
        data-disabled={state.isDisabled || undefined}
      >
        {props.children}
      </div>
    </SliderContext.Provider>
  );
}

export function SliderTrack(props: React.HTMLAttributes<HTMLDivElement>) {
  const { trackRef, trackProps } = useSliderContext();
  return <div {...mergeProps(props, trackProps)} ref={trackRef} />;
}

type SliderThumbProps = React.HTMLAttributes<HTMLDivElement> & { index: number };

export function SliderThumb({ index, ...props }: SliderThumbProps) {
  const { state, trackRef } = useSliderContext();
  const inputRef = useRef(null);
  const { thumbProps, inputProps, isDragging } = useCustomSliderThumb(
    { index, trackRef, inputRef },
    state,
  );
  const { focusProps } = useFocusRing();
  return (
    <div {...mergeProps(props, thumbProps)} data-dragging={isDragging || undefined}>
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
      {props.children}
    </div>
  );
}
