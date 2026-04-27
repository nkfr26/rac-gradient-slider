import { useSlider, useLocale } from "react-aria";

export function useCustomSlider(
  ...[props, state, trackRef]: Parameters<typeof useSlider>
): ReturnType<typeof useSlider> {
  const sliderAria = useSlider(props, state, trackRef);
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
      props.onChange?.([...state.values, value].toSorted((a, b) => a - b));
    }
  };
  return {
    ...sliderAria,
    trackProps: {
      ...sliderAria.trackProps,
      onPointerDown(e: React.PointerEvent) {
        if (e.pointerType === "mouse" && (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey)) {
          return;
        }
        onDownTrack(e.clientX, e.clientY);
      },
    },
  };
}
