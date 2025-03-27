import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="h-screen flex items-center justify-center relative">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 max-w-4xl mx-auto leading-tight">
          Discover Extraordinary Luxury Residences
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Join our exclusive platform to access premium properties before they hit the market.
        </p>
        <Button 
          size="lg" 
          className="bg-[#E0A458] hover:bg-[#E8BB7D] text-white font-medium text-lg"
          asChild
        >
          <Link href="#waitlist">
            Join the Waitlist
          </Link>
        </Button>
      </div>
    </section>
  );
}
