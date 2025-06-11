export interface LoanApplicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  salary: number;
  creditScore: number;
  employmentYears: number;
  loanType: LoanType;  // Updated from loantype
  requestedAmount: number;  // Updated from requestedamount
  riskLevel: RiskLevel;  // Updated from risklevel
  employmentType: string;
  monthlyExpenses: number;
  assets: number;
  previousLoans: number;
  avatar: string;
}

export type LoanType = 'car' | 'house' | 'personal' | 'business';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface FilterOptions {
  search: string;
  loantype: LoanType | 'all';
  minSalary: number;
  maxSalary: number;
  risklevel: RiskLevel | 'all';
}