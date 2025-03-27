import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8); // 20% down payment by default
  const [interestRate, setInterestRate] = useState(4.5); // 4.5% interest rate by default
  const [loanTerm, setLoanTerm] = useState(30); // 30 years by default

  // Calculate monthly payment using the formula: M = P[r(1+r)^n]/[(1+r)^n-1]
  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const monthlyInterestRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    if (monthlyInterestRate === 0) return principal / numberOfPayments;
    
    const monthlyPayment = 
      (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const downPayment = propertyPrice - loanAmount;
  const downPaymentPercentage = (downPayment / propertyPrice) * 100;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Down Payment ({downPaymentPercentage.toFixed(0)}%)</Label>
          <span className="text-sm font-medium">ZMW {downPayment.toLocaleString()}</span>
        </div>
        <Slider
          value={[loanAmount]}
          min={propertyPrice * 0.1} // Minimum 10% of property price
          max={propertyPrice * 0.9} // Maximum 90% of property price
          step={1000}
          onValueChange={(value) => setLoanAmount(propertyPrice - value[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Loan Amount</Label>
          <span className="text-sm font-medium">ZMW {loanAmount.toLocaleString()}</span>
        </div>
        <Input
          type="number"
          value={loanAmount}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= 0 && value <= propertyPrice * 0.9) {
              setLoanAmount(value);
            }
          }}
          className="mt-1"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Interest Rate (%)</Label>
          <span className="text-sm font-medium">{interestRate}%</span>
        </div>
        <Slider
          value={[interestRate]}
          min={1}
          max={10}
          step={0.1}
          onValueChange={(value) => setInterestRate(value[0])}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Loan Term (Years)</Label>
          <span className="text-sm font-medium">{loanTerm} years</span>
        </div>
        <Slider
          value={[loanTerm]}
          min={5}
          max={30}
          step={5}
          onValueChange={(value) => setLoanTerm(value[0])}
        />
      </div>

      <Card className="bg-neutral-50 mt-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-sm font-medium text-neutral-500 mb-1">Estimated Monthly Payment</h3>
            <p className="text-2xl font-bold text-primary">
              ZMW {monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-neutral-500 mt-2">
              This is an estimate. Contact a mortgage specialist for accurate rates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
