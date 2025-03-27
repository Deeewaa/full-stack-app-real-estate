import { useRef } from "react";
import WaitlistForm from "@/components/waitlist/WaitlistForm";

export default function WaitlistSection() {
  const formRef = useRef<HTMLDivElement>(null);
  
  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section id="waitlist" className="py-20 bg-primary relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
        }}
      ></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12" ref={formRef}>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-6">
                Join Our Exclusive Waitlist
              </h2>
              <p className="text-lg text-neutral-700 mb-8">
                Be the first to access our platform when we launch. Get early access to premium listings and special benefits reserved for founding members.
              </p>
              
              <WaitlistForm />
            </div>
            
            <div 
              className="hidden lg:block bg-cover bg-center"
              style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1605146769289-440113cc3d00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')"
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
