import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, StarHalf } from "lucide-react";
import { Testimonial } from "@shared/schema";

export default function TestimonialSection() {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["/api/testimonials"],
  });

  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-neutral-700 max-w-2xl mx-auto">
            Hear from our satisfied clients who have found their dream properties through EstateElite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading
            ? Array(3)
                .fill(null)
                .map((_, index) => (
                  <div key={index} className="bg-neutral-50 p-8 rounded-lg">
                    <div className="text-secondary mb-4 flex">
                      {Array(5)
                        .fill(null)
                        .map((_, i) => (
                          <Skeleton key={i} className="h-5 w-5 mr-1" />
                        ))}
                    </div>
                    <Skeleton className="h-24 w-full mb-6" />
                    <div className="flex items-center">
                      <Skeleton className="h-12 w-12 rounded-full mr-4" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                ))
            : testimonials?.map((testimonial: Testimonial) => (
                <div key={testimonial.id} className="bg-neutral-50 p-8 rounded-lg">
                  <div className="text-secondary mb-4 flex">
                    {Array(5)
                      .fill(null)
                      .map((_, index) => (
                        <Star
                          key={index}
                          className="h-5 w-5 fill-current"
                          fill={index < testimonial.rating ? "currentColor" : "none"}
                        />
                      ))}
                  </div>
                  <p className="text-neutral-700 mb-6">{testimonial.quote}</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <img
                        src={testimonial.imageUrl}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                      <p className="text-neutral-600 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
