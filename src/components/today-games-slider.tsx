import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { NextButton, PrevButton, usePrevNextButtons } from "./embla-carousel-arrow-button";
import type { Game } from "@/types/game.ts";
import TodayGameCard from "@/components/today-game-card.tsx";

type PropType = {
  slides: Game[];
  options?: EmblaOptionsType;
};

const TodayGameSlider = (props: PropType) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    watchDrag: true,
    dragFree: true,
    ...options,
  });

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  // If 4 or fewer games, render a balanced responsive grid instead of a half-empty carousel
  if (slides.length <= 4) {
    return (
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {slides.map((slide, index) => (
            <TodayGameCard key={slide.gameID} game={slide} isEven={index % 2 === 1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container relative">
      <div className="embla relative">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container flex -ml-4">
            {slides.map((slide, index) => (
              <div
                className="embla__slide shrink-0 grow-0 basis-[84%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-4"
                key={slide.gameID}
              >
                <TodayGameCard game={slide} isEven={index % 2 === 1} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <PrevButton
          className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 text-primary-900 border border-slate-200 bg-white shadow-lg hover:bg-slate-50"
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
        />

        <NextButton
          className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-primary-900 border border-slate-200 bg-white shadow-lg hover:bg-slate-50"
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
        />
      </div>
    </div>
  );
};

export default TodayGameSlider;
