import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Sparkles, Box, Users } from "lucide-react";
import { motion } from "motion/react";

export function Services() {
  const services = [
    {
      icon: Sparkles,
      title: "Glass Works",
      items: [
        "Tempered & Double-Glazed Glass Installation",
        "Shower Cabins & Mirror Fittings",
        "Glass Doors, Windows & Partitions",
        "Custom Cutting & Polishing",
      ],
    },
    {
      icon: Box,
      title: "Aluminium Works",
      items: [
        "Aluminium Sliding Windows & Doors",
        "Curtain Walls & ACP Panels",
        "Shopfronts, Frames & Ceilings",
        "Office Glass Partitions",
      ],
    },
    {
      icon: Users,
      title: "Labour & Installation",
      items: [
        "On-site Fabrication & Fitting",
        "Professional Skilled Labour",
        "Maintenance & Repair Contracts",
      ],
    },
  ];

  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-12 text-gray-800">Our Core Services</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.items.map((item, idx) => (
                        <li key={idx} className="flex items-start text-gray-600">
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
