import { motion } from "motion/react";
import { Card, CardContent } from "./ui/card";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Ahmed Hassan",
      role: "Property Developer",
      location: "Lahore",
      rating: 5,
      text: "Wazir Glass & Aluminium transformed our commercial building with their exceptional curtain wall installation. The quality of work and attention to detail is outstanding. Highly recommended for large-scale projects!",
    },
    {
      name: "Fatima Khan",
      role: "Homeowner",
      location: "Islamabad",
      rating: 5,
      text: "We had beautiful glass shower cabins installed in our home. The team was professional, punctual, and the finish is absolutely premium. Worth every rupee!",
    },
    {
      name: "Malik Enterprises",
      role: "Corporate Office",
      location: "Karachi",
      rating: 5,
      text: "They completed our office glass partition project ahead of schedule. The modern look they created has impressed all our clients. Their after-sales service is also excellent.",
    },
    {
      name: "Sana Malik",
      role: "Restaurant Owner",
      location: "Lahore",
      rating: 5,
      text: "Our restaurant's aluminium storefront looks stunning! The double-glazed glass keeps the temperature perfect inside. The installation team was very skilled and clean.",
    },
    {
      name: "Imran Ali",
      role: "Architect",
      location: "Faisalabad",
      rating: 5,
      text: "As an architect, I've worked with many glass contractors. Wazir Glass stands out for their technical expertise and ability to execute complex designs perfectly.",
    },
    {
      name: "Zainab Retail Group",
      role: "Chain Store",
      location: "Multan",
      rating: 5,
      text: "They've completed multiple shopfront installations for our retail chain. Consistent quality, reliable timelines, and great customer service. A trusted partner!",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-gray-800">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied clients across Pakistan
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Quote className="w-8 h-8 text-blue-600 mb-4 opacity-50" />
                  <div className="flex mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">{testimonial.text}</p>
                  <div className="border-t pt-4">
                    <p className="text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
