import { motion } from "motion/react";

export function Brands() {
  const brands = [
    "Saint-Gobain Glass",
    "Guardian Glass",
    "AGC Glass",
    "Schüco Aluminium",
    "YKK AP",
    "Reynaers Aluminium",
    "Pilkington Glass",
    "Kömmerling",
  ];

  return (
    <section className="py-16 bg-white border-y">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-gray-800 mb-2">Trusted Materials & Partners</h3>
          <p className="text-gray-600">
            We work with world-class brands to ensure premium quality
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 items-center">
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center"
            >
              <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <p className="text-gray-600 text-sm">{brand}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
