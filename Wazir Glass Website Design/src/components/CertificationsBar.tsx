import { motion } from "motion/react";
import { Shield, Award, CheckCircle, Star } from "lucide-react";

export function CertificationsBar() {
  const certifications = [
    { icon: Shield, text: "ISO Certified Quality" },
    { icon: Award, text: "Award-Winning Designs" },
    { icon: CheckCircle, text: "100% Client Satisfaction" },
    { icon: Star, text: "Premium Grade Materials" },
  ];

  return (
    <div className="bg-gray-900 text-white py-4 border-y border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-center gap-2 text-sm"
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span className="text-gray-300">{cert.text}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
