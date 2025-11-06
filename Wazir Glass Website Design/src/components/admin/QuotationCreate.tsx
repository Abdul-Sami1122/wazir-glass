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
import { QuotationPreview } from "./QuotationPreview";
import { Dialog, DialogContent } from "../ui/dialog";
import api from "../../api";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface QuotationItem {
  id: string;
  description: string;
  quantity: number | string;
  unit: string;
  rate: number | string;
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
  discount: number;
  discountAmount: number;
  total: number;
  notes: string;
  status: "pending" | "accepted" | "rejected";
}

const initialQuotationData: Partial<Quotation> = {
  quotationNumber: `QTN-${Date.now()}`,
  date: new Date().toISOString().split("T")[0],
  customerName: "",
  customerPhone: "",
  customerAddress: "",
  items: [],
  subtotal: 0,
  discount: 0,
  discountAmount: 0,
  total: 0,
  notes: "",
  status: "pending",
};

export function QuotationCreate() {
  const [showPreview, setShowPreview] = useState(false);
  const [quotationData, setQuotationData] =
    useState<Partial<Quotation>>(initialQuotationData);
  const [discountType, setDiscountType] = useState<"percentage" | "amount">(
    "percentage"
  );
  const [discountValue, setDiscountValue] = useState<number | string>(0);

  useEffect(() => {
    calculateTotals();
  }, [quotationData.items, discountType, discountValue]); // Removed taxRate from dependencies

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unit: "sft",
      rate: 0,
      amount: 0,
    };
    setQuotationData((prev) => ({
      ...prev,
      items: [...(prev.items || []), newItem],
    }));
  };

  const removeItem = (id: string) => {
    setQuotationData((prev) => ({
      ...prev,
      items: prev.items?.filter((item) => item.id !== id),
    }));
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: any) => {
    const updatedItems = quotationData.items?.map((item) => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        updated.amount =
          (Number(updated.quantity) || 0) * (Number(updated.rate) || 0);
        return updated;
      }
      return item;
    });

    setQuotationData((prev) => ({
      ...prev,
      items: updatedItems as QuotationItem[],
    }));
  };

  const calculateTotals = () => {
    const items = quotationData.items || [];
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
    const total = afterDiscount; // Total is now just subtotal minus discount

    setQuotationData((prev) => ({
      ...prev,
      subtotal,
      discount,
      discountAmount,
      total, // Removed taxAmount
    }));
  };

  const saveQuotation = async () => {
    if (
      !quotationData.customerName ||
      !quotationData.customerPhone ||
      (quotationData.items?.length || 0) === 0
    ) {
      toast.error(
        "Please fill in all required fields and add at least one item"
      );
      return;
    }

    const finalItems = quotationData.items?.map(({ id, ...item }) => ({
      ...item,
      quantity: Number(item.quantity) || 0,
      rate: Number(item.rate) || 0,
      amount: Number(item.amount) || 0,
    }));

    // Removed tax fields from the final object
    const completeQuotation = {
      ...quotationData,
      items: finalItems,
      discount: Number(quotationData.discount) || 0,
    };

    try {
      await api.post("/api/quotations", completeQuotation);
      toast.success("Quotation saved successfully!");
      setQuotationData(initialQuotationData);
      setDiscountValue(0);
      setDiscountType("percentage");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save quotation. Please try again.");
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    e.target.select();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Create New Quotation</CardTitle>
          <CardDescription>
            Generate professional quotations for your customers
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quotationNumber">Quotation Number *</Label>
              <Input
                id="quotationNumber"
                value={quotationData.quotationNumber}
                onChange={(e) =>
                  setQuotationData({
                    ...quotationData,
                    quotationNumber: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={quotationData.date}
                onChange={(e) =>
                  setQuotationData({ ...quotationData, date: e.target.value })
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
                  value={quotationData.customerName}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      customerName: e.target.value,
                    })
                  }
                  className="mt-1"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  value={quotationData.customerPhone}
                  onChange={(e) =>
                    setQuotationData({
                      ...quotationData,
                      customerPhone: e.target.value,
                    })
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
                value={quotationData.customerAddress}
                onChange={(e) =>
                  setQuotationData({
                    ...quotationData,
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
              {quotationData.items?.map((item) => (
                <Card key={item.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-4">
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
                      <div className="md:col-span-2">
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
                      <div className="md:col-span-1">
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
                      <div className="md:col-span-2">
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
                      <div className="md:col-span-2">
                        <Label>Amount</Label>
                        <Input
                          value={item.amount.toFixed(2)}
                          readOnly
                          className="mt-1 bg-gray-50"
                        />
                      </div>
                      <div className="md:col-span-1 flex items-end">
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
              {(!quotationData.items || quotationData.items.length === 0) && (
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
                <span>PKR {quotationData.subtotal?.toFixed(2) || "0.00"}</span>
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
                  className="w-32"
                />
              </div>

              {quotationData.discountAmount! > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span>Discount Amount:</span>
                  <span>
                    - PKR {quotationData.discountAmount?.toFixed(2) || "0.00"}
                  </span>
                </div>
              )}

              {/* Tax Rate and Tax Amount fields are removed */}

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-lg font-bold text-gray-800">
                  Total:
                </span>
                <span className="text-lg font-bold">
                  PKR {quotationData.total?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="border-t pt-6">
            <Label htmlFor="notes">Notes / Terms & Conditions</Label>
            <Textarea
              id="notes"
              value={quotationData.notes}
              onChange={(e) =>
                setQuotationData({ ...quotationData, notes: e.target.value })
              }
              className="mt-1"
              placeholder="Add any additional notes or terms and conditions"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 border-t pt-6">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={saveQuotation}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Quotation
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          <QuotationPreview quotation={quotationData as Quotation} />
        </DialogContent>
      </Dialog>
    </>
  );
}