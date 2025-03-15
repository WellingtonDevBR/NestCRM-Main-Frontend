
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "NestCRM has completely transformed how we approach customer retention. We identified at-risk accounts weeks before they would have cancelled, saving over $300K in annual revenue.",
    author: "Sarah Johnson",
    title: "Director of Customer Success, TechCorp",
    rating: 5
  },
  {
    quote: "The AI predictions are incredibly accurate. Within two months of implementing NestCRM, we reduced our churn rate by 32% and improved our customer satisfaction scores.",
    author: "Michael Chen",
    title: "VP of Operations, GrowthSaaS",
    rating: 5
  },
  {
    quote: "What impressed me most was how easy it was to integrate with our existing systems. The insights we gained about our customers were immediate and actionable.",
    author: "Priya Patel",
    title: "CTO, DataFlow Systems",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
            Customer Stories
          </div>
          <h2 className="heading-lg mb-6">
            See what our clients have to say about{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              NestCRM
            </span>
          </h2>
          <p className="text-lg text-foreground/70">
            Businesses across industries are using NestCRM to predict and prevent customer churn, leading to increased retention and growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/20 hover:shadow-md transition-all duration-300"
              style={{
                animationDelay: `${index * 0.1}s`,
                animationFillMode: 'both'
              }}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <blockquote className="text-lg mb-6 text-foreground/80 italic">
                "{testimonial.quote}"
              </blockquote>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-foreground/60">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 md:p-12 glass-card max-w-4xl mx-auto text-center">
          <h3 className="heading-md mb-6">Ready to reduce customer churn?</h3>
          <p className="text-lg mb-8 text-foreground/70 max-w-2xl mx-auto">
            Join the businesses that are transforming their customer retention strategies with NestCRM's AI-powered platform.
          </p>
          <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold text-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
            Start Your Free Trial
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
