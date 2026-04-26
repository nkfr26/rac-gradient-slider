import { createContext, useContext, useRef } from "react";
import {
  type AriaSliderProps,
  useNumberFormatter,
  useSlider,
  mergeProps,
  useSliderThumb,
  useFocusRing,
  VisuallyHidden,
} from "react-aria";
import { useSliderState } from "react-stately";

type SliderContextValue = {
  state: ReturnType<typeof useSliderState>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  trackProps: React.HTMLAttributes<HTMLDivElement>;
};
const SliderContext = createContext<SliderContextValue | null>(null);

function useSliderContext() {
  const ctx = useContext(SliderContext);
  if (!ctx) throw new Error();
  return ctx;
}

type SliderProps = React.HTMLAttributes<HTMLDivElement> & AriaSliderProps;

export function Slider(props: SliderProps) {
  const numberFormatter = useNumberFormatter();
  const state = useSliderState({ ...props, numberFormatter });
  const trackRef = useRef(null);
  const { groupProps, trackProps } = useSlider(props, state, trackRef);
  return (
    <SliderContext.Provider value={{ state, trackRef, trackProps }}>
      <div
        {...mergeProps(props, groupProps)}
        data-disabled={state.isDisabled || undefined}
        data-orientation={state.orientation}
      >
        {props.children}
      </div>
    </SliderContext.Provider>
  );
}

type SliderThumbProps = React.HTMLAttributes<HTMLDivElement> & {
  index: number;
};

export function SliderThumb({ index, ...props }: SliderThumbProps) {
  const { state, trackRef } = useSliderContext();
  const inputRef = useRef(null);
  const { thumbProps, inputProps } = useSliderThumb({ index, trackRef, inputRef }, state);
  const { focusProps } = useFocusRing();
  const zIndex = state.getThumbPercent(index + 1) === 1 ? state.values.length - index : undefined;
  return (
    <div {...mergeProps(props, thumbProps)} style={{ ...thumbProps.style, zIndex }}>
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
}

export function SliderTrack(props: React.HTMLAttributes<HTMLDivElement>) {
  const { state, trackRef, trackProps } = useSliderContext();
  return (
    <div
      {...mergeProps(props, trackProps)}
      ref={trackRef}
      data-orientation={state.orientation}
      data-disabled={state.isDisabled || undefined}
    />
  );
}
