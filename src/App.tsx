import { useState } from "react";
import { Slider, SliderTrack, SliderThumb } from "./Slider";
import type { ColorStops } from "./useCustomSlider";

function App() {
  const [value, setValue] = useState<ColorStops>([
    { id: crypto.randomUUID(), value: 80, color: "#000000" },
    { id: crypto.randomUUID(), value: 100, color: "#000000" },
  ]);
  return (
    <div className="max-w-4xl mx-auto">
      <div className="font-medium text-base/6 sm:text-sm/6">{JSON.stringify(value)}</div>
      <Slider
        label="Opacity"
        className="group relative flex touch-none select-none flex-col disabled:opacity-50 orientation-horizontal:w-full orientation-horizontal:min-w-fit orientation-horizontal:gap-y-2 orientation-vertical:h-full orientation-vertical:min-h-fit orientation-vertical:w-1.5 orientation-vertical:items-center orientation-vertical:gap-y-2"
        value={value}
        onChange={setValue}
      >
        <SliderTrack className="bg-(--slider-track-bg,var(--color-secondary)) group/track relative cursor-default rounded-full grow group-orientation-horizontal:h-1.5 group-orientation-horizontal:w-full group-orientation-vertical:w-1.5 group-orientation-vertical:flex-1 disabled:cursor-default disabled:opacity-60">
          {value.map((cs, index) => (
            <SliderThumb
              key={cs.id}
              index={index}
              className="top-[50%] left-[50%] size-5 rounded-full border border-fg/10 bg-white outline-hidden ring-black transition-[width,height]"
            />
          ))}
        </SliderTrack>
      </Slider>
    </div>
  );
}

export default App;
