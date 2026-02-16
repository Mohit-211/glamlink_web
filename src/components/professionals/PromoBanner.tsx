import { ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

const PromoBanner = () => {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="relative overflow-hidden rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.15)]">
          
          {/* Gradient Background */}
          <div className="bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600
 px-8 py-20 text-center  relative">

            {/* Dotted pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            {/* Floating soft glow */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col items-center">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6">
                <Clock className="w-4 h-4" />
                Limited Time Offer
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Join Now, Pay Less
              </h2>

              {/* Subtext */}
              <p className="text-lg text-white/80 max-w-2xl mb-10">
                Sign up today and benefit from introductory platform fees.
              </p>

              {/* CTA */}
              <Button className="bg-white text-primary hover:bg-white/90 px-10 py-6 text-lg font-semibold rounded-full shadow-xl gap-2">
                Start Selling
                <ArrowRight className="w-5 h-5" />
              </Button>

              {/* Small Footer Text */}
              <p className="text-white/70 text-sm mt-6">
                No setup fees • Instant approval • Cancel anytime
              </p>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

export default PromoBanner
