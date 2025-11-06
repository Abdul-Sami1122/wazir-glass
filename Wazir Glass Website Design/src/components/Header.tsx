import { Phone, Menu, X, FileText } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onOpenQuote: () => void;
}

// Re-usable class strings for styling the buttons
const buttonClasses = {
  base: "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  size: "h-10 px-4 py-2",
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-50",
  ghost: "hover:bg-gray-100 hover:text-gray-900",
  icon: "h-10 w-10",
};

export function Header({ onOpenQuote }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "process", label: "Our Process" },
    { id: "why-choose-us", label: "Why Choose Us" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            
            {/* --- Logo Area --- */}
            <div className="flex items-center space-x-2">
              <div className="text-blue-600">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="4" y="4" width="24" height="24" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 4 L16 28" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 16 L28 16" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              
              {/* --- Company Name: Hidden on mobile, shown on desktop (lg and up) --- */}
              <span className="inline max-lg:hidden text-gray-800">
                WAZIR GLASS & ALUMINIUM CENTER
              </span>
            </div>

            {/* --- Desktop Navigation (Hidden on mobile) --- */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* --- Buttons Area --- */}
            <div className="flex items-center gap-2">
              
              {/* --- Desktop-Only Buttons (Hidden on mobile) --- */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={onOpenQuote}
                  className={`${buttonClasses.base} ${buttonClasses.size} ${buttonClasses.outline}`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Get Quote
                </button>
                <a
                  href="tel:+923218457556"
                  className={`${buttonClasses.base} ${buttonClasses.size} ${buttonClasses.primary}`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +92 321-8457556
                </a>
              </div>

              {/* --- Mobile-Only Hamburger Menu (Hidden on desktop) --- */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className={`${buttonClasses.base} ${buttonClasses.icon} ${buttonClasses.ghost} lg:hidden`}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* --- Mobile Menu Side Panel --- */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu Content */}
          <div className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              {/* --- Company Name in Mobile Menu --- */}
              <span className="font-semibold text-gray-800">Wazir Glass & Aluminium Center</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className={`${buttonClasses.base} ${buttonClasses.icon} ${buttonClasses.ghost} -mr-2`}
              >
                <span className="sr-only">Close menu</span>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* --- Navigation Links and Buttons inside the mobile menu --- */}
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-gray-600 hover:text-blue-600 transition-colors py-2 text-lg"
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t pt-6 space-y-3">
                <button
                  onClick={() => {
                    onOpenQuote();
                    setMobileMenuOpen(false);
                  }}
                  className={`${buttonClasses.base} ${buttonClasses.size} ${buttonClasses.primary} w-full`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Get Quote
                </button>
                <a
                  href="tel:+923218457556"
                  className={`${buttonClasses.base} ${buttonClasses.size} ${buttonClasses.outline} w-full`}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +92 321-8457556
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}