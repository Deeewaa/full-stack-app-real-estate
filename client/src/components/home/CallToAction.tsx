import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
          Ready to Find Your Dream Property?
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
          Join our exclusive platform and get access to the world's most extraordinary properties.
        </p>
        <Button 
          size="lg"
          className="px-8 py-4 bg-[#E0A458] hover:bg-[#E8BB7D] text-white text-lg border-0"
          asChild
        >
          <Link href="#waitlist">
            Join the Waitlist Today
          </Link>
        </Button>
      </div>
    </section>
  );
}
