import { Eye, Target } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function VisionMission() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1708164333499-a662f62bef0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbGFzcyUyMGN1cnRhaW4lMjB3YWxsJTIwb2ZmaWNlfGVufDF8fHx8MTc2MTkwNzE2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Modern glass architecture"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-gray-800">Our Vision</h2>
              </div>
              <p className="text-gray-600 pl-16">
                To be Pakistan's most trusted name in innovative glass and aluminium craftsmanship.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-gray-800">Our Mission</h2>
              </div>
              <p className="text-gray-600 pl-16">
                To deliver modern, strong, and aesthetic solutions that redefine structural elegance
                and durability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
