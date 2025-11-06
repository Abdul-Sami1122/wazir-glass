import { MapPin, Phone, Mail } from "lucide-react";

// *** UPDATED: Added prop to receive the click handler ***
interface FooterProps {
  onAdminClick: () => void;
}

export function Footer({ onAdminClick }: FooterProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="mb-4">WAZIR GLASS & ALUMINIUM CENTER</h3>
            <p className="text-gray-400">
              Clarity in Design. Strength in Structure.
            </p>
          </div>

          <div>
            <h3 className="mb-4">Quick Links</h3>
            <div className="space-y-2">
              <button
                onClick={() => scrollToSection("home")}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection("process")}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Our Process
              </button>
              <button
                onClick={() => scrollToSection("why-choose-us")}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Why Choose Us
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </button>
            </div>
          </div>

          <div>
            <h3 className="mb-4">Contact Information</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>Akbar Market, Ferozpur Road, Lahore, Pakistan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>0321-8457556</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>wazirglass100@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>Copyright © 2025 Wazir Glass & Aluminium Center. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Designed with excellence • Built with precision • Delivered with care
          </p>
          {/* *** ADDED: Admin Panel Link *** */}
          <div className="mt-4">
            <button
              onClick={onAdminClick}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
