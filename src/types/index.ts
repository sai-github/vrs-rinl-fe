// types/index.ts
import { z } from 'zod';

// Base schema for form inputs
export const calculatorFormSchema = z.object({
  basic: z
    .number({
      required_error: 'Basic pay is required',
      invalid_type_error: 'Basic pay must be a number'
    })
    .positive('Basic pay must be positive')
    .safe() // Ensures the number is within safe integer bounds
    .transform((val) => Number(val.toFixed(2))), // Round to 2 decimal places

  da: z
    .number({
      required_error: 'DA is required',
      invalid_type_error: 'DA must be a number'
    })
    .positive('DA must be positive')
    .safe()
    .transform((val) => Number(val.toFixed(2))),

  dateOfJoining: z.coerce.date({
    required_error: 'Date of joining is required',
    invalid_type_error: 'Invalid date format'
  }),

  dateOfRetirement: z.coerce.date({
    required_error: 'Date of retirement is required',
    invalid_type_error: 'Invalid date format'
  }),

  pfMonthlyContribution: z
    .number({
      required_error: 'PF contribution is required',
      invalid_type_error: 'PF contribution must be a number'
    })
    .min(0, 'PF contribution cannot be negative')
    .max(100, 'PF contribution cannot exceed 100%')
    .default(12),

  sbfpMonthlyContribution: z
    .number({
      required_error: 'SBFP contribution is required',
      invalid_type_error: 'SBFP contribution must be a number'
    })
    .min(0, 'SBFP contribution cannot be negative')
    .max(100, 'SBFP contribution cannot exceed 100%')
    .default(3),
    
  bankInterestRate: z
    .number({
      required_error: 'Bank interest rate is required',
      invalid_type_error: 'Bank interest rate must be a number'
    })
    .min(0, 'Bank interest rate cannot be negative')
    .max(15, 'Bank interest rate realistically cannot exceed 15%')
    .default(5.5)
});

// Add superRefine for date validation (check how this is being used)
calculatorFormSchema.superRefine((data, ctx) => {
  if (data.dateOfRetirement <= data.dateOfJoining) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Retirement date must be after joining date',
      path: ['dateOfRetirement']
    });
  }
});

// Schema for service period calculations
export const servicePeriodSchema = z.object({
  todayDate: z.date(),
  completedService: z.string(),
  completedServiceDecimal: z.number(),
  leftOutService: z.string(),
  leftOutServiceDecimal: z.number(),
  leftOutMonths: z.number()
});

// Schema for salary calculations
export const salaryInfoSchema = z.object({
  basicPlusDA: z.number(),
  perDaySalary: z.number(),
  basicPlusDATillRetirement: z.number(),
  pfContribution: z.number(),
  sbfpContribution: z.number()
});

// Schema for VRS benefit calculations
export const vrsCalculationsSchema = z.object({
  compensationForCompletedService: z.number(),
  compensationForLeftService: z.number(),
  totalExtrapolatedCompensation: z.number(),
  finalCompensation: z.number(),
  afterTaxAmount: z.number(),
  monthlyInterest: z.number(),
  maturedAmountAtRetirement: z.number()
});

// Schema for comparison metrics
export const comparisonMetricsSchema = z.object({
  salaryTillRetirement: z.number(),
  benefitsTillRetirement: z.number(),
  totalFinancials: z.number(),
  vrsLoss: z.number(),
  vrsLossWithInterest: z.number()
});

// Combined schema for all calculated data
export const calculatedDataSchema = calculatorFormSchema
  .merge(servicePeriodSchema)
  .merge(salaryInfoSchema)
  .extend({
    vrsCalculations: vrsCalculationsSchema,
    comparisonMetrics: comparisonMetricsSchema
  });

// Export types using z.infer
export type CalculatorFormData = z.infer<typeof calculatorFormSchema>;
export type ServicePeriodInfo = z.infer<typeof servicePeriodSchema>;
export type SalaryInfo = z.infer<typeof salaryInfoSchema>;
export type VRSCalculations = z.infer<typeof vrsCalculationsSchema>;
export type ComparisonMetrics = z.infer<typeof comparisonMetricsSchema>;
export type CalculatedData = z.infer<typeof calculatedDataSchema>;

// Step status type
export type StepStatus = 'complete' | 'current' | 'upcoming';

export interface Step {
  id: number;
  name: string;
  status: StepStatus;
}
