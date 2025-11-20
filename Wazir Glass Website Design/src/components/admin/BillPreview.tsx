import { Button } from "../ui/button";
import { Printer, Download, MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner";
// --- NEW IMPORTS ---
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
// --------------------

interface BillItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

interface Bill {
  id: string;
  billNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: BillItem[];
  subtotal: number;
  discount?: number;
  discountAmount?: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountReceived?: number;
  remainingAmount?: number;
  notes: string;
  status: "pending" | "paid" | "advanced";
}

interface BillPreviewProps {
  bill: Bill;
}

export function BillPreview({ bill }: BillPreviewProps) {
  // --- UPDATED PRINT FUNCTION (with .onload fix) ---
  const openPrintWindow = () => {
    const printContent = document.getElementById('bill-content')?.innerHTML;
    const printStyles = document.getElementById('print-styles')?.innerHTML;
    
    const printWindow = window.open('', '_blank', 'height=800,width=800');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${bill.billNumber}</title>
            <style>${printStyles || ''}</style>
          </head>
          <body>
            ${printContent || ''}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // *** THIS IS THE FIX ***
      // Wait for the window to be fully loaded before printing
      printWindow.onload = function() {
        printWindow.focus(); // Focus the window
        printWindow.print(); // Open print dialog
      };
    }
  }

  const handlePrint = () => {
    openPrintWindow();
  };

  // --- NEW HELPER FUNCTION FOR PDF GENERATION ---
  const generateBillPdf = async (): Promise<jsPDF | null> => {
    const billContentElement = document.getElementById('bill-content');
    if (!billContentElement) {
      toast.error("Bill content not found.");
      return null;
    }
    
    toast.info("Generating PDF, please wait...");

    // Temporarily hide non-print elements for cleaner capture
    const buttonsContainer = document.querySelector('.flex.justify-between.items-center');
    if (buttonsContainer) {
      (buttonsContainer as HTMLElement).style.display = 'none';
    }

    try {
      const canvas = await html2canvas(billContentElement, {
        scale: window.devicePixelRatio > 1 ? 2 : 1.5, // Adaptive scale
        useCORS: true,
        backgroundColor: '#ffffff',
        // Capture the full scrollable height/width
        width: billContentElement.scrollWidth,
        height: billContentElement.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: billContentElement.scrollWidth,
        windowHeight: billContentElement.scrollHeight
      });

      // Restore buttons
      if (buttonsContainer) {
        (buttonsContainer as HTMLElement).style.display = '';
      }
      
      const imgData = canvas.toDataURL('image/png');
      
      // Use Letter paper dimensions (8.5" x 11")
      const pdfWidth = 215.9; // Letter width in mm
      const pdfHeight = 279.4; // Letter height in mm
      
      // *** FIX: Reduce margin to minimize left/right whitespace ***
      const margin = 5; 
      
      // Initialize PDF with 'letter' size
      const pdf = new jsPDF('p', 'mm', 'letter');
      const imgProps = pdf.getImageProperties(imgData);

      // Calculate image dimensions to fit PDF width (maintains aspect ratio)
      const pdfImgWidth = pdfWidth - (margin * 2); // Fit within margins
      const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

      let heightLeft = pdfImgHeight;
      let yPosition = margin; // Start drawing at the top margin

      // --- MULTI-PAGE LOGIC ---
      // Add the first page
      pdf.addImage(imgData, 'PNG', margin, yPosition, pdfImgWidth, pdfImgHeight);
      heightLeft -= (pdfHeight - margin); // Subtract the height of one page (minus top margin)

      // Loop and add new pages if the content is taller than one page
      while (heightLeft > 0) {
        yPosition = -heightLeft + margin; // "Slide" the image up by the remaining height, plus top margin
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, yPosition, pdfImgWidth, pdfImgHeight);
        heightLeft -= (pdfHeight - margin * 2); // Subsequent pages have top/bottom margins
      }
      
      return pdf;

    } catch (err) {
      // Restore buttons even on error
      if (buttonsContainer) {
        (buttonsContainer as HTMLElement).style.display = '';
      }
      toast.error("Failed to generate PDF.");
      console.error(err);
      return null;
    }
  };


  // --- UPDATED DOWNLOAD FUNCTION (now uses helper) ---
  const handleDownload = async () => {
    const pdf = await generateBillPdf();
    
    if (!pdf) {
      return; // Error toast already shown in helper
    }

    try {
      const fileName = `Invoice-${bill.billNumber || 'bill'}.pdf`;
      pdf.save(fileName);
      toast.success("PDF Downloaded!");
    } catch (err) {
      toast.error("Failed to save PDF.");
      console.error(err);
    }
  };

  // --- UPDATED WHATSAPP FUNCTION (now uses helper) ---
  const handleSendToWhatsApp = async () => {
    let phone = bill.customerPhone;
    if (!phone) {
      toast.error("No customer phone number found for this bill.");
      return;
    }

    try {
      // Generate the PDF first
      const pdf = await generateBillPdf();
      if (!pdf) {
        return; // Error handled in helper
      }
      
      // Generate blob from the PDF
      const pdfBlob = pdf.output('blob');
      const fileName = `Invoice-${bill.billNumber || 'bill'}.pdf`;
      
      // Prepare share data
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      const message = `Assalam-O-Alikum ${bill.customerName},
Please find your bill summary from Wazir Glass & Aluminium Centre attached.
-----------------------------------
Bill No: ${bill.billNumber}
Total Amount: PKR ${bill.total?.toFixed(2)}
Remaining Amount: PKR ${bill.remainingAmount?.toFixed(2) || "0.00"}
-----------------------------------
Thank you!`;
      
      // Check if Web Share API (with file support) is available
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        // Use Web Share API for native sharing (works best on mobile)
        const shareData = {
          title: `Invoice ${bill.billNumber}`,
          text: message,
          files: [file]
        };
        await navigator.share(shareData);
        toast.success("Shared via native share!");
        
      } else {
        // Fallback for desktop: Download and open WhatsApp Web
        pdf.save(fileName);
        toast.info("PDF downloaded. Open WhatsApp to attach the file.");
        
        // Open wa.me link as a secondary action
        if (phone.startsWith("0")) {
          phone = "92" + phone.substring(1);
        }
        phone = phone.replace(/[^0-9]/g, '');
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        setTimeout(() => {
          window.open(url, '_blank');
        }, 1500); // Give a small delay for the download toast
      }
      
    } catch (err) {
      // Catch errors from navigator.share or other issues
      toast.error("Failed to share file.");
      console.error(err);
      
      // Fallback to original behavior (just open wa.me link)
      if (phone.startsWith("0")) {
        phone = "92" + phone.substring(1);
      }
      phone = phone.replace(/[^0-9]/g, '');
      const message = `Assalam-O-Alikum ${bill.customerName},
Please find your bill summary from Wazir Glass & Aluminium Centre.
-----------------------------------
Bill No: *${bill.billNumber}*
Total Amount: *PKR ${bill.total?.toFixed(2)}*
Remaining Amount: *PKR ${bill.remainingAmount?.toFixed(2) || "0.00"}*
-----------------------------------
Thank you!`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  };

  // Helper variables for conditional rendering
  const discountAmount = Number(bill.discountAmount) || 0;
  const taxAmount = Number(bill.taxAmount) || 0;
  const amountReceived = Number(bill.amountReceived) || 0;
  const formattedDate = new Date(bill.date).toLocaleDateString('en-GB');

  return (
    // The DialogContent itself is now scrollable
    <div className="space-y-4 p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 print:hidden">
        <h2 className="text-gray-800 text-base sm:text-lg">Bill Preview</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
          <Button onClick={handleSendToWhatsApp} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 flex-1 sm:flex-none min-w-[140px]">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send to WhatsApp
          </Button>
          <Button onClick={handleDownload} variant="outline" className="bg-white flex-1 sm:flex-none min-w-[100px]">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none min-w-[100px]">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>
      
      {/* This is the content that will be captured for PDF/Print */}
      <div id="bill-content" className="bg-white p-4 sm:p-8 border rounded-lg print:border-0 print:p-4 overflow-hidden">
        
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-blue-600 text-2xl sm:text-3xl font-bold mb-1">
            Wazir Glass & Aluminium Centre
          </h1>
          <p className="text-base sm:text-lg text-gray-500 font-light">
            Renovate Repair Restore
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-6 lg:mb-8">
          <div className="p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">BILL TO:</h3>
            <p className="font-bold text-gray-800 text-sm sm:text-base">{bill.customerName}</p>
            <p className="text-xs sm:text-sm text-gray-600">{bill.customerAddress}</p>
            <p className="text-xs sm:text-sm text-gray-600">{bill.customerPhone}</p>
          </div>
          
          <div className="p-3 sm:p-4">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">BILL FROM:</h3>
            <p className="font-bold text-gray-800 text-sm sm:text-base">Wazir Glass & Aluminium Centre</p>
            <p className="text-xs sm:text-sm text-gray-600">Akbar Market, Ferozpur Road, Kalma Chowk, Lahore</p>
            <p className="text-xs sm:text-sm text-gray-600">0321-8457556</p>
            
            <div className="border-t my-2 sm:my-3"></div>
            
            <div className="space-y-1 text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bill No:</span>
                <span className="font-medium text-gray-800">{bill.billNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-800">{formattedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-gray-800 uppercase">{bill.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 lg:mb-8 overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="text-left p-2 sm:p-3 rounded-tl-lg">Sr.#</th>
                <th className="text-left p-2 sm:p-3">Description</th>
                <th className="text-center p-2 sm:p-3">Qty</th>
                <th className="text-center p-2 sm:p-3">Unit</th>
                <th className="text-right p-2 sm:p-3">Rate (PKR)</th>
                <th className="text-right p-2 sm:p-3 rounded-tr-lg">Amount (PKR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bill.items?.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="p-2 sm:p-3 text-gray-600 text-xs sm:text-sm">{index + 1}</td>
                  <td className="p-2 sm:p-3 text-gray-800 text-xs sm:text-sm max-w-[200px] truncate">{item.description}</td>
                  <td className="p-2 sm:p-3 text-center text-xs sm:text-sm">{Number(item.quantity).toFixed(2)}</td>
                  <td className="p-2 sm:p-3 text-center text-xs sm:text-sm uppercase">{item.unit}</td>
                  <td className="p-2 sm:p-3 text-right text-xs sm:text-sm">{Number(item.rate).toFixed(2)}</td>
                  <td className="p-2 sm:p-3 text-right font-medium text-xs sm:text-sm">{Number(item.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 lg:gap-8 mb-8">
          <div className="col-span-1 md:col-span-3">
            {bill.notes && (
              <div className="p-3 sm:p-4 h-full">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">Notes / Terms & Conditions:</h4>
                <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap">{bill.notes}</p>
              </div>
            )}
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b text-xs sm:text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">PKR {bill.subtotal?.toFixed(2) || "0.00"}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between py-2 border-b text-green-600 text-xs sm:text-sm">
                  <span>Discount ({bill.discount?.toFixed(2)}%):</span>
                  <span className="font-medium">- PKR {discountAmount.toFixed(2)}</span>
                </div>
              )}
              
              {taxAmount > 0 && (
                <div className="flex justify-between py-2 border-b text-xs sm:text-sm">
                  <span className="text-gray-600">Tax ({bill.taxRate}%):</span>
                  <span className="font-medium">PKR {taxAmount.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between py-2 border-b text-sm sm:text-base font-bold">
                <span className="text-gray-800">Total Amount:</span>
                <span className="text-blue-600">PKR {bill.total?.toFixed(2) || "0.00"}</span>
              </div>
              
              {amountReceived > 0 && (
                <div className="flex justify-between py-2 border-b text-xs sm:text-sm">
                  <span className="text-gray-600">Amount Received:</span>
                  <span className="font-medium text-green-600">PKR {amountReceived.toFixed(2)}</span>
                </div>
              )}
              
              {(amountReceived > 0 || bill.status === 'paid') && (
                <div className="flex justify-between py-2 border-b text-sm sm:text-base font-bold">
                  <span className="text-gray-800">Remaining:</span>
                  <span className="text-red-600">PKR {bill.remainingAmount?.toFixed(2) || "0.00"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- SIGNATURE BLOCK (align left) --- */}
        <div className="mb-12 sm:mb-20">
          <p className="text-gray-600 mb-4 sm:mb-8 text-xs sm:text-sm">Very truly yours,</p>
          {/* Removed "mx-auto" to align left */}
          <div className="border-t border-gray-400 w-48 sm:w-64">
            <p className="pt-2 font-medium text-xs sm:text-sm">For Wazir Glass & Aluminium Centre</p>
          </div>
        </div>

        <footer className="border-t-2 border-blue-600 pt-4 sm:pt-6 text-gray-600 text-center">
          <div className="flex sm:flex-row gap-4 sm:gap-6 mb-3 sm:mb-4 justify-center">
            {/* <div className="flex items-center gap-2 justify-center">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">Akbar Market, Ferozpur Road, Kalma Chowk, Lahore</span>
            </div> */}
            <div className="flex items-center gap-2">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">0321-8457556</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm">wazirglasscentre100@gmail.com</span>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500">
            This is a computer-generated invoice.
          </p>
        </footer>
        
      </div>
      
      {/* --- IMPROVED PRINT STYLES (with responsive overrides for consistency) --- */}
      <style id="print-styles">
        {`
          @media print {
            @page {
              /* Set print size to 'letter' */
              size: letter;
              margin: 0.3in;
            }
            body {
              font-family: Arial, sans-serif !important;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !imporant;
              font-size: 10pt;
              font-weight: 400 !important; /* Set a base font-weight */
            }
            #bill-content {
              padding: 0 !important;
              border: 0 !important;
              overflow: visible !important;
            }
            .print\\:hidden { display: none !important; }
            .print\\:border-0 { border: 0 !important; }
            .print\\:p-4 { padding: 0 !important; }
            /* Typography - consistent sizing */
            h1, h3, h4, p, span, div, td, th {
              font-family: Arial, sans-serif !important;
              font-weight: 400 !important; /* Default all to normal */
            }
            h1 { font-size: 22pt !important; font-weight: 700 !important; margin-bottom: 0.25rem !important; }
            h3 { font-size: 10pt !important; font-weight: 700 !important; margin-bottom: 0.5rem !important; }
            h4 { font-size: 9pt !important; font-weight: 700 !important; margin-bottom: 0.5rem !important; }
            p { font-size: 9pt !important; margin: 0; }
            span { font-size: 9pt !important; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 1rem !important; 
              min-width: auto !important; 
              table-layout: fixed !important; /* FIX: Enable fixed layout for explicit column widths */
            }
            th { font-size: 10pt !important; padding: 0.5rem !important; font-weight: 700 !important; }
            td { 
              font-size: 9pt !important; 
              padding: 0.5rem !important; 
              vertical-align: top; 
              white-space: normal !important; /* FIX: Allow text wrapping for descriptions and fix overflow/gap */
              max-width: none !important; 
            }
            
            /* FIX: Explicit Column Widths to control layout and gaps */
            table thead th:nth-child(1), table tbody td:nth-child(1) { width: 5%; } /* Sr.# */
            table thead th:nth-child(2), table tbody td:nth-child(2) { width: 45%; white-space: normal !important; } /* Description - Max width and wrapping */
            table thead th:nth-child(3), table tbody td:nth-child(3) { width: 10%; text-align: center !important; } /* Qty */
            table thead th:nth-child(4), table tbody td:nth-child(4) { width: 10%; text-align: center !important; } /* Unit */
            table thead th:nth-child(5), table tbody td:nth-child(5) { width: 15%; text-align: right !important; } /* Rate */
            table thead th:nth-child(6), table tbody td:nth-child(6) { width: 15%; text-align: right !important; } /* Amount */

            /* Force specific elements to be bold */
            .font-bold, .font-semibold, .font-medium,
            .text-lg.font-bold, .font-medium.text-gray-800 {
              font-weight: 700 !important;
            }
            
            /* Force specific elements to be normal (overriding .font-light etc.) */
            .font-light, .text-gray-500, .text-gray-600, .text-sm {
              font-weight: 400 !important;
            }
            
            /* Table cell specifics */
            td.font-medium {
              font-weight: 700 !important;
            }
            /* Layout - ensure grid behaves as columns in print */
            .grid { display: grid !important; }
            .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
            .grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
            .col-span-1 { grid-column: span 1 / span 1 !important; }
            .col-span-2 { grid-column: span 2 / span 2 !important; }
            .col-span-3 { grid-column: span 3 / span 3 !important; }
            .gap-4 { gap: 1rem !important; }
            .gap-8 { gap: 1.5rem !important; }
            .mb-6 { margin-bottom: 1.25rem !important; }
            .mb-8 { margin-bottom: 1.5rem !important; }
            .mb-12 { margin-bottom: 2.5rem !important; }
            .mb-20 { margin-bottom: 3.5rem !important; }
            .mt-8 { margin-top: 1.5rem !important; }
            .mt-12 { margin-top: 2rem !important; }
            .mt-20 { margin-top: 3rem !important; }
            .mb-16 { margin-bottom: 2.5rem !important; }
            .text-center { text-align: center; }
            .text-right { text-align: right !important; }
            .text-left { text-align: left; }
            .mx-auto { margin-left: auto !important; margin-right: auto !important; }
            .w-64:not(.mx-auto) { margin-left: 0 !important; } /* Force left align if mx-auto is removed */

            
            /* Colors & Backgrounds */
            .text-blue-600 { color: #2563eb !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-800 { color: #1f2937 !important; }
            .text-green-600 { color: #16a34a !important; }
            .text-orange-800 { color: #9a3412 !important; }
            .text-red-600 { color: #dc2626 !important; }
            .text-white { color: #ffffff !important; }
            .bg-blue-600 { background-color: #2563eb !important; }
            /* Components */
            .p-3 { padding: 0.75rem !important; }
            .p-4 { padding: 1rem !important; }
            .p-2 { padding: 0.5rem !important; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
            .py-0.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
            .pt-4 { padding-top: 1rem !important; }
            .pt-6 { padding-top: 1.5rem; }
            .pt-2 { padding-top: 0.5rem; }
            .mb-4 { margin-bottom: 1rem !important; }
            .rounded-lg { border-radius: 0 !important; }
            .rounded-tl-lg { border-top-left-radius: 0.5rem !important; }
            .rounded-tr-lg { border-top-right-radius: 0.5rem !important; }
            .rounded { border-radius: 0 !important; }
            .border-t { border-top-width: 1px !important; }
            .border-b { border-bottom-width: 1px !important; }
            .border-t-2 { border-top-width: 2px !important; }
            .border-blue-600 { border-color: #2563eb !important; }
            .border-gray-400 { border-color: #9ca3af !important; }
            .divide-y > :not([hidden]) ~ :not([hidden]) { border-top-width: 1px; border-color: #e5e7eb !important; }
            .w-full { width: 100%; }
            .w-48 { width: 12rem !important; }
            .w-64 { width: 16rem; }
            .h-full { height: 100%; }
            .flex { display: flex !important; }
            .flex-col { flex-direction: column !important; }
            .flex-row { flex-direction: row !important; }
            .items-center { align-items: center !important; }
            .justify-between { justify-content: space-between !important; }
            .justify-center { justify-content: center !important; }
            .gap-4 { gap: 1rem !important; }
            .gap-6 { gap: 1.5rem !important; }
            .gap-2 { gap: 0.5rem !important; }
            .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.25rem !important; }
            .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem !important; }
            .inline-block { display: inline-block !important; }
            .whitespace-pre-wrap { white-space: pre-wrap !important; }
            .uppercase { text-transform: uppercase !important; }
            .overflow-x-auto { overflow-x: visible !important; } /* Disable scroll in print */
            .max-w-\\[200px\\] { max-width: none !important; }
            .truncate { white-space: normal !important; }
            .flex-shrink-0 { flex-shrink: 0 !important; }
            
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
