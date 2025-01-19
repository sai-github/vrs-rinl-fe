import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schema using Zod
const calculatorSchema = z.object({
  basic: z
    .string()
    .regex(/^\d+([,]\d+)*$/, 'Enter your basic pay'),
  da: z
    .string()
    .regex(/^\d+([,]\d+)*$/, 'Enter your Dearness Allowance'),
  dateOfJoining: z.string().min(1, 'Date of joining is required'),
  dateOfRetirement: z.string().min(1, 'Expected date of retirement is required'),
  pfMonthlyContribution: z
    .number()
    .min(0, 'PF contribution')
    .default(12),
  sbfpMonthlyContribution: z
    .number()
    .min(0, 'SBFP contribution')
    .default(3)
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

interface CalculatedData extends CalculatorFormData {
  basicPlusDA: number;
  perDaySalary: number;
  todayDate: string;
  completedService: string;
  leftOutService: string;
  completedServiceDecimal: string;
  leftOutServiceDecimal: string;
}

type StepStatus = 'complete' | 'current' | 'upcoming';

interface Step {
  id: number;
  name: string;
  status: StepStatus;
}

function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [calculatedData, setCalculatedData] = useState<CalculatedData | null>(
    null
  );
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, name: 'Your role information', status: 'current' },
    { id: 2, name: 'Details about tenure', status: 'upcoming' },
    { id: 3, name: 'Preview', status: 'upcoming' }
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      pfMonthlyContribution: 12,
      sbfpMonthlyContribution: 3
    }
  });

  const calculateDerivedValues = (data: CalculatorFormData) => {
    const today = new Date();
    const joining = new Date(data.dateOfJoining);
    const retirement = new Date(data.dateOfRetirement);

    // Calculate Basic + DA
    const basicPlusDA =
      data.basic
        .split(',')
        .map(Number)
        .reduce((a, b) => a + b, 0) +
      data.da
        .split(',')
        .map(Number)
        .reduce((a, b) => a + b, 0);

    // Calculate service details
    const completedYears = Math.floor(
      (today.getTime() - joining.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    const leftOutYears = Math.floor(
      (retirement.getTime() - today.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );

    return {
      ...data,
      basicPlusDA,
      perDaySalary: basicPlusDA / 30,
      todayDate: today.toISOString().split('T')[0],
      completedService: `${completedYears} years`,
      leftOutService: `${leftOutYears} years`,
      completedServiceDecimal: completedYears.toFixed(2),
      leftOutServiceDecimal: leftOutYears.toFixed(2)
    };
  };

  const onSubmit = (data: CalculatorFormData) => {
    const calculatedValues = calculateDerivedValues(data);
    setCalculatedData(calculatedValues);
    handleNext();
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

  const handleNext = () => {
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

  const renderStepContent = (id: number) => {
    switch (id) {
      case 1:
        return (
          <div className="space-y-12 p-6">
            <div className="pb-12">
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
                      type="text"
                      {...register('basic')}
                      placeholder="Enter comma-separated values"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.basic && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.basic.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* DA */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    DA (Dearness Allowance)
                  </label>
                  <div className="mt-2">
                    <input
                      type="text"
                      {...register('da')}
                      placeholder="Enter comma-separated values"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.da && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.da.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date of Joining */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    Date of Joining
                  </label>
                  <div className="mt-2">
                    <input
                      type="date"
                      {...register('dateOfJoining')}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
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
                    <input
                      type="date"
                      {...register('dateOfRetirement')}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    {errors.dateOfRetirement && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dateOfRetirement.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* PF Monthly Contribution */}
                <div className="sm:col-span-3">
                  <label className="block text-sm/6 font-medium text-gray-900">
                    PF Monthly Contribution (%)
                  </label>
                  <div className="mt-2">
                    <input
                      type="number"
                      {...register('pfMonthlyContribution', {
                        valueAsNumber: true
                      })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
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
                      {...register('sbfpMonthlyContribution', {
                        valueAsNumber: true
                      })}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Company contribution (3% of Basic plus DA)
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
            <div className='pb-12'>
              <h2 className="text-base/7 font-semibold text-gray-900">
                Calculated Values
              </h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Auto-calculated values based on your input.
              </p>

              {calculatedData && (
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-500">
                      Basic + DA
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={calculatedData.basicPlusDA.toLocaleString()}
                        readOnly
                        className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-500">
                      Per Day Salary
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={calculatedData.perDaySalary.toFixed(2)}
                        readOnly
                        className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-500">
                      Completed Service
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={calculatedData.completedService}
                        readOnly
                        className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm/6 font-medium text-gray-500">
                      Service Left
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        value={calculatedData.leftOutService}
                        readOnly
                        className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Preview</h3>
            {calculatedData && (
              <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
                {JSON.stringify(calculatedData, null, 2)}
              </pre>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="mx-auto mt-24 max-w-7xl lg:px-8">
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
      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStepContent(currentStep)}

        {/* Navigation buttons */}
        <div className="flex justify-between p-4 border-t border-gray-200">
          <button
            type="button"
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
          {currentStep === steps.length ? (
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Finish
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Next
              <Icon
                icon="heroicons:arrow-right"
                className="inline-block w-5 h-5 ml-2"
              />
            </button>
          )}
        </div>
      </form>
    </main>
  );
}

export default Calculator;
