import { Award, Gem, Palette, Clock, HeadphonesIcon } from "lucide-react";
import { motion } from "motion/react";

export function WhyChooseUs() {
  const features = [
    {
      icon: Award,
      title: "Experienced & Skilled Team",
      description: "Years of expertise in glass and aluminium craftsmanship",
    },
    {
      icon: Gem,
      title: "Premium Materials & Finishing",
      description: "Only the highest quality materials for lasting results",
    },
    {
      icon: Palette,
      title: "Customized Design Solutions",
      description: "Tailored designs that match your unique vision",
    },
    {
      icon: Clock,
      title: "On-Time Project Delivery",
      description: "We respect your time and meet all deadlines",
    },
    {
      icon: HeadphonesIcon,
      title: "After-Sales Support & Maintenance",
      description: "Ongoing support to keep your installations pristine",
    },
  ];

  return (
    <section id="why-choose-us" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-12 text-gray-800">
          Why Choose Wazir Glass & Aluminium Center
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4"
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
