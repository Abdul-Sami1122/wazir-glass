// src/components/QuoteDialog.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import api from "../api"; // *** IMPORT THE API HELPER ***

interface QuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  serviceType: "",
  location: "",
  projectDetails: "",
};

export function QuoteDialog({ open, onOpenChange }: QuoteDialogProps) {
  const [formData, setFormData] = useState(initialFormData);

  // *** CHANGED ***
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use the 'api' helper (no token needed, it's a public route)
      await api.post('/api/submissions/quote', formData);

      toast.success("Quote request submitted! We'll contact you within 24 hours.");
      setFormData(initialFormData);
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit quote. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Get a Free Quote</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll get back to you within 24 hours with a detailed quote.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quote-name">Full Name *</Label>
              <Input
                id="quote-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="quote-phone">Phone Number *</Label>
              <Input
                id="quote-phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="03XX-XXXXXXX"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quote-email">Email Address</Label>
            <Input
              id="quote-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quote-service">Service Type *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
                required
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="glass-works">Glass Works</SelectItem>
                  <SelectItem value="aluminium-works">Aluminium Works</SelectItem>
                  <SelectItem value="shower-cabins">Shower Cabins</SelectItem>
                  <SelectItem value="partitions">Office Partitions</SelectItem>
                  <SelectItem value="curtain-walls">Curtain Walls</SelectItem>
                  <SelectItem value="doors-windows">Doors & Windows</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quote-location">Project Location *</Label>
              <Input
                id="quote-location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Area"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="quote-details">Project Details *</Label>
            <Textarea
              id="quote-details"
              required
              rows={4}
              value={formData.projectDetails}
              onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
              placeholder="Please describe your project requirements, dimensions, timeline, etc."
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Submit Quote Request
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}