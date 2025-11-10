import { Button } from "../ui/button";
import {
  Printer,
  Download,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: QuotationItem[];
  subtotal: number;
  discount?: number;
  discountAmount?: number;
  taxRate: number; // This remains from the interface, but won't be used in totals
  taxAmount: number; // This remains from the interface, but won't be used in totals
  total: number;
  notes: string;
}

interface QuotationPreviewProps {
  quotation: Quotation;
}

export function QuotationPreview({ quotation }: QuotationPreviewProps) {
  const openPrintWindow = () => {
    const printContent = document.getElementById("quotation-content")?.innerHTML;
    const printStyles = document.getElementById("print-styles")?.innerHTML;

    const printWindow = window.open("", "_blank", "height=800,width=800");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Quotation ${quotation.quotationNumber}</title>
            <style>${printStyles}</style>
          </head>
          <body>
            ${printContent || ""}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const handlePrint = () => {
    openPrintWindow();
  };

  const handleDownload = () => {
    openPrintWindow();
  };

  const handleSendToWhatsApp = () => {
    let phone = quotation.customerPhone;
    if (!phone) {
      toast.error("No customer phone number found for this quotation.");
      return;
    }

    toast.info("Please 'Save as PDF' first, then attach it in WhatsApp.");
    handleDownload();

    if (phone.startsWith("0")) {
      phone = "92" + phone.substring(1);
    }
    phone = phone.replace(/[^0-9]/g, "");

    const message = `
Assalam-O-Alikum ${quotation.customerName},

Please find your quotation summary from Wazir Glass & Aluminium Centre attached.
-----------------------------------
Quotation No: *${quotation.quotationNumber}*
Total Amount: *PKR ${quotation.total?.toFixed(2)}*
-----------------------------------

Thank you!
    `;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    setTimeout(() => {
      window.open(url, "_blank");
    }, 1500);
  };

  // Helper variables for conditional rendering
  const discountAmount = Number(quotation.discountAmount) || 0;
  // Tax is no longer calculated, but we check if it exists from old data
  const taxAmount = Number(quotation.taxAmount) || 0;

  return (
    <div className="space-y-4 p-1">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-gray-800">Quotation Preview</h2>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSendToWhatsApp}
            variant="outline"
            className="bg-green-50 text-green-700 hover:bg-green-100"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Send to WhatsApp
          </Button>
          <Button
            onClick={handleDownload}
            variant="outline"
            className="bg-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div
        id="quotation-content"
        className="bg-white p-8 border rounded-lg print:border-0 print:p-4"
      >
        <header className="text-center mb-8">
          <h1 className="text-blue-600 text-3xl font-bold mb-1">
            Wazir Glass & Aluminium Centre
          </h1>
          <p className="text-lg text-gray-500 font-light">
            Renovate Repair Restore
          </p>
        </header>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              QUOTE TO:
            </h3>
            <p className="font-bold text-gray-800">
              {quotation.customerName}
            </p>
            <p className="text-sm text-gray-600">
              {quotation.customerAddress}
            </p>
            <p className="text-sm text-gray-600">
              {quotation.customerPhone}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">
              QUOTE FROM:
            </h3>
            <p className="font-bold text-gray-800">
              Wazir Glass & Aluminium Centre
            </p>
            <p className="text-sm text-gray-600">
              Akbar Market, Ferozpur Road, Lahore
            </p>
            <p className="text-sm text-gray-600">0321-8457556</p>

            <div className="border-t my-3"></div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Quotation No:</span>
              <span className="font-medium text-gray-800">
                {quotation.quotationNumber}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium text-gray-800">
                {new Date(quotation.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="text-left p-3 rounded-tl-lg">Sr.#</th>
                <th className="text-left p-3">Description</th>
                <th className="text-center p-3">Qty</th>
                <th className="text-center p-3">Unit</th>
                <th className="text-right p-3">Rate (PKR)</th>
                <th className="text-right p-3 rounded-tr-lg">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quotation.items?.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="p-3 text-gray-600">{index + 1}</td>
                  <td className="p-3 text-gray-800">{item.description}</td>
                  <td className="p-3 text-center">
                    {Number(item.quantity).toFixed(2)}
                  </td>
                  <td className="p-3 text-center uppercase">{item.unit}</td>
                  <td className="p-3 text-right">
                    {Number(item.rate).toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-medium">
                    {Number(item.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-3">
            {quotation.notes && (
              <div className="bg-gray-50 p-4 rounded-lg h-full">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Notes / Terms & Conditions:
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {quotation.notes}
                </p>
              </div>
            )}
          </div>

          <div className="col-span-2">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">
                  PKR {quotation.subtotal?.toFixed(2) || "0.00"}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between py-2 border-b text-green-600">
                  <span>Discount ({quotation.discount?.toFixed(2)}%):</span>
                  <span className="font-medium">
                    - PKR {discountAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Tax amount removed from calculation, but shown if exists */}
              {taxAmount > 0 && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">
                    Tax ({quotation.taxRate}%):
                  </span>
                  <span className="font-medium">
                    PKR {taxAmount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-3 bg-blue-50 px-4 rounded-lg">
                <span className="text-lg font-bold text-gray-800">
                  Total Amount:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  PKR {quotation.total?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <p className="text-gray-600 mb-16">Very truly yours,</p>
          <div className="border-t border-gray-400 w-64 pt-2">
            <p className="font-medium">For Wazir Glass & Aluminium Centre</p>
          </div>
        </div>

        <footer className="border-t-2 border-blue-600 pt-6 mt-12 text-center text-gray-600">
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm">
                Akbar Market, Ferozpur Road, Kalma Chowk, Lahore
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              <span className="text-sm">0321-8457556</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-sm">wazirglasscentre@gmail.com</span>
            </div>
          </div>
          
          {/* --- ADDED NOTE --- */}
          <p className="text-xs text-gray-500 mt-4 italic">
            Note: Prices are estimates and subject to change based on market rates and final measurements.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This is a computer-generated quotation.
          </p>
        </footer>
      </div>

      {/* Print styles - unchanged */}
      <style id="print-styles">
        {`
          @media print {
            @page {
              size: A4;
              margin: 0.5in;
            }
            body {
              font-family: Arial, sans-serif !important;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              font-size: 10pt;
              font-weight: 400 !important;
            }
            #quotation-content { 
              padding: 0 !important;
              border: 0 !important;
            }
            .print\\:hidden { display: none !important; }
            .print\\:border-0 { border: 0 !important; }
            .print\\:p-4 { padding: 0 !important; }
            h1, h3, h4, p, span, div, td, th {
              font-family: Arial, sans-serif !important;
              font-weight: 400 !important;
            }
            h1 { font-size: 22pt !important; font-weight: 700 !important; margin-bottom: 0.25rem !important; }
            h3 { font-size: 10pt !important; font-weight: 700 !important; margin-bottom: 0.5rem !important; }
            h4 { font-size: 9pt !important; font-weight: 700 !important; margin-bottom: 0.5rem !important; }
            p { font-size: 9pt !important; margin: 0; }
            span { font-size: 9pt !important; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 1rem !important; }
            th { font-size: 10pt !important; padding: 0.5rem !important; font-weight: 700 !important; }
            td { font-size: 9pt !important; padding: 0.5rem !important; vertical-align: top; }
            .font-bold, .font-semibold, .font-medium,
            .text-lg.font-bold, .font-medium.text-gray-800 {
              font-weight: 700 !important;
            }
            .font-light, .text-gray-500, .text-gray-600, .text-sm {
              font-weight: 400 !important;
            }
            td.font-medium {
              font-weight: 700 !important;
            }
            .grid { display: grid !important; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
            .col-span-2 { grid-column: span 2 / span 2 !important; }
            .col-span-3 { grid-column: span 3 / span 3 !important; }
            .gap-8 { gap: 1.5rem !important; }
            .mb-8 { margin-bottom: 1.5rem !important; }
            .mt-12 { margin-top: 2rem !important; }
            .mt-20 { margin-top: 3rem !important; }
            .mb-16 { margin-bottom: 2.5rem !important; }
            .text-center { text-align: center; }
            .text-right { text-align: right !important; }
            .text-left { text-align: left; }
            .text-blue-600 { color: #2563eb !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-800 { color: #1f2937 !important; }
            .text-green-600 { color: #16a34a !important; }
            .text-white { color: #ffffff !important; }
            .bg-gray-50 { background-color: #f9fafb !important; }
            .bg-blue-50 { background-color: #eff6ff !important; }
            .bg-blue-600 { background-color: #2563eb !important; }
            .p-4 { padding: 1rem !important; }
            .p-3 { padding: 0.75rem !important; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .pt-6 { padding-top: 1.5rem !important; }
            .pt-2 { padding-top: 0.5rem; }
            .rounded-lg { border-radius: 0.5rem !important; }
            .rounded-tl-lg { border-top-left-radius: 0.5rem !important; }
            .rounded-tr-lg { border-top-right-radius: 0.5rem !important; }
            .border-t { border-top-width: 1px !important; }
            .border-b { border-bottom-width: 1px !important; }
            .border-t-2 { border-top-width: 2px !important; }
            .border-blue-600 { border-color: #2563eb !important; }
            .border-gray-400 { border-color: #9ca3af !important; }
            .divide-y > :not([hidden]) ~ :not([hidden]) { border-top-width: 1px; border-color: #e5e7eb !important; }
            .w-full { width: 100%; }
            .w-64 { width: 16rem; }
            .h-full { height: 100%; }
            .flex { display: flex !important; }
            .items-center { align-items: center !important; }
            .justify-between { justify-content: space-between !important; }
            .justify-center { justify-content: center !important; }
            .gap-6 { gap: 1.5rem !important; }
            .gap-2 { gap: 0.5rem !important; }
            .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem !important; }
            .whitespace-pre-wrap { white-space: pre-wrap !important; }
            .uppercase { text-transform: uppercase !important; }
            .italic { font-style: italic !important; } 
            .mt-4 { margin-top: 1rem !important; }
            .mt-2 { margin-top: 0.5rem !important; }
            svg {
              width: 12px !important;
              height: 12px !important;
              display: inline-block !important;
              vertical-align: middle !important;
            }
            tr, td, th { page-break-inside: avoid !important; }
            div, section, header, footer { page-break-inside: avoid !important; }
            footer { page-break-before: auto !important; }
          }
        `}
      </style>
    </div>
  );
}
