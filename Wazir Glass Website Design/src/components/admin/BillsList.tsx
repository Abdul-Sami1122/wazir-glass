import { useState, useEffect, useCallback } from "react";
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
import { Eye, Trash2, Search, CheckCheck, CreditCard } from "lucide-react";
import { Dialog, DialogContent } from "../ui/dialog";
import { BillPreview } from "./BillPreview";
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
import { UpdatePaymentDialog } from "./UpdatePaymentDialog";

interface Bill {
  _id: string;
  billNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: any[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  amountReceived: number;
  remainingAmount: number;
  notes: string;
  status: "pending" | "paid" | "advanced";
}

interface BillsListProps {
  compact?: boolean;
  onViewBill?: () => void;
  onBillUpdate?: () => void;
  bills?: Bill[];
}

type StatusFilter = "all" | "pending" | "advanced" | "paid";

export function BillsList({
  compact = false,
  onViewBill,
  onBillUpdate,
  bills: propBills,
}: BillsListProps) {
  const [bills, setBills] = useState<Bill[]>(propBills || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(
    compact ? "pending" : "all"
  );
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [billToUpdate, setBillToUpdate] = useState<Bill | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [billToDelete, setBillToDelete] = useState<string | null>(null);

  const loadBills = useCallback(async () => {
    if (propBills) return;
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await api.get(`/api/bills?${params.toString()}`);
      setBills(res.data.data || res.data || []);
      onBillUpdate?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bills.");
    }
  }, [propBills, searchTerm, statusFilter, onBillUpdate]);

  useEffect(() => {
    if (!propBills) loadBills();
    else setBills(propBills);
  }, [loadBills, propBills]);

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setShowPreview(true);
    onViewBill?.();
  };

  const handleDeleteBill = async (id: string) => {
    try {
      await api.delete(`/api/bills/${id}`);
      toast.success("Bill deleted successfully");
      setBillToDelete(null);
      loadBills();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete bill.");
      setBillToDelete(null);
    }
  };

  const handleMarkAsPaid = async (id: string, total: number) => {
    try {
      await api.put(`/api/bills/${id}`, {
        status: "paid",
        amountReceived: total,
      });
      toast.success("Bill marked as paid!");
      loadBills();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status.");
    }
  };

  const displayBills = compact ? bills.slice(0, 5) : bills;

  const individualBills = displayBills.filter((b) => b.billNumber);
  const summaryBills = displayBills.filter((b) => !b.billNumber);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-600";
      case "advanced":
        return "bg-blue-600";
      case "pending":
      default:
        return "bg-orange-600";
    }
  };

  const BillActions = ({ bill }: { bill: Bill }) => (
    <div className="flex justify-end gap-2">
      {bill.status !== "paid" && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                onClick={() => setBillToUpdate(bill)}
              >
                <CreditCard className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update Payment</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="bg-green-50 text-green-700 hover:bg-green-100"
                onClick={() => handleMarkAsPaid(bill._id, bill.total)}
              >
                <CheckCheck className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as Fully Paid</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}

      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant="outline" onClick={() => handleViewBill(bill)}>
            <Eye className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View Bill</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setBillToDelete(bill._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Bill</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );

  return (
    <TooltipProvider>
      {!compact && (
        <Card>
          <CardHeader>
            <CardTitle>All Bills</CardTitle>
            <CardDescription>Manage and view all generated invoices</CardDescription>
          </CardHeader>

          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by bill number, customer name, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as StatusFilter)}
              >
                <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card View (NOW VISIBLE ON ALL SIZES) */}
            <div className="space-y-3">
              {individualBills.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No bills found.</div>
              ) : (
                individualBills.map((bill) => (
                  <div
                    key={bill._id}
                    className="p-3 border rounded-lg bg-gray-50 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-sm">
                          {bill.customerName}
                        </h3>
                        <p className="text-xs text-gray-500">{bill.billNumber}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(bill.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="font-bold text-gray-900 text-sm">
                          PKR {bill.total.toFixed(2)}
                        </p>
                        <Badge
                          variant={bill.status === "paid" ? "default" : "secondary"}
                          className={getStatusBadgeColor(bill.status) + " text-xs mt-1"}
                        >
                          {bill.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600 mb-3">
                      Remaining:{" "}
                      <span className="font-medium text-gray-800">
                        PKR {bill.remainingAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-end">
                      <BillActions bill={bill} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Summary View (NOW VISIBLE ON ALL SIZES) */}
            {summaryBills.length > 0 && (
              <div className="space-y-3 mt-4">
                {summaryBills.map((summary) => (
                  <div
                    key={summary._id}
                    className="p-4 border rounded-lg bg-white shadow-sm flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {summary.customerName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(summary.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right mx-4 shrink-0">
                      <p className="font-bold text-lg text-gray-900">
                        PKR {summary.total.toFixed(2)}
                      </p>
                      <Badge
                        variant={
                          summary.status === "paid" ? "default" : "secondary"
                        }
                        className={getStatusBadgeColor(summary.status) + " text-xs"}
                      >
                        {summary.status}
                      </Badge>
                    </div>
                    <div className="shrink-0">
                      <BillActions bill={summary} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Compact Dashboard */}
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
              {displayBills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24 text-gray-500">
                    No recent bills found.
                  </TableCell>
                </TableRow>
              ) : (
                displayBills.map((bill) => (
                  <TableRow key={bill._id}>
                    <TableCell>
                      <div>{bill.customerName}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(bill.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      PKR {bill.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={bill.status === "paid" ? "default" : "secondary"}
                        className={getStatusBadgeColor(bill.status)}
                      >
                        {bill.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewBill(bill)}
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

      {/* Dialogs */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          {selectedBill && (
            <BillPreview bill={{ ...selectedBill, id: selectedBill._id }} />
          )}
        </DialogContent>
      </Dialog>

      <UpdatePaymentDialog
        bill={billToUpdate}
        open={!!billToUpdate}
        onOpenChange={() => setBillToUpdate(null)}
        onBillUpdate={loadBills}
      />

      <AlertDialog open={!!billToDelete} onOpenChange={() => setBillToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Bill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bill? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => billToDelete && handleDeleteBill(billToDelete)}
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