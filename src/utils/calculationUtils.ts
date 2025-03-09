import {
  ComparisonMetrics,
  SalaryInfo,
  ServicePeriodInfo,
  VRSCalculations
} from '@/types';

// const BANK_INTEREST_RATE = 5.5;
const TAX_RATE = 0.32;
const TAX_FREE_AMOUNT = 500000;

export const calculateServicePeriod = (
  joiningDate: Date,
  retirementDate: Date,
  today: Date
): ServicePeriodInfo => {
  // Important : No. of days in a year is 365.25
  const NO_OF_DAYS_IN_A_YEAR = 365.25;
  const msPerYear = NO_OF_DAYS_IN_A_YEAR * 24 * 60 * 60 * 1000;
  const msPerMonth = msPerYear / 12;

  const completedMs = today.getTime() - joiningDate.getTime();
  const leftMs = retirementDate.getTime() - today.getTime();

  const completedYears = Math.floor(completedMs / msPerYear);
  const completedMonths = Math.floor((completedMs % msPerYear) / msPerMonth);

  const leftYears = Math.floor(leftMs / msPerYear);
  const leftMonths = Math.floor((leftMs % msPerYear) / msPerMonth);

  const totalLeftMonths = Math.floor(leftMs / msPerMonth);

  return {
    todayDate: today,
    completedService: `${completedYears} Years ${completedMonths} Months`,
    completedServiceDecimal: completedYears + completedMonths / 12,
    leftOutService: `${leftYears} Years ${leftMonths} Months`,
    leftOutServiceDecimal: leftYears + leftMonths / 12,
    leftOutMonths: totalLeftMonths
  };
};

export const calculateSalaryInfo = (
  basic: number,
  da: number,
  leftOutMonths: number
): SalaryInfo => {
  const basicPlusDA = basic + da;

  return {
    basicPlusDA,
    perDaySalary: Number((basicPlusDA / 30).toFixed(2)),
    basicPlusDATillRetirement: Number((basicPlusDA * leftOutMonths).toFixed(2)),
    pfContribution: Number((basicPlusDA * 0.12).toFixed(2)),
    sbfpContribution: Number((basicPlusDA * 0.03).toFixed(2))
  };
};

export const calculateVRSBenefits = (
  perDaySalary: number,
  completedServiceDecimal: number,
  leftOutServiceDecimal: number,
  basicPlusDATillRetirement: number,
  bankInterestRate: number
): VRSCalculations => {
  const comp1 = perDaySalary * 35 * completedServiceDecimal;
  const comp2 = perDaySalary * 25 * leftOutServiceDecimal;
  const totalComp = comp1 + comp2;
  const finalComp = Math.min(basicPlusDATillRetirement, totalComp);
  const afterTax =
    (finalComp - TAX_FREE_AMOUNT) * (1 - TAX_RATE) + TAX_FREE_AMOUNT;

  return {
    compensationForCompletedService: comp1,
    compensationForLeftService: comp2,
    totalExtrapolatedCompensation: totalComp,
    finalCompensation: finalComp,
    afterTaxAmount: afterTax,
    monthlyInterest: (afterTax * bankInterestRate) / (100 * 12),
    maturedAmountAtRetirement:
      afterTax * Math.pow(1 + bankInterestRate / 100, leftOutServiceDecimal)
  };
};

export const calculateComparison = (
  basicPlusDA: number,
  leftOutMonths: number,
  pfContribution: number,
  sbfpContribution: number,
  afterTaxAmount: number,
  maturedAmountAtRetirement: number
): ComparisonMetrics => {
  const salaryTillRetirement =
    basicPlusDA * 1.46 * leftOutMonths * (1 - TAX_RATE);
  const benefitsTillRetirement =
    (pfContribution + sbfpContribution) * leftOutMonths;
  const totalFinancials = salaryTillRetirement + benefitsTillRetirement;

  return {
    salaryTillRetirement,
    benefitsTillRetirement,
    totalFinancials,
    vrsLoss: totalFinancials - afterTaxAmount,
    vrsLossWithInterest: totalFinancials - maturedAmountAtRetirement
  };
};
