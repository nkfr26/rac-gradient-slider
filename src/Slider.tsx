import { useSliderState } from "react-stately";

import {
  mergeProps,
  useFocusRing,
  useNumberFormatter,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
  type AriaSliderProps,
  type AriaSliderThumbOptions,
} from "react-aria";
import React from "react";

type SliderProps = AriaSliderProps & {
  formatOptions?: Intl.NumberFormatOptions;
  name?: string;
};

export function Slider(props: SliderProps) {
  let trackRef = React.useRef(null);
  let numberFormatter = useNumberFormatter(props.formatOptions);
  let state = useSliderState({ ...props, numberFormatter });
  let { groupProps, trackProps, labelProps, outputProps } = useSlider(props, state, trackRef);

  return (
    <div {...groupProps} className={`slider ${state.orientation}`}>
      {/* Create a container for the label and output element. */}
      {props.label && (
        <div className="label-container">
          <label {...labelProps}>{props.label}</label>
          <output {...outputProps}>{state.getThumbValueLabel(0)}</output>
        </div>
      )}
      {/* The track element holds the visible track line and the thumb. */}
      <div {...trackProps} ref={trackRef} className={`track ${state.isDisabled ? "disabled" : ""}`}>
        <Thumb index={0} state={state} trackRef={trackRef} name={props.name} />
      </div>
    </div>
  );
}

type ThumbProps = Omit<AriaSliderThumbOptions, "inputRef"> & {
  state: ReturnType<typeof useSliderState>;
};

function Thumb(props: ThumbProps) {
  let { state, trackRef, index = 0, name } = props;
  let inputRef = React.useRef(null);
  let { thumbProps, inputProps, isDragging } = useSliderThumb(
    {
      index,
      trackRef,
      inputRef,
      name,
    },
    state,
  );

  let zIndex = state.getPercentValue(index + 1) === 1 ? state.values.length - index : undefined;

  let { focusProps, isFocusVisible } = useFocusRing();
  return (
    <div
      {...thumbProps}
      style={{ ...thumbProps.style, zIndex }}
      className={`thumb ${isFocusVisible ? "focus" : ""} ${isDragging ? "dragging" : ""}`}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
}
