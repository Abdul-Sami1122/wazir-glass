// src/components/admin/UpdatePaymentDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import api from "../../api";

interface Bill {
  _id: string;
  total: number;
  amountReceived: number;
  remainingAmount: number;
}

interface UpdatePaymentDialogProps {
  bill: Bill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBillUpdate: () => void;
}

export function UpdatePaymentDialog({
  bill,
  open,
  onOpenChange,
  onBillUpdate,
}: UpdatePaymentDialogProps) {
  const [newAmount, setNewAmount] = useState<number | string>("");

  if (!bill) return null;

  const handleSubmit = async () => {
    const amountToAdd = Number(newAmount) || 0;
    if (amountToAdd <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const newAmountReceived = (bill.amountReceived || 0) + amountToAdd;

    try {
      await api.put(`/api/bills/${bill._id}`, {
        amountReceived: newAmountReceived,
      });
      toast.success("Payment updated successfully!");
      onBillUpdate(); // Refresh the list
      onOpenChange(false); // Close dialog
      setNewAmount(""); // Reset input
    } catch (error) {
      console.error(error);
      toast.error("Failed to update payment.");
    }
  };
  
  const handleMarkAsPaid = async () => {
    try {
      await api.put(`/api/bills/${bill._id}`, {
        amountReceived: bill.total, // Set received to total
        status: "paid"
      });
      toast.success("Bill marked as fully paid!");
      onBillUpdate(); // Refresh the list
      onOpenChange(false); // Close dialog
      setNewAmount(""); // Reset input
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark as paid.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment</DialogTitle>
          <DialogDescription>
            Add a new payment received for this bill.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Bill:</span>
            <span className="font-medium">PKR {bill.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Already Received:</span>
            <span className="font-medium">PKR {bill.amountReceived.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="font-semibold text-gray-800">Remaining:</span>
            <span className="font-semibold text-red-600">PKR {bill.remainingAmount.toFixed(2)}</span>
          </div>
          
          <div className="border-t pt-4">
            <Label htmlFor="newAmount">New Amount Received (PKR)</Label>
            <Input
              id="newAmount"
              type="number"
              min="0"
              step="0.01"
              value={newAmount}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setNewAmount(e.target.value)}
              className="mt-1"
              placeholder="Enter new amount"
            />
          </div>
        </div>

        <DialogFooter className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            onClick={handleMarkAsPaid}
            className="bg-green-50 text-green-700 hover:bg-green-100"
          >
            Mark as Fully Paid
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
            Add Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}