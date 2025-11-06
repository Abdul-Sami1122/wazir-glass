import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Badge } from "./ui/badge";

export function Portfolio() {
  const projects = [
    {
      title: "Modern Office Partitions",
      category: "Commercial",
      image:
        "https://images.unsplash.com/photo-1758691737278-3af15b37af48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBnbGFzcyUyMHBhcnRpdGlvbnxlbnwxfHx8fDE3NjE5MDgxMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Sleek glass partitions for corporate offices",
    },
    {
      title: "Luxury Shower Cabins",
      category: "Residential",
      image:
        "https://images.unsplash.com/photo-1706670368974-af427a98e816?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMHNob3dlciUyMGNhYmluJTIwYmF0aHJvb218ZW58MXx8fHwxNzYxOTA4MTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Premium tempered glass shower enclosures",
    },
    {
      title: "Commercial Storefront",
      category: "Commercial",
      image:
        "https://images.unsplash.com/photo-1658678524027-91e52c4bf079?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtaW5pdW0lMjBzdG9yZWZyb250JTIwd2luZG93fGVufDF8fHx8MTc2MTkwODEyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Aluminium shopfront with double-glazed glass",
    },
    {
      title: "Glass Entrance Doors",
      category: "Commercial",
      image:
        "https://images.unsplash.com/photo-1760306657411-4afdc65ba0a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGRvb3IlMjBlbnRyYW5jZSUyMGNvbW1lcmNpYWx8ZW58MXx8fHwxNzYxOTA4MTI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Elegant glass door installations",
    },
    {
      title: "Curtain Wall System",
      category: "Industrial",
      image:
        "https://images.unsplash.com/photo-1559354484-587384b2badc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBidWlsZGluZyUyMGZhY2FkZXxlbnwxfHx8fDE3NjE4Mjg2MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "High-rise building facade installation",
    },
    {
      title: "Glass Railing Systems",
      category: "Residential",
      image:
        "https://images.unsplash.com/photo-1760451266023-2b27d382fa3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMHJhaWxpbmclMjBiYWxjb255fGVufDF8fHx8MTc2MTkwODEyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Modern glass balcony and stair railings",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="mb-4 text-gray-800">Our Portfolio</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of completed projects across residential, commercial, and
            industrial sectors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="relative h-[300px] overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Badge className="mb-2 bg-blue-600">{project.category}</Badge>
                <h3 className="mb-2">{project.title}</h3>
                <p className="text-sm text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
