import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Eye, Trash2, Search, Check, X, FileText } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { QuotationPreview } from "./QuotationPreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { toast } from "sonner";
import api from "../../api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

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
  status: "pending" | "accepted" | "rejected" | "converted";
}

interface QuotationsListProps {
  compact?: boolean;
  quotations?: Quotation[];
  onViewQuotation?: () => void;
  onQuotationUpdate?: () => void;
  onConvertToBill?: (quotation: Quotation) => void;
}

type StatusFilter = "all" | "pending" | "accepted" | "rejected" | "converted";

export function QuotationsList({
  compact = false,
  quotations: propQuotations,
  onViewQuotation,
  onQuotationUpdate,
  onConvertToBill,
}: QuotationsListProps) {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(
    null
  );
  const [showPreview, setShowPreview] = useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<string | null>(null);

  const loadQuotations = async () => {
    if (propQuotations && compact) return;

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await api.get(`/api/quotations?${params.toString()}`);
      setQuotations(res.data);
      onQuotationUpdate?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to load quotations.");
    }
  };

  useEffect(() => {
    loadQuotations();
  }, [searchTerm, statusFilter]);

  const handleViewQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setShowPreview(true);
    onViewQuotation?.();
  };

  const handleDeleteQuotation = async (id: string) => {
    try {
      await api.delete(`/api/quotations/${id}`);
      toast.success("Quotation deleted successfully");
      setQuotationToDelete(null);
      loadQuotations();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete quotation.");
      setQuotationToDelete(null);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await api.put(`/api/quotations/${id}`, { status });
      toast.success(`Quotation marked as ${status}!`);
      loadQuotations();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    }
  };

  const source = propQuotations && compact ? propQuotations : quotations;
  const displayQuotations = compact ? source.slice(0, 5) : source;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-600";
      case "rejected":
        return "bg-red-600";
      case "converted":
        return "bg-purple-600";
      case "pending":
      default:
        return "bg-orange-600";
    }
  };

  const QuotationActions = ({ quotation }: { quotation: Quotation }) => (
    <div className="flex justify-end gap-2">
      {quotation.status === "accepted" && onConvertToBill && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
              onClick={() => onConvertToBill(quotation)}
            >
              <FileText className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Convert to Bill</p>
          </TooltipContent>
        </Tooltip>
      )}

      {quotation.status === "pending" && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100"
                onClick={() => handleUpdateStatus(quotation._id, "accepted")}
              >
                <Check className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as Accepted</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-red-50 text-red-700 hover:bg-red-100"
                onClick={() => handleUpdateStatus(quotation._id, "rejected")}
              >
                <X className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as Rejected</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleViewQuotation(quotation)}
          >
            <Eye className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Quotation</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setQuotationToDelete(quotation._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Quotation</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <TooltipProvider>
      {/* ===================================================== */}
      {/* =============== FULL PAGE VIEW ====================== */}
      {/* ===================================================== */}
      {!compact && (
        <Card>
          <CardHeader>
            <CardTitle>All Quotations</CardTitle>
            <CardDescription>
              Manage and view all generated quotations
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative w-full md:w-[250px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by quotation number, customer name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as StatusFilter)}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* --- MODIFICATION START --- */}
            {/* Replaced the Table with a card-based list */}
            <div className="space-y-3">
              {displayQuotations.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No quotations found.
                </div>
              ) : (
                displayQuotations.map((quotation) => (
                  <div
                    key={quotation._id}
                    className="p-3 border rounded-lg bg-gray-50 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {quotation.customerName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {quotation.quotationNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(quotation.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="font-bold text-gray-900 text-sm">
                          PKR {quotation.total.toFixed(2)}
                        </p>
                        <Badge
                          variant="secondary"
                          className={
                            getStatusBadgeColor(quotation.status) +
                            " text-xs mt-1"
                          }
                        >
                          {quotation.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="border-t pt-2 flex justify-end">
                      <QuotationActions quotation={quotation} />
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* --- MODIFICATION END --- */}

          </CardContent>
        </Card>
      )}

      {/* ===================================================== */}
      {/* =============== COMPACT DASHBOARD VIEW =============== */}
      {/* ===================================================== */}
      {compact && (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayQuotations.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center h-24 text-gray-500"
                  >
                    No recent quotations found.
                  </TableCell>
                </TableRow>
              ) : (
                displayQuotations.map((quotation) => (
                  <TableRow key={quotation._id}>
                    <TableCell>
                      <div>{quotation.customerName}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(quotation.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      PKR {quotation.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={getStatusBadgeColor(quotation.status)}
                      >
                        {quotation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {quotation.status === "accepted" && onConvertToBill && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 mr-2"
                          onClick={() => onConvertToBill(quotation)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewQuotation(quotation)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ===================================================== */}
      {/* ===================== DIALOGS ======================== */}
      {/* ===================================================== */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          {selectedQuotation && (
            <QuotationPreview
              quotation={{ ...selectedQuotation, id: selectedQuotation._id }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!quotationToDelete}
        onOpenChange={() => setQuotationToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Quotation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this quotation? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                quotationToDelete && handleDeleteQuotation(quotationToDelete)
              }
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}