import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const ProfessionalsCTA = () => {
  return (
    <section className="w-full bg-gradient-to-r from-[#1fa2b6] to-[#1b8ea5] py-20">
      <div className="max-w-5xl mx-auto px-6 text-center text-white">

        {/* Heading */}
        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
          Your Future in Beauty Starts Here
        </h2>

        {/* Subheading */}
        <p className="text-lg lg:text-xl text-white/80 mb-10">
          Join the first 100 founding professionals and shape the future of beauty commerce.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">

          {/* Primary */}
          <Button className="bg-gray-100 text-[#1b8ea5] hover:bg-white px-10 py-6 text-lg font-semibold rounded-full shadow-md">
            Become a Founding Pro
          </Button>

          {/* Secondary */}
          <Button
            variant="outline"
            className="border-2 border-white text-white hover:bg-white/10 px-10 py-6 text-lg rounded-full gap-2"
          >
            Access E-Commerce Panel
            <ArrowRight className="w-5 h-5" />
          </Button>

        </div>

        {/* Helper Text */}
        <p className="text-white/70 text-sm mt-8">
          Limited spots available • No credit card required to start
        </p>

      </div>
    </section>
  )
}

export default ProfessionalsCTA
