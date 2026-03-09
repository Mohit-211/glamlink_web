import Image from "next/image"
import MicroImage from "../../../public/microneedling.png"
export default function HeroSection() {

  return (

    <section className="grid md:grid-cols-2 gap-10 items-center mb-16 mt-20">

      <div>

        <h1 className="text-4xl font-bold mb-4">
          Microneedling
        </h1>

        <p className="text-gray-600 mb-6">
          A curated guide to licensed professionals offering collagen
          stimulating microneedling treatments across Las Vegas.
        </p>

        <button className="bg-cyan-500 text-white px-6 py-3 rounded">
          Explore The Glamlink Edit
        </button>

      </div>

      <Image
        src={MicroImage}
        width={500}
        height={350}
        alt="microneedling"
        className="rounded-lg"
      />

    </section>

  )

}