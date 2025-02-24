import { useLocation, Link } from 'react-router';
import { Icon } from '@iconify/react';
import { CalculatedData } from '@/types';
import { formatCurrency } from '@/utils/currencyUtils';

function SummaryItem({
  label,
  value,
  tooltip
}: {
  label: string;
  value: string | number;
  tooltip?: string;
}) {
  return (
    <div>
      <dt className="flex items-center text-sm font-medium text-gray-500">
        {label}
        {tooltip && (
          <span className="ml-2 text-gray-400 hover:text-gray-600 cursor-help">
            <Icon icon="heroicons:information-circle" className="w-4 h-4" />
          </span>
        )}
      </dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  );
}

function Summary() {
  const location = useLocation();
  const { calculatedData } = location.state as {
    calculatedData: CalculatedData;
  };

  return (
    <main className="mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="space-y-12">
        {/* Basic Information */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Basic Information
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem label="Basic Pay" value={calculatedData.basic} />
              <SummaryItem label="DA" value={calculatedData.da} />
              {/* Add more basic info */}
            </dl>
          </div>
        </section>

        {/* VRS Calculations */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              VRS Benefits
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem
                label="Compensation (35 days)"
                value={formatCurrency(
                  calculatedData.vrsCalculations.compensationForCompletedService
                )}
                tooltip="Based on completed service"
              />
              <SummaryItem
                label="Compensation (25 days)"
                value={formatCurrency(
                  calculatedData.vrsCalculations.compensationForLeftService
                )}
                tooltip="Based on remaining service"
              />
              {/* Add more VRS calculations */}
            </dl>
          </div>
        </section>

        {/* Comparison Metrics */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Financial Comparison
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem
                label="Total Till Retirement"
                value={formatCurrency(
                  calculatedData.comparisonMetrics.totalFinancials
                )}
                tooltip="Expected earnings till retirement"
              />
              <SummaryItem
                label="VRS Loss"
                value={formatCurrency(calculatedData.comparisonMetrics.vrsLoss)}
                tooltip="Financial impact of taking VRS"
              />
              {/* Add more comparison metrics */}
            </dl>
          </div>
        </section>

        <div className="flex justify-end space-x-4">
          <Link
            to="/calculator"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Recalculate
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Print Summary
          </button>
        </div>
      </div>
    </main>
  );
}

export default Summary;
