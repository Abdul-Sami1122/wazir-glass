import { motion } from "motion/react";
import { MapPin } from "lucide-react";

export function ServiceAreas() {
  const cities = [
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Gujranwala",
    "Sialkot",
    "Karachi",
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-gray-800 mb-2">Service Areas Across Pakistan</h3>
          <p className="text-gray-600">Delivering quality glass and aluminium solutions nationwide</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {cities.map((city, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow"
            >
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">{city}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
