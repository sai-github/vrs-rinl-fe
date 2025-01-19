import { Icon } from '@iconify/react';
import { useState } from 'react';

type StepStatus = 'complete' | 'current' | 'upcoming';

interface Step {
  id: number;
  name: string;
  status: StepStatus;
}

function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, name: 'Your role information', status: 'current' },
    { id: 2, name: 'Details about tenure', status: 'upcoming' },
    { id: 3, name: 'Preview', status: 'upcoming' }
  ]);

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
    const step = steps.find((step) => step.id === id);

    if (!step) return null;
    switch (step.id) {
      case 1:
        return (
          <div className="p-6">
            <h3 className="text-lg font-medium">{step.name}</h3>
            {/* Add your details form content here */}
          </div>
        );
      case 2:
        return (
          <div className="p-6">
            <h3 className="text-lg font-medium">{step.name}</h3>
            {/* Add your calculations content here */}
          </div>
        );
      case 3:
        return (
          <div className="p-6">
            <h3 className="text-lg font-medium">{step.name}</h3>
            {/* Add your results content here */}
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
      {renderStepContent(currentStep)}

      {/* Navigation buttons */}
      <div className="flex justify-between p-4 border-t border-gray-200">
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
        <button
          onClick={handleNext}
          disabled={currentStep === steps.length}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <Icon
            icon="heroicons:arrow-right"
            className="inline-block w-5 h-5 ml-2"
          />
        </button>
      </div>
    </main>
  );
}

export default Calculator;
