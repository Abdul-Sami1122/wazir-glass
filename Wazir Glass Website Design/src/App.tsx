import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { InternationalClients } from "./components/InternationalClients";
import { CertificationsBar } from "./components/CertificationsBar";
import { Services } from "./components/Services";
import { Stats } from "./components/Stats";
import { Portfolio } from "./components/Portfolio";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Process } from "./components/Process";
import { Brands } from "./components/Brands";
import { VisionMission } from "./components/VisionMission";
import { Testimonials } from "./components/Testimonials";
import { EmergencyContact } from "./components/EmergencyContact";
import { ServiceAreas } from "./components/ServiceAreas";
import { FAQ } from "./components/FAQ";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { BackToTop } from "./components/BackToTop";
import { QuoteDialog } from "./components/QuoteDialog";
import { Toaster } from "./components/ui/sonner";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { Button } from "./components/ui/button";
import { Shield } from "lucide-react";
import { WhatsAppButton } from "./components/WhatsAppButton";

type AppMode = "public" | "admin";

export default function App() {
  const [mode, setMode] = useState<AppMode>("public");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }

    if (window.location.hash === "#admin") {
      setMode("admin");
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setMode("public");
    window.location.hash = "";
  };

  const switchToAdmin = () => {
    setMode("admin");
    window.location.hash = "admin";
  };

  const switchToPublic = () => {
    setMode("public");
    window.location.hash = "";
  };

  // Admin Panel
  if (mode === "admin") {
    if (!isAuthenticated) {
      return (
        <>
          <AdminLogin onLogin={handleLogin} />
          <div className="fixed bottom-4 left-4">
            <Button onClick={switchToPublic} variant="outline" size="sm">
              ← Back to Website
            </Button>
          </div>
          <Toaster />
        </>
      );
    }

    return (
      <>
        <AdminDashboard onLogout={handleLogout} />
        <Toaster />
      </>
    );
  }

  // Public Website
  return (
    <div className="min-h-screen">
      <Header onOpenQuote={() => setQuoteDialogOpen(true)} />
      <Hero onOpenQuote={() => setQuoteDialogOpen(true)} />
      <CertificationsBar />
      <Services />
      <Stats />
      <Portfolio />
      <WhyChooseUs />
      <Process />
      <Brands />
      <VisionMission />
      <InternationalClients />
      <Testimonials />
      <EmergencyContact />
      <ServiceAreas />
      <FAQ />
      <Contact />
      {/* *** UPDATED: Passed the switchToAdmin function as a prop *** */}
      <Footer onAdminClick={switchToAdmin} />
      <BackToTop />
      <WhatsAppButton />
      <QuoteDialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen} />
      
      {/* *** REMOVED: Floating Admin Button is gone *** */}
      
      <Toaster />
    </div>
  );
}
