import { Phone, Clock } from "lucide-react";

export function EmergencyContact() {
  return (
    // Reduced vertical padding from py-16 to py-12 for a more 'normal' height
    <div
      className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12 shadow-lg"
    >
      <div className="container mx-auto px-4">
        {/* Increased gap from gap-10 to gap-12 for more breathing space */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* --- Left Side: Info --- */}
          {/* Increased gap (gap-5) between icon and text */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Made icon larger (w-16 h-16) and increased bg opacity (bg-white/30) */}
            <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              {/* Made heading larger and bolder (text-2xl font-bold) */}
              <h3 className="text-2xl font-bold mb-1">
                Emergency Glass Repair Service
              </h3>
              {/* Made subheading slightly larger and clearer */}
              <p className="text-base text-orange-100 opacity-95">
                24/7 available for urgent repairs and replacements
              </p>
            </div>
          </div>

          {/* --- Right Side: Call to Action Button --- */}
          {/* - Updated href="tel:" with the +92 number.
            - Updated the visible text to "+92 321-8457556".
            - Set button height to h-12 (from h-14) for a more 'normal' height.
            - Made font bold.
            - Added smoother transition (duration-300 ease-in-out).
            - Increased shadow (shadow-xl) and hover shadow (hover:shadow-2xl).
            - Increased icon margin (mr-3).
          */}
          <a
            href="tel:+923218457556"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-lg font-bold ring-offset-background transition-all duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-orange-600 hover:bg-gray-100 h-12 px-10 shadow-xl hover:shadow-2xl transform hover:scale-105"
          >
            &nbsp;
            <Phone className="w-5 h-5 mr-3" />
              &nbsp; Call Now: +92 321-8457556
              &nbsp;
          </a>

        </div>
      </div>
    </div>
  );
}

