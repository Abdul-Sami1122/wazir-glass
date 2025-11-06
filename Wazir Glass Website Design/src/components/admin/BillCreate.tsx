import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Plus, Trash2, Eye, Save } from "lucide-react";
import { toast } from "sonner";
import { BillPreview } from "./BillPreview";
import { Dialog, DialogContent } from "../ui/dialog";
import api from "../../api";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

// Interface for a Bill Item
interface BillItem {
  id: string;
  description: string;
  quantity: number | string;
  unit: string;
  rate: number | string;
  amount: number;
}

// Interface for a Bill
interface Bill {
  id: string;
  billNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: BillItem[];
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
  quotationId?: string;
}

// Interface for the incoming quotation data
interface Quotation {
  _id: string;
  quotationNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: any[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  total: number;
  notes: string;
}

// Props for the component
interface BillCreateProps {
  quotationData?: Quotation | null;
}

const initialBillData: Partial<Bill> = {
  billNumber: `INV-${Date.now()}`,
  date: new Date().toISOString().split("T")[0],
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  items: [],
  subtotal: 0,
  discount: 0,
  discountAmount: 0,
  taxRate: 0,
  taxAmount: 0,
  total: 0,
  amountReceived: 0,
  remainingAmount: 0,
  notes: "",
  status: "pending",
};

export function BillCreate({ quotationData }: BillCreateProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [billData, setBillData] = useState<Partial<Bill>>(initialBillData);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState<number | string>(0);

  useEffect(() => {
    if (quotationData) {
      const newTotal = quotationData.total;
      setBillData({
        ...initialBillData,
        customerName: quotationData.customerName,
        customerPhone: quotationData.customerPhone,
        customerAddress: quotationData.customerAddress,
        items: quotationData.items.map((item) => ({
          ...item,
          id: `item-${Date.now()}-${Math.random()}`,
        })),
        subtotal: quotationData.subtotal,
        discount: quotationData.discount,
        discountAmount: quotationData.discountAmount,
        taxRate: 0,
        taxAmount: 0,
        total: newTotal,
        amountReceived: 0,
        remainingAmount: newTotal,
        notes: `Generated from Quotation #${
          quotationData.quotationNumber
        }\n\n${quotationData.notes || ""}`,
        status: "pending",
      });

      if (quotationData.discountAmount > 0 && quotationData.discount === 0) {
        setDiscountType("amount");
        setDiscountValue(quotationData.discountAmount);
      } else if (quotationData.discount > 0) {
        setDiscountType("percentage");
        setDiscountValue(quotationData.discount);
      } else {
        setDiscountType("percentage");
        setDiscountValue(0);
      }
    } else {
      setBillData(initialBillData);
      setDiscountValue(0);
      setDiscountType("percentage");
    }
  }, [quotationData]);

  useEffect(() => {
    calculateTotals();
  }, [
    billData.items,
    discountType,
    discountValue,
    billData.taxRate,
    billData.amountReceived,
  ]);

  const addItem = () => {
    const newItem: BillItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      description: "",
      quantity: 1,
      unit: "sft",
      rate: 0,
      amount: 0,
    };
    setBillData((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
  };

  const removeItem = (id: string) => {
    setBillData((prev) => ({
      ...prev,
      items: prev.items?.filter((item) => item.id !== id),
    }));
  };

  const updateItem = (id: string, field: keyof BillItem, value: any) => {
    const updatedItems = billData.items?.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.amount =
          (Number(updated.quantity) || 0) * (Number(updated.rate) || 0);
        return updated;
      }
      return item;
    });

