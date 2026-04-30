import { createContext, useContext, useRef, type ReactNode } from "react";
import {
  useNumberFormatter,
  mergeProps,
  useSliderThumb,
  useFocusRing,
  VisuallyHidden,
} from "react-aria";
import { filterDOMProps } from "react-aria/filterDOMProps";
import { useSliderState, type SliderStateOptions } from "react-stately";
import { useCustomSlider, type ColorStops, type CustomSliderProps } from "./useCustomSlider";
import type { Except } from "type-fest";

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

type SliderProps = CustomSliderProps &
  Except<SliderStateOptions<number[]>, "value" | "onChange" | "numberFormatter"> & {
    className: string;
    children: ReactNode;
  };

export function Slider(props: SliderProps) {
  const numberFormatter = useNumberFormatter();
  const state = useSliderState({
    ...props,
    value: props.value.map((cs) => cs.value),
    onChange: (value) => {
      props.onChange((prev) => prev.map((cs, i) => ({ ...cs, value: value[i] })) as ColorStops);
    },
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

type SliderThumbProps = React.HTMLAttributes<HTMLDivElement> & { index: number };

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
      {props.children}
    </div>
  );
}
