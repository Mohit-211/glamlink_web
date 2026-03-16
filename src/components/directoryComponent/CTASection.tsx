"use client";

export default function CTASection() {
  return (
    <section className="section-glamlink">
      <div className="grid md:grid-cols-2 gap-8">
        {/* JOIN DIRECTORY */}
        <div className="card-glamlink text-center p-10">
          <h3 className="text-2xl font-semibold mb-4">
            Join the Glamlink Directory
          </h3>

          <p className="text-muted-foreground mb-8">
            It’s free and built to help beauty professionals get discovered by
            clients looking for trusted services near them.
          </p>

          <button className="btn-primary">Join For Free</button>
        </div>

        {/* FEATURE IN EDIT */}
        <div className="card-glamlink text-center p-10">
          <h3 className="text-2xl font-semibold mb-4">
            Get Featured In Glamlink Edit
          </h3>

          <p className="text-muted-foreground mb-8">
            Have a treatment, brand, or clinic worth spotlighting? Apply to be
            featured in a future Glamlink editorial issue.
          </p>

          <button className="btn-primary">Apply Now</button>
        </div>
      </div>
    </section>
  );
}
