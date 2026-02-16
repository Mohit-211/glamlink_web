'use client'

import Image from 'next/image'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import phone1 from '../../../public/assets/phone1.jpg'
import phone2 from '../../../public/assets/phone2.jpg'
import phone3 from '../../../public/assets/phone3.jpg'

const images = [phone1, phone2, phone3]

const PhoneMockups = () => {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">

      {/* Gradient Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/60 via-background to-background" />

      <div className="container-glamlink">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Your All-In-One <span className="gradient-text">Beauty Platform</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to discover, connect, and shop — all in one beautiful experience.
          </p>
        </div>

        {/* Phone Showcase */}
        <div className="relative flex items-center justify-center mb-20">

          {/* Glow Effect Behind Center */}
          <div className="absolute w-[300px] h-[300px] bg-primary/20 blur-[120px] rounded-full -z-10 " />

          <div className="flex items-end justify-center gap-10 lg:gap-30">

            {images.map((image, index) => {
              const isCenter = index === 1

              return (
                <div
                  key={index}
                  className={`
          relative transition-all duration-700 ease-out
          ${isCenter
                      ? 'scale-110 z-20'
                      : 'scale-95 opacity-90'}
          ${index === 0 ? '-mr-16 lg:-mr-24' : ''}
          ${index === 2 ? '-ml-16 lg:-ml-24' : ''}
        `}
                >
                  {/* 👇 THIS is the important fix */}
                  <div className="relative w-[260px] sm:w-[280px] lg:w-[320px] aspect-[9/18]
">

                    <Image
                      src={image}
                      alt={`Phone ${index}`}
                      fill
                      className="object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.25)]"
                      priority={isCenter}
                    />

                  </div>
                </div>
              )
            })}

          </div>

        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="px-8 py-6 text-lg btn-hero gap-3 shadow-lg hover:scale-105 transition-transform duration-300">
            <Download className="w-6 h-6" />
            Download Glamlink
          </Button>
        </div>

      </div>
    </section>
  )
}

export default PhoneMockups
