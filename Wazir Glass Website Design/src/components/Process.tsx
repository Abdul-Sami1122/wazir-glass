import { Ruler, FileText, Hammer, Settings, CheckCircle } from "lucide-react";

export function Process() {
  const steps = [
    {
      icon: Ruler,
      title: "Site Survey & Measurement",
      description: "Accurate assessment of your space and requirements",
    },
    {
      icon: FileText,
      title: "Design & Material Finalization",
      description: "Collaborative planning to perfect your vision",
    },
    {
      icon: Hammer,
      title: "In-House Fabrication",
      description: "Precision crafting in our modern facility",
    },
    {
      icon: Settings,
      title: "Expert Installation",
      description: "Professional on-site fitting by skilled technicians",
    },
    {
      icon: CheckCircle,
      title: "Quality Inspection & After-Sales Support",
      description: "Thorough checks and ongoing maintenance",
    },
  ];

  return (
    <section id="process" className="py-16 bg-gradient-to-br from-blue-50 to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-center mb-12 text-gray-800">Our Process</h2>
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 -translate-x-1/2"></div>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`relative flex items-center mb-12 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  } flex-col`}
                >
                  <div
                    className={`md:w-1/2 ${
                      isEven ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"
                    } text-center mb-4 md:mb-0`}
                  >
                    <h3 className="mb-2 text-gray-800">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  <div className="relative z-10 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="md:w-1/2"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
