import { motion } from "motion/react";
import { Building2, Globe } from "lucide-react";

export function InternationalClients() {
  const clients = [
    {
      name: "PepsiCo International",
      project: "Commercial Glass Installations",
    },
    {
      name: "Coca-Cola Beverages",
      project: "Refrigeration Display Units",
    },
    {
      name: "Fatima Fertilizers",
      project: "Office Partitions & Windows",
    },
    {
      name: "Zamtax's",
      project: "Factory Glass Installations",
    },
    {
      name: "Askari Flats",
      project: "House Glass & Aluminium Works",
    },
    {
      name: "Shell Pakistan",
      project: "Service Station Installation",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-4"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm">Global Partnerships</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4"
          >
            Trusted by International Companies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-blue-100 max-w-2xl mx-auto"
          >
            We take pride in serving prestigious international brands with our premium glass and
            aluminium solutions
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-black/20 backdrop-blur-lg rounded-lg p-6 border border-white/10 hover:bg-black/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="mb-2 text-white">{client.name}</h3>
                  <p className="text-sm text-blue-200">{client.project}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-blue-200 text-sm">
            And many more leading national and international organizations...
          </p>
        </motion.div>
      </div>
    </section>
  );
}