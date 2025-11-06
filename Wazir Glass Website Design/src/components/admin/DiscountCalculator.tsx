import { useState } from "react";
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
import { Calculator, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner"; // Added missing toast import

// Common aluminum material widths (in inches)
const commonMaterials = [
  { name: "Standard Interlock (1.75')", value: "1.75" },
  { name: "Heavy Interlock (2.5')", value: "2.5" },
  { name: "Outer Frame (1.5')", value: "1.5" },
  { name: "Outer Frame (2')", value: "2" },
];

export function DiscountCalculator() {
  const [totalWidth, setTotalWidth] = useState("");
  const [numDivisions, setNumDivisions] = useState("2");
  const [materialWidth, setMaterialWidth] = useState("1.75");
  const [panelWidth, setPanelWidth] = useState<string | null>(null);

  const calculateDivision = () => {
    const totalW = parseFloat(totalWidth) || 0;
    const divisions = parseInt(numDivisions) || 1;
    const materialW = parseFloat(materialWidth) || 0;

    if (totalW <= 0) {
      toast.error("Please enter a valid Total Width.");
      return;
    }

    if (divisions <= 0) {
      toast.error("Number of panels must be at least 1.");
      return;
    }

    const numDividers = divisions > 1 ? divisions - 1 : 0;
    const totalMaterialWidth = numDividers * materialW;

    if (totalMaterialWidth >= totalW) {
      toast.error("Material width is larger than the total width.");
      setPanelWidth(null);
      return;
    }

    const remainingWidth = totalW - totalMaterialWidth;
    const singlePanelWidth = remainingWidth / divisions;

    setPanelWidth(singlePanelWidth.toFixed(4));
  };

  const reset = () => {
    setTotalWidth("");
    setNumDivisions("2");
    setMaterialWidth("1.75");
    setPanelWidth(null);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    e.target.select();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aluminum Division Calculator</CardTitle>
        <CardDescription>
          Calculate individual panel widths for windows and doors.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="totalWidth">Total Width (in inches) *</Label>
            <Input
              id="totalWidth"
              type="number"
              min="0"
              step="0.01"
              value={totalWidth}
              onFocus={handleFocus}
              onChange={(e) => setTotalWidth(e.target.value)}
              placeholder="e.g., 72.5"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="numDivisions">Number of Panels / Divisions *</Label>
            <Input
              id="numDivisions"
              type="number"
              min="1"
              step="1"
              value={numDivisions}
              onFocus={handleFocus}
              onChange={(e) => setNumDivisions(e.target.value)}
              placeholder="e.g., 3"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="materialWidth">
              Divider / Interlock Width (in inches) *
            </Label>
            {/* --- UPDATED FOR RESPONSIVENESS --- */}
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <Input
                id="materialWidth"
                type="number"
                min="0"
                step="0.01"
                value={materialWidth}
                onFocus={handleFocus}
                onChange={(e) => setMaterialWidth(e.target.value)}
                placeholder="e.g., 1.75"
                className="w-full"
              />
              <Select
                value={materialWidth}
                onValueChange={(value) => setMaterialWidth(value)}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Common" />
                </SelectTrigger>
                <SelectContent>
                  {commonMaterials.map((mat) => (
                    <SelectItem key={mat.name} value={mat.value}>
                      {mat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={calculateDivision}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Calculator className="w-4 h-4 mr-2" />
            Calculate Panel Width
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {panelWidth !== null && (
          <div className="border-t pt-4 space-y-3">
            <div className="bg-blue-50 p-6 rounded text-center">
              <p className="text-sm text-gray-600 mb-1">
                Each of the {numDivisions} panels should be:
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {panelWidth}"
              </p>
              <p className="text-xs text-gray-500 mt-2">
                (Total: {numDivisions} x {panelWidth}" panels) + (
                {Math.max(0, parseInt(numDivisions) - 1)} x {materialWidth}"
                dividers) = {totalWidth}"
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}