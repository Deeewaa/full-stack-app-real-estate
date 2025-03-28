import { useEffect, useRef } from "react";
import { Link } from "wouter";

export default function DiscoverSection() {
  const countersRef = useRef<HTMLDivElement>(null);
  
  // Animation for counters
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll("[data-count]");
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute("data-count") || "0");
            const duration = 2000; // duration in milliseconds
            const steps = 60;
            const stepTime = duration / steps;
            const increment = target / steps;
            let current = 0;
            
            const updateCounter = () => {
              current += increment;
              if (current < target) {
                counter.textContent = Math.ceil(current).toString();
                setTimeout(updateCounter, stepTime);
              } else {
                counter.textContent = target.toString();
              }
            };
            
            updateCounter();
          });
          
          observer.unobserve(entry.target);
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersect, options);
    
    if (countersRef.current) {
      observer.observe(countersRef.current);
    }
    
    return () => {
      if (countersRef.current) {
        observer.unobserve(countersRef.current);
      }
    };
  }, []);
  
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              alt="Luxury Home Interior" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
              Discover Your Dream Home
            </h2>
            <p className="text-lg text-neutral-700 mb-8">
              EstateElite provides access to the world's most extraordinary homes. Our curated selection of luxury properties represents the finest in architectural design, premium locations, and exceptional amenities.
            </p>
            
            <div ref={countersRef} className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-neutral-50 p-5 rounded-lg">
                <div className="text-accent text-3xl font-bold mb-2">
                  <span data-count="5000">0</span>+
                </div>
                <p className="text-neutral-600">Premium Properties</p>
              </div>
              <div className="bg-neutral-50 p-5 rounded-lg">
                <div className="text-accent text-3xl font-bold mb-2">
                  <span data-count="120">0</span>+
                </div>
                <p className="text-neutral-600">Locations Worldwide</p>
              </div>
              <div className="bg-neutral-50 p-5 rounded-lg">
                <div className="text-accent text-3xl font-bold mb-2">
                  <span data-count="98">0</span>%
                </div>
                <p className="text-neutral-600">Client Satisfaction</p>
              </div>
              <div className="bg-neutral-50 p-5 rounded-lg">
                <div className="text-accent text-3xl font-bold mb-2">
                  <span data-count="250">0</span>+
                </div>
                <p className="text-neutral-600">Elite Agents</p>
              </div>
            </div>
            
            <Link href="/contact" className="inline-flex items-center text-primary font-medium hover:text-primary-light transition-all">
              Learn More About Us 
              <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
