import { useState } from "react";
import "./App.css";
import { Slider, SliderTrack, SliderThumb } from "./Slider";

function App() {
  const [value, setValue] = useState([0, 50, 100]);
  return (
    <>
      <div className="text-white">{value.toString()}</div>
      <Slider
        label="Opacity"
        className="group relative flex touch-none select-none flex-col disabled:opacity-50 orientation-horizontal:w-full orientation-horizontal:min-w-fit orientation-horizontal:gap-y-2 orientation-vertical:h-full orientation-vertical:min-h-fit orientation-vertical:w-1.5 orientation-vertical:items-center orientation-vertical:gap-y-2"
        value={value}
        onChange={(v) => setValue(v as number[])}
      >
        <SliderTrack className="bg-(--slider-track-bg,var(--color-secondary)) group/track relative cursor-default rounded-full grow group-orientation-horizontal:h-1.5 group-orientation-horizontal:w-full group-orientation-vertical:w-1.5 group-orientation-vertical:flex-1 disabled:cursor-default disabled:opacity-60">
          <SliderThumb
            index={0}
            className="top-[50%] left-[50%] size-5 rounded-full border border-fg/10 bg-white outline-hidden ring-black transition-[width,height]"
          />
          <SliderThumb
            index={1}
            className="top-[50%] left-[50%] size-5 rounded-full border border-fg/10 bg-white outline-hidden ring-black transition-[width,height]"
          />
          <SliderThumb
            index={2}
            className="top-[50%] left-[50%] size-5 rounded-full border border-fg/10 bg-white outline-hidden ring-black transition-[width,height]"
          />
        </SliderTrack>
      </Slider>
    </>
  );
}

export default App;
