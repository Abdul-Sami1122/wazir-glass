// src/components/admin/AdminDashboard.tsx
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Plus,
  List,
  DollarSign,
  Calculator,
  FileSignature,
  ClipboardList,
  Menu,
} from "lucide-react";
import { BillCreate } from "@/components/admin/BillCreate";
import { BillsList } from "@/components/admin/BillsList";
import { DiscountCalculator } from "@/components/admin/DiscountCalculator";
import api from "@/api";
import { toast } from "sonner";
import { QuotationCreate } from "@/components/admin/QuotationCreate";
import { QuotationsList } from "@/components/admin/QuotationsList";

// Types
interface Quotation {
  _id: string;
  quotationNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: any[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  notes: string;
  status: "pending" | "accepted" | "rejected";
}

interface Bill {
  _id: string;
  billNumber: string;
  date: string;
  customerName: string;
  items: any[];
  total: number;
  status: "pending" | "paid" | "cancelled";
}

interface AdminDashboardProps {
  onLogout: () => void;
}

type View =
  | "dashboard"
  | "create-bill"
  | "bills-list"
  | "calculator"
  | "create-quotation"
  | "quotations-list";

interface StatData {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [stats, setStats] = useState<StatData[]>([]);
  const [recentQuotations, setRecentQuotations] = useState<Quotation[]>([]);
  const [recentBills, setRecentBills] = useState<Bill[]>([]);
  const [quotationToConvert, setQuotationToConvert] =
    useState<Quotation | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Load Dashboard Stats
  const loadStats = async () => {
    try {
      const [billsRes, quotationsRes] = await Promise.all([
        api.get("/api/bills"),
        api.get("/api/quotations"),
      ]);

      const bills: Bill[] = billsRes.data;
      const quotations: Quotation[] = quotationsRes.data;

      const sortedQuotations = [...quotations]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const sortedBills = [...bills]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentQuotations(sortedQuotations);
      setRecentBills(sortedBills);

      const newStats = [
        {
          title: "Total Bills",
          value: bills.length,
          icon: FileText,
          color: "bg-blue-600",
        },
        {
          title: "Total Quotations",
          value: quotations.length,
          icon: FileSignature,
          color: "bg-teal-600",
        },
        {
          title: "Pending Bills",
          value: bills.filter((bill) => bill.status === "pending").length,
          icon: DollarSign,
          color: "bg-orange-600",
        },
        {
          title: "Pending Quotations",
          value: quotations.filter((q) => q.status === "pending").length,
          icon: ClipboardList,
          color: "bg-yellow-600",
        },
      ];
      setStats(newStats);
    } catch (error) {
      console.error(error);
      toast.error("Could not load dashboard stats.");
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    if (currentView === "dashboard") {
      loadStats();
    }
  }, [currentView]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    onLogout();
  };

  const handleConvertToBill = (quotation: Quotation) => {
    setQuotationToConvert(quotation);
    setCurrentView("create-bill");
  };

  const handleSetView = (view: View) => {
    if (view === "create-bill" || view === "create-quotation") {
      setQuotationToConvert(null);
    }
    setCurrentView(view);
    setIsSheetOpen(false);
  };

