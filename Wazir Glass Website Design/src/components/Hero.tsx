import { Button } from "./ui/button";
import { motion } from "motion/react";

interface HeroProps {
  onOpenQuote: () => void;
}

export function Hero({ onOpenQuote }: HeroProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative h-[600px] md:h-[700px] flex items-center justify-center text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1634412114581-6376e49ef8e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnbGFzcyUyMGJ1aWxkaW5nJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTgzODgxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-gray-900/80"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 max-w-4xl mx-auto"
        >
          Clarity in Design. Strength in Structure.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-2 max-w-3xl mx-auto text-gray-100"
        >
          Leading provider of architectural glass and aluminium solutions across Pakistan,
          specializing in high-quality, modern, and durable structures.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8 text-blue-200"
        >
          For Residential, Commercial & Industrial Clients
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => scrollToSection("services")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            View Our Services
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onOpenQuote}
            className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20"
          >
            Get a Free Quote
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
