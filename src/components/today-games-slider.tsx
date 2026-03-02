import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { NextButton, PrevButton, usePrevNextButtons } from './embla-carousel-arrow-button'
import type {Game} from "@/types/game.ts";
import TodayGameCard from "@/components/today-game-card.tsx";

type PropType = {
  slides: Game[]
  options?: EmblaOptionsType
}

const TodayGameSlider = (props: PropType) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className="embla relative">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex">
          {slides.map((slide, index) => (
            <div className="embla__slide basis-1/2 px-2" key={index}>
              <TodayGameCard game={slide}   isEven={index % 2 === 1} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <PrevButton
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-primary-900 border-0 bg-white shadow-md hover:bg-slate-50"
        onClick={onPrevButtonClick}
        disabled={prevBtnDisabled}
      />

      <NextButton
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-primary-900 border-0 bg-white shadow-md hover:bg-slate-50"
        onClick={onNextButtonClick}
        disabled={nextBtnDisabled}
      />
    </section>

  )
}

export default TodayGameSlider;