  // Sidebar & Drawer Nav Buttons
  const navButtons = (
    <>
      <Button
        variant={currentView === "dashboard" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => handleSetView("dashboard")}
      >
        <LayoutDashboard className="w-4 h-4 mr-2" />
        Dashboard
      </Button>
      <Button
        variant={currentView === "create-quotation" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => handleSetView("create-quotation")}
      >
        <FileSignature className="w-4 h-4 mr-2" />
        Create Quotation
      </Button>
      <Button
        variant={currentView === "quotations-list" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => handleSetView("quotations-list")}
      >
        <ClipboardList className="w-4 h-4 mr-2" />
        All Quotations
      </Button>
      <Button
        variant={currentView === "create-bill" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => handleSetView("create-bill")}
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Bill
      </Button>
      <Button
        variant={currentView === "bills-list" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => handleSetView("bills-list")}
      >
        <List className="w-4 h-4 mr-2" />
        All Bills
      </Button>
      <Button
        variant={currentView === "calculator" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => handleSetView("calculator")}
      >
        <Calculator className="w-4 h-4 mr-2" />
        Aluminum Calculator
      </Button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {/* Mobile Drawer */}
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                    <SheetDescription className="sr-only">
                      Main navigation menu for the admin panel.
                    </SheetDescription>
                  </SheetHeader>
                  <nav className="mt-4 space-y-2">{navButtons}</nav>
                </SheetContent>
              </Sheet>

              {/* Title */}
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Wazir Glass & Aluminium Center
                </h1>
                <p className="text-sm text-gray-600 hidden md:block">
                  Admin Panel
                </p>
              </div>
            </div>

            {/* Logout Buttons */}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="icon"
              className="sm:hidden"
            >
              <LogOut className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hidden sm:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {currentView === "dashboard" && (
              <div className="space-y-6">
                {/* ---- DASHBOARD OVERVIEW ---- */}
                <div>
                  <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
                    Dashboard Overview
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {stats.length > 0 ? (
                      stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                          <Card
                            key={index}
                            className="shadow-sm hover:shadow-md transition rounded-xl"
                          >
                            <CardContent className="pt-4 sm:pt-6">
                              <div className="flex items-center justify-between gap-2">
                                <div className="truncate">
                                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                                    {stat.title}
                                  </p>
                                  <p className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">
                                    {stat.value}
                                  </p>
                                </div>
                                <div
                                  className={`w-8 h-8 sm:w-12 sm:h-12 ${stat.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                                >
                                  <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    ) : (
                      <p>Loading stats...</p>
                    )}
                  </div>
                </div>

                {/* ---- QUICK ACTIONS ---- */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Get started with common tasks
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                    <Button
                      onClick={() => handleSetView("create-quotation")}
                      className="bg-blue-600 hover:bg-blue-700 flex-1 min-w-[150px]"
                    >
                      <FileSignature className="w-4 h-4 mr-2" />
                      New Quotation
                    </Button>
                    <Button
                      onClick={() => handleSetView("create-bill")}
                      className="bg-blue-600 hover:bg-blue-700 flex-1 min-w-[150px]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Bill
                    </Button>
                  </CardContent>
                </Card>

                {/* ---- RECENT QUOTATIONS ---- */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Recent Quotations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 overflow-x-auto rounded-md border border-gray-100 bg-white">
                    <div className="min-w-[380px] sm:min-w-0">
                      <QuotationsList
                        compact
                        quotations={recentQuotations}
                        onViewQuotation={() =>
                          handleSetView("quotations-list")
                        }
                        onQuotationUpdate={loadStats}
                        onConvertToBill={handleConvertToBill}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* ---- RECENT BILLS ---- */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">
                      Recent Bills
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6 overflow-x-auto rounded-md border border-gray-100 bg-white">
                    <div className="min-w-[380px] sm:min-w-0">
                      <BillsList
                        compact
                        bills={recentBills}
                        onViewBill={() => handleSetView("bills-list")}
                        onBillUpdate={loadStats}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === "create-quotation" && (
              <QuotationCreate submissionData={null} />
            )}

            {currentView === "quotations-list" && (
              <div className="overflow-x-auto">
                <QuotationsList
                  onQuotationUpdate={loadStats}
                  onConvertToBill={handleConvertToBill}
                />
              </div>
            )}

            {currentView === "create-bill" && (
              <BillCreate quotationData={quotationToConvert} />
            )}

            {currentView === "bills-list" && (
              <div className="overflow-x-auto">
                <BillsList onBillUpdate={loadStats} />
              </div>
            )}

            {currentView === "calculator" && (
              <Card>
                <CardHeader>
                  <CardTitle>Aluminum Division Calculator</CardTitle>
                  <CardDescription>
                    Calculate individual panel widths for windows and doors.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DiscountCalculator />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden md:block md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">{navButtons}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
