import { Icon } from '@iconify/react';
import { forwardRef, useEffect, useState } from 'react';
import { Control, Controller, useForm, UseFormGetValues } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  calculateServicePeriod,
  calculateSalaryInfo,
  calculateVRSBenefits,
  calculateComparison
} from '@/utils/calculationUtils';
import { CalculatedData, calculatorFormSchema, Step } from '@/types';
import { useNavigate } from 'react-router';
import { formatToDisplayDate } from '@/utils/dateUtils';
import { formatCurrency } from '@/utils/currencyUtils';

interface EditableFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  isEditing: boolean;
  onEdit: () => void;
  error?: string;
}

const EditableField = forwardRef<
  HTMLInputElement,
  EditableFieldProps>(({ label, value, isEditing, onEdit, error, ...props }, ref) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        {isEditing ? (
          <input
            ref={ref}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            {...props}
          />
        ) : (
          <div className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
            <span className="block truncate text-sm">
              {value}
            </span>
            <button
              type="button"
              onClick={onEdit}
              className="ml-2 text-indigo-600 hover:text-indigo-500"
            >
              <Icon icon="heroicons:pencil-square" className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

interface EditableDateFieldProps {
  label: string;
  name: 'dateOfJoining' | 'dateOfRetirement';
  control: Control<CalculatorFormData>;
  isEditing: boolean;
  onEdit: () => void;
  getValues: UseFormGetValues<CalculatorFormData>;
}

const EditableDateField = ({ 
  label, 
  name, 
  control, 
  isEditing, 
  onEdit,
  getValues 
}: EditableDateFieldProps) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex rounded-md shadow-sm">
        {isEditing ? (
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <input
                type="date"
                value={field.value.toISOString().split('T')[0]}
                onChange={(e) => field.onChange(new Date(e.target.value))}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            )}
          />
        ) : (
          <div className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
            <span className="block truncate text-sm">
              {formatToDisplayDate(getValues(name))}
            </span>
            <button
              type="button"
              onClick={onEdit}
              className="ml-2 text-indigo-600 hover:text-indigo-500"
            >
              <Icon icon="heroicons:pencil-square" className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

interface ReadOnlyFieldProps {
  label: string;
  value: string;
}

function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2">
        <span className="block truncate text-sm">{value}</span>
      </div>
    </div>
  );
}

type CalculatorFormData = z.infer<typeof calculatorFormSchema>;

function Calculator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedData, setCalculatedData] = useState<CalculatedData | null>(
    null
  );
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, name: 'Your role information', status: 'current' },
    { id: 2, name: 'Confirm your information', status: 'upcoming' }
  ]);
  const [canUpdate, setCanUpdate] = useState(false);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  const {
    register,
    formState: { errors },
    setValue,
    getValues,
    trigger,
    control
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorFormSchema),
    defaultValues: {
      basic: 77380.00,
      da: 168534.00,
      pfMonthlyContribution: 12,
      sbfpMonthlyContribution: 3,
      dateOfJoining: new Date('1992-01-28'),
      dateOfRetirement: new Date('2029-12-31'),
      bankInterestRate: 5.5
    },
    mode: 'onChange' // Enable validation on change
  });

  // Update loading of saved data
  useEffect(() => {
    const savedData = localStorage.getItem('calculatorFormData');
    console.log('savedData', savedData);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as CalculatorFormData;
        console.log('raw parsedData', parsedData);

        // Type-safe way to set form values
        if (typeof parsedData.basic === 'number') {
          setValue('basic', parsedData.basic);
        }
        if (typeof parsedData.da === 'number') {
          setValue('da', parsedData.da);
        }
        if (typeof parsedData.dateOfJoining === 'string') {
          setValue('dateOfJoining', new Date(parsedData.dateOfJoining));
        }
        if (typeof parsedData.dateOfRetirement === 'string') {
          setValue('dateOfRetirement', new Date(parsedData.dateOfRetirement));
        }
        if (typeof parsedData.pfMonthlyContribution === 'number') {
          setValue('pfMonthlyContribution', parsedData.pfMonthlyContribution);
        }
        if (typeof parsedData.sbfpMonthlyContribution === 'number') {
          setValue(
            'sbfpMonthlyContribution',
            parsedData.sbfpMonthlyContribution
          );
        }
        if (typeof parsedData.bankInterestRate === 'number') {
          setValue('bankInterestRate', parsedData.bankInterestRate);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
        // Optionally clear invalid data
        localStorage.removeItem('calculatorFormData');
      }
    }
  }, [setValue]);

  const onSubmit = (data: CalculatorFormData) => {
    // Save form data (need to convert dates to strings for localStorage)
    const storageData = {
      ...data,
      dateOfJoining: data.dateOfJoining.toISOString(),
      dateOfRetirement: data.dateOfRetirement.toISOString()
    };
    localStorage.setItem('calculatorFormData', JSON.stringify(storageData));

    // Calculate all derived values
    const today = new Date();
    const servicePeriod = calculateServicePeriod(
      data.dateOfJoining,
      data.dateOfRetirement,
      today
    );
    const salaryInfo = calculateSalaryInfo(
      data.basic,
      data.da,
      servicePeriod.leftOutMonths
    );
    const vrsCalculations = calculateVRSBenefits(
      salaryInfo.perDaySalary,
      servicePeriod.completedServiceDecimal,
      servicePeriod.leftOutServiceDecimal,
      salaryInfo.basicPlusDATillRetirement,
      data.bankInterestRate
    );
    const comparisonMetrics = calculateComparison(
      salaryInfo.basicPlusDA,
      servicePeriod.leftOutMonths,
      salaryInfo.pfContribution,
      salaryInfo.sbfpContribution,
      vrsCalculations.afterTaxAmount,
      vrsCalculations.maturedAmountAtRetirement
    );

    const calculatedData: CalculatedData = {
      ...data,
      ...servicePeriod,
      ...salaryInfo,
      vrsCalculations,
      comparisonMetrics
    };

    setCalculatedData(calculatedData);
    navigate('/summary', { state: { calculatedData } });
  };

  const updateStepStatuses = (newCurrentStep: number) => {
    setSteps(
      steps.map((step) => ({
        ...step,
        status:
          step.id < newCurrentStep
            ? 'complete'
            : step.id === newCurrentStep
              ? 'current'
              : 'upcoming'
      }))
    );
  };

  const handleClick = (stepId: number) => {
    // Only allow clicking on completed steps or the next available step
    const clickedStep = steps.find((step) => step.id === stepId);
    if (clickedStep?.status === 'upcoming' && stepId !== currentStep + 1) {
      return;
    }
    setCurrentStep(stepId);
    updateStepStatuses(stepId);
  };

  const handleNext = async () => {
    // Trigger validation before proceeding
    const isValidForm = await trigger();
    if (!isValidForm) {
      return; // Don't proceed if form is invalid
    }

    console.log('[Current data]', getValues());

    const nextStep = Math.min(currentStep + 1, steps.length);
    setCurrentStep(nextStep);
    updateStepStatuses(nextStep);
  };

  const handlePrevious = () => {
    const prevStep = Math.max(currentStep - 1, 1);
    setCurrentStep(prevStep);
    updateStepStatuses(prevStep);
  };

  const getStepIcon = (step: Step) => {
    return step.status === 'complete' ? (
      <a
        onClick={() => handleClick(step.id)}
        className="group flex w-full items-center"
      >
        <span className="flex items-center px-6 py-4 text-sm font-medium">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
            <Icon
              icon="heroicons:check-16-solid"
              className="size-6 text-white"
            />
          </span>
          <span className="ml-4 text-sm font-medium text-gray-900">
            {step.name}
          </span>
        </span>
      </a>
    ) : step.status === 'current' ? (
      <a
        onClick={() => handleClick(step.id)}
        aria-current="step"
        className="flex items-center px-6 py-4 text-sm font-medium"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
          <span className="text-indigo-600">{step.id}</span>
        </span>
        <span className="ml-4 text-sm font-medium text-indigo-600">
          {step.name}
        </span>
      </a>
    ) : (
      <a
        aria-disabled={step.status === 'upcoming'}
        onClick={() => handleClick(step.id)}
        className="group flex items-center"
      >
        <span className="flex items-center px-6 py-4 text-sm font-medium">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
            <span className="text-gray-500 group-hover:text-gray-900">
              {step.id}
            </span>
          </span>
          <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
            {step.name}
          </span>
        </span>
      </a>
    );
  };

  const handleEdit = (fieldName: string) => {
    setSelectedField(fieldName);
    setCanUpdate(true);
  };

  const handleUpdate = async () => {
    // Validate before updating
    const isValidForm = await trigger();
    if (!isValidForm) {
      return;
    }

    setCanUpdate(false);
    setSelectedField(null);
    const formData = getValues();
    onSubmit(formData);
  };

  const handleSubmit = async() => {
    // Validate before updating
    const isValidForm = await trigger();
    if (!isValidForm) {
      return;
    }

    const formData = getValues();
    onSubmit(formData);
  }

  const renderStepContent = (id: number) => {
    switch (id) {
      case 1:
        return (
          <div className="space-y-12 p-6">
            <div>
              <h2 className="text-base/7 font-semibold text-gray-900">
                Salary Details
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Enter your salary information for accurate benefit calculation.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Basic Pay */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Basic Pay
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      step="1"
                      {...register('basic', {
                        valueAsNumber: true,
                      })}
                      placeholder="e.g., 77380.00"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.basic && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.basic.message}
                      </p>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your basic pay amount
                  </p>
                </div>

                {/* DA */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    DA (Dearness Allowance)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      step="1"
                      {...register('da', {
                        valueAsNumber: true
                      })}
                      placeholder="e.g., 168534.00"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.da && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.da.message}
                      </p>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your dearness allowance amount
                  </p>
                </div>

                {/* Date of Joining */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Date of Joining
                  </label>
                  <div className="mt-2">
                    <Controller
                      control={control} // Add control to useForm destructuring
                      name="dateOfJoining"
                      render={({ field }) => (
                        <input
                          type="date"
                          value={field.value.toISOString().split('T')[0]}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      )}
                    />
                    {errors.dateOfJoining && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dateOfJoining.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date of Retirement */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Date of Retirement
                  </label>
                  <div className="mt-2">
                    <Controller
                      control={control}
                      name="dateOfRetirement"
                      render={({ field }) => (
                        <input
                          type="date"
                          value={field.value.toISOString().split('T')[0]}
                          onChange={(e) => field.onChange(new Date(e.target.value))}
                          className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                        />
                      )}
                    />
                    {errors.dateOfRetirement && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dateOfRetirement.message}
                      </p>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Benefits are calculated based on 31st March 2025
                  </p>
                </div>

                {/* PF Monthly Contribution */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    PF Monthly Contribution (%)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      step="0.1"
                      {...register('pfMonthlyContribution', {
                        valueAsNumber: true,
                      })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.pfMonthlyContribution && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.pfMonthlyContribution.message}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Company contribution (12% of Basic plus DA)
                    </p>
                  </div>
                </div>

                {/* SBFP Monthly Contribution */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    SBFP Monthly Contribution (%)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      step="0.1"
                      {...register('sbfpMonthlyContribution', {
                        valueAsNumber: true
                      })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.sbfpMonthlyContribution && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.sbfpMonthlyContribution.message}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Company contribution (3% of Basic plus DA)
                    </p>
                  </div>
                </div>

                {/* Bank Interest Rate */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Bank Interest Rate (%)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      step="0.1"
                      {...register('bankInterestRate', {
                        valueAsNumber: true
                      })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.bankInterestRate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.bankInterestRate.message}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Bank interest rate (5.5% optimistic assumption)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-12 p-6">
            <div className="pb-12">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-base/7 font-semibold text-gray-900">
                    Service Period Details
                  </h2>
                  <p className="mt-1 text-sm/6 text-gray-600">
                    Review and update your information if needed
                  </p>
                </div>
                {!canUpdate && (
                  <button
                    type="button"
                    onClick={() => setCanUpdate(true)}
                    className="rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                  >
                    Edit Values
                  </button>
                )}
                {canUpdate && (
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    Update Calculations
                  </button>
                )}
              </div>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                {/* Input Values Section */}
                <div className="col-span-full">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <EditableField
                        type="number"
                        {...register('basic', { valueAsNumber: true })}
                        label="Basic Pay"
                        value={formatCurrency(getValues('basic'))}
                        isEditing={canUpdate && selectedField === 'basic'}
                        onEdit={() => handleEdit('basic')}
                      />
                      {errors.basic && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.basic.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <EditableField
                        type="number"
                        {...register('da', { valueAsNumber: true })}
                        label="DA"
                        value={formatCurrency(getValues('da'))}
                        isEditing={canUpdate && selectedField === 'da'}
                        onEdit={() => handleEdit('da')}
                      />
                      {errors.da && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.da.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <EditableDateField
                        label="Date of Joining"
                        name="dateOfJoining"
                        control={control}
                        isEditing={canUpdate && selectedField === 'dateOfJoining'}
                        onEdit={() => handleEdit('dateOfJoining')}
                        getValues={getValues}
                      />
                      {errors.dateOfJoining && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.dateOfJoining.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <EditableDateField
                        label="Date of Retirement"
                        name="dateOfRetirement"
                        control={control}
                        isEditing={canUpdate && selectedField === 'dateOfRetirement'}
                        onEdit={() => handleEdit('dateOfRetirement')}
                        getValues={getValues}
                      />
                      {errors.dateOfRetirement && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.dateOfRetirement.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Calculated Values Section */}
                {calculatedData && (
                  <>
                    <div className="col-span-full">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Service Information
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ReadOnlyField
                          label="Completed Service"
                          value={calculatedData.completedService}
                        />
                        <ReadOnlyField
                          label="Service Left"
                          value={calculatedData.leftOutService}
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Financial Details
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ReadOnlyField
                          label="Basic + DA"
                          value={calculatedData.basicPlusDA.toLocaleString(
                            'en-IN',
                            {
                              style: 'currency',
                              currency: 'INR'
                            }
                          )}
                        />
                        <ReadOnlyField
                          label="Per Day Salary"
                          value={calculatedData.perDaySalary.toLocaleString(
                            'en-IN',
                            {
                              style: 'currency',
                              currency: 'INR'
                            }
                          )}
                        />
                        <ReadOnlyField
                          label="PF Contribution"
                          value={calculatedData.pfContribution.toLocaleString(
                            'en-IN',
                            {
                              style: 'currency',
                              currency: 'INR'
                            }
                          )}
                        />
                        <ReadOnlyField
                          label="SBFP Contribution"
                          value={calculatedData.sbfpContribution.toLocaleString(
                            'en-IN',
                            {
                              style: 'currency',
                              currency: 'INR'
                            }
                          )}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="relative mx-auto mt-24 max-w-7xl lg:px-8 pb-16">
      {/* Steps */}
      <nav aria-label="Progress">
        <ol className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
          {steps.map((step) => (
            <li key={step.id} className="relative md:flex md:flex-1">
              {getStepIcon(step)}

              {/* Divider */}
              {step.id !== steps.length ? (
                <>
                  {/* Arrow separator for lg screens and up */}
                  <div
                    aria-hidden="true"
                    className="absolute right-0 top-0 hidden h-full w-5 md:block"
                  >
                    <svg
                      fill="none"
                      viewBox="0 0 22 80"
                      preserveAspectRatio="none"
                      className="size-full text-gray-300"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        stroke="currentcolor"
                        vectorEffect="non-scaling-stroke"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : null}
            </li>
          ))}
        </ol>
      </nav>

      {/* Step content */}
      <div>
        {renderStepContent(currentStep)}
      </div>

      {/* Navigation buttons */}
      <div className="fixed inset-x-0 bottom-0 flex justify-between px-12 py-4 bg-white border-t border-gray-200">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon
            icon="heroicons:arrow-left"
            className="inline-block w-5 h-5 mr-2"
          />
          Previous
        </button>
        {currentStep !== steps.length ? (
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            onClick={handleNext}
          >
            Next
            <Icon
              icon="heroicons:arrow-right"
              className="inline-block w-5 h-5 ml-2"
            />
          </button>
        ) : (
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            onClick={handleSubmit}
          >
            Finish
          </button>
        )}
      </div>
    </main>
  );
}

export default Calculator;
