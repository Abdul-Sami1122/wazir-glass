import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Building2, Users, Award, Clock } from "lucide-react";

function Counter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}</span>;
}

export function Stats() {
  const stats = [
    {
      icon: Clock,
      value: 35,
      suffix: "+",
      label: "Years of Experience",
    },
    {
      icon: Building2,
      value: 2500,
      suffix: "+",
      label: "Projects Completed",
    },
    {
      icon: Users,
      value: 50000,
      suffix: "+",
      label: "Customers Served",
    },
    {
      icon: Award,
      value: 75,
      suffix: "+",
      label: "Skilled Professionals",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <Icon className="w-12 h-12" />
                </div>
                <div className="mb-2">
                  <Counter end={stat.value} />
                  {stat.suffix}
                </div>
                <p className="text-blue-100">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