    setBillData((prev) => ({ ...prev, items: updatedItems as BillItem[] }));
  };

  const calculateTotals = () => {
    const items = billData.items || [];
    const taxRate = Number(billData.taxRate) || 0;
    const amountReceived = Number(billData.amountReceived) || 0;
    const localDiscountValue = Number(discountValue) || 0;

    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);

    let discount = 0;
    let discountAmount = 0;

    if (discountType === "percentage") {
      discount = localDiscountValue;
      discountAmount = (subtotal * discount) / 100;
    } else {
      discountAmount = localDiscountValue;
      discount = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
    }

    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (afterDiscount * taxRate) / 100;
    const total = afterDiscount + taxAmount;

    const remainingAmount = total - amountReceived;

    setBillData((prev) => ({
      ...prev,
      subtotal,
      discount,
      discountAmount,
      taxAmount,
      total,
      remainingAmount,
    }));
  };

  const saveBill = async () => {
    if (
      !billData.customerName ||
      !billData.customerPhone ||
      (billData.items?.length || 0) === 0
    ) {
      toast.error(
        "Please fill in all required fields and add at least one item"
      );
      return;
    }

    const finalItems = billData.items?.map(({ id, ...item }) => ({
      ...item,
      quantity: Number(item.quantity) || 0,
      rate: Number(item.rate) || 0,
      amount: Number(item.amount) || 0,
    }));

    const completeBill = {
      ...billData,
      items: finalItems,
      amountReceived: Number(billData.amountReceived) || 0,
      taxRate: Number(billData.taxRate) || 0,
      discount: Number(billData.discount) || 0,
      quotationId: quotationData ? quotationData._id : undefined,
    };

    try {
      await api.post("/api/bills", completeBill);
      toast.success("Bill saved successfully!");
      setBillData(initialBillData);
      setDiscountValue(0);
      setDiscountType("percentage");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save bill. Please try again.");
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    e.target.select();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Create New Bill</CardTitle>
          {quotationData && (
            <CardDescription className="text-blue-600 font-medium">
              Populated from Quotation #{quotationData.quotationNumber}. Please
              add tax and payment details.
            </CardDescription>
          )}
          {!quotationData && (
            <CardDescription>
              Generate professional invoices for your customers
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bill Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="billNumber">Bill Number *</Label>
              <Input
                id="billNumber"
                value={billData.billNumber}
                onChange={(e) =>
                  setBillData({ ...billData, billNumber: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={billData.date}
                onChange={(e) =>
                  setBillData({ ...billData, date: e.target.value })
                }
                className="mt-1"
              />
            </div>
          </div>

          {/* Customer Details */}
          <div className="border-t pt-6">
            <h3 className="mb-4 text-gray-800">Customer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={billData.customerName}
                  onChange={(e) =>
                    setBillData({ ...billData, customerName: e.target.value })
                  }
                  className="mt-1"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  value={billData.customerPhone}
                  onChange={(e) =>
                    setBillData({ ...billData, customerPhone: e.target.value })
                  }
                  className="mt-1"
                  placeholder="03XX-XXXXXXX"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="customerAddress">Address</Label>
              <Textarea
                id="customerAddress"
                value={billData.customerAddress}
                onChange={(e) =>
                  setBillData({
                    ...billData,
                    customerAddress: e.target.value,
                  })
                }
                className="mt-1"
                placeholder="Enter customer address"
                rows={2}
              />
            </div>
          </div>

          {/* Items */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-800">Items</h3>
              <Button onClick={addItem} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-4">
              {billData.items?.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    {/* RESPONSIVE: Changed grid-cols-1 to grid-cols-2 for mobile */}
                    <div className="grid grid-cols-2 md:grid-cols-12 gap-4">
                      {/* RESPONSIVE: Added col-span-2 for mobile */}
                      <div className="col-span-2 md:col-span-4">
                        <Label>Description *</Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="Item description"
                          className="mt-1"
                        />
                      </div>
                      {/* RESPONSIVE: Added col-span-1 for mobile */}
                      <div className="col-span-1 md:col-span-2">
                        <Label>Quantity *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.quantity}
                          onFocus={handleFocus}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      {/* RESPONSIVE: Added col-span-1 for mobile */}
                      <div className="col-span-1 md:col-span-1">
                        <Label>Unit *</Label>
                        <Select
                          value={item.unit}
                          onValueChange={(value) =>
                            updateItem(item.id, "unit", value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sft">Sft</SelectItem>
                            <SelectItem value="rft">Rft</SelectItem>
                            <SelectItem value="pcs">Pcs</SelectItem>
                            <SelectItem value="box">Box</SelectItem>
                            <SelectItem value="kg">Kg</SelectItem>
                            <SelectItem value="ltr">Ltr</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {/* RESPONSIVE: Added col-span-1 for mobile */}
                      <div className="col-span-1 md:col-span-2">
                        <Label>Rate (PKR) *</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onFocus={handleFocus}
                          onChange={(e) =>
                            updateItem(item.id, "rate", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>
                      {/* RESPONSIVE: Added col-span-1 for mobile */}
                      <div className="col-span-1 md:col-span-2">
                        <Label>Amount</Label>
                        <Input
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="mt-1 bg-gray-50"
                        />
                      </div>
                      {/* RESPONSIVE: Added col-span-2 and justify-end for mobile */}
                      <div className="col-span-2 md:col-span-1 flex items-end justify-end md:justify-start">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {(!billData.items || billData.items.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <p>
                    No items added yet. Click "Add Item" to get started.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="border-t pt-6">
            <div className="max-w-md ml-auto space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>PKR {billData.subtotal?.toFixed(2) || "0.00"}</span>
              </div>

              <div>
                <Label>Discount Type</Label>
                <Tabs
                  value={discountType}
                  onValueChange={(value) => setDiscountType(value as any)}
                  className="w-full mt-1"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="percentage">Percentage (%)</TabsTrigger>
                    <TabsTrigger value="amount">Amount (PKR)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="discountValue">
                  {discountType === "percentage"
                    ? "Discount (%)"
                    : "Discount (PKR)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  min="0"
                  step="0.01"
                  value={discountValue}
                  onFocus={handleFocus}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  // RESPONSIVE: Replaced w-32 with w-2/5
                  className="w-2/5"
                />
              </div>

              {billData.discountAmount! > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Discount Amount:</span>
                  <span>
                    - PKR {billData.discountAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="taxRate">Tax Rate (%):</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={billData.taxRate}
                  onFocus={handleFocus}
                  onChange={(e) =>
                    setBillData({
                      ...billData,
                      taxRate: e.target.value as any,
                    })
                  }
                  // RESPONSIVE: Replaced w-32 with w-2/5
                  className="w-2/5"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tax Amount:</span>
                <span>PKR {billData.taxAmount?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-lg font-bold text-gray-800">
                  Total:
                </span>
                <span className="text-lg font-bold">
                  PKR {billData.total?.toFixed(2) || "0.00"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <Label htmlFor="amountReceived" className="text-blue-600">
                  Advanced Amount (PKR):
                </Label>
                <Input
                  id="amountReceived"
                  type="number"
                  min="0"
                  step="0.01"
                  value={billData.amountReceived}
                  onFocus={handleFocus}
                  onChange={(e) =>
                    setBillData({
                      ...billData,
                      amountReceived: e.target.value as any,
                    })
                  }
                  // RESPONSIVE: Replaced w-32 with w-2/5
                  className="w-2/5 border-blue-600"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-800">Remaining Amount:</span>
                <span className="text-gray-800">
                  PKR {billData.remainingAmount?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="border-t pt-6">
            <Label htmlFor="notes">Notes / Terms & Conditions</Label>
            <Textarea
              id="notes"
              value={billData.notes}
              onChange={(e) =>
                setBillData({ ...billData, notes: e.target.value })
              }
              className="mt-1"
              placeholder="Add any additional notes or terms and conditions"
              rows={3}
            />
          </div>

          {/* Actions */}
          {/* RESPONSIVE: Added flex-col sm:flex-row to stack buttons on mobile */}
          <div className="flex flex-col sm:flex-row gap-4 border-t pt-6">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={saveBill}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Bill
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        {/* RESPONSIVE: Added classes for max-width and scrolling on mobile */}
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <BillPreview bill={billData as Bill} />
        </DialogContent>
      </Dialog>
    </>
  );
}