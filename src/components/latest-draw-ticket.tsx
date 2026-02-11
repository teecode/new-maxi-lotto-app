import type { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import type { LatestDrawTicketResponse } from '@/types/api'
import { NextButton, PrevButton, usePrevNextButtons } from './embla-carousel-arrow-button'
import LatestDrawCard from './latest-draw-card'
import React from "react";

type PropType = {
  slides: LatestDrawTicketResponse[]
  options?: EmblaOptionsType
}

const LatestDrawTicket = (props: PropType) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className="embla !max-w-full">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide, index) => (
            <div className="embla__slide" style={{ "--slide-size": "100%", "--slide-size-sm": "50%", "--slide-size-lg": "33.333%" } as React.CSSProperties} key={index}>
              <LatestDrawCard item={slide} />
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton
            className='!bg-white/20 !backdrop-blur-sm !border !border-white/30 text-white hover:!bg-white/35 transition-all duration-200 !shadow-md'
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          />
          <NextButton
            className='!bg-white/20 !backdrop-blur-sm !border !border-white/30 text-white hover:!bg-white/35 transition-all duration-200 !shadow-md'
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          />
        </div>
      </div>
    </section>
  )
}

export default LatestDrawTicket;
