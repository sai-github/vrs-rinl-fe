import { useLocation, Link } from 'react-router';
import { Icon } from '@iconify/react';
import { CalculatedData } from '@/types';
import { formatCurrency } from '@/utils/currencyUtils';
import { formatToDisplayDate } from '@/utils/dateUtils'; // Assume this exists for date formatting

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
        {/* Service Information */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Service Information
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem 
                label="Date of Joining" 
                value={formatToDisplayDate(calculatedData.dateOfJoining)}
              />
              <SummaryItem 
                label="Date of Retirement" 
                value={formatToDisplayDate(calculatedData.dateOfRetirement)}
              />
              <SummaryItem 
                label="Completed Service" 
                value={calculatedData.completedService}
              />
              <SummaryItem 
                label="Service Left" 
                value={calculatedData.leftOutService}
              />
            </dl>
          </div>
        </section>

        {/* Basic Information */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Monthly Salary Details
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem 
                label="Basic Pay" 
                value={formatCurrency(calculatedData.basic)}
              />
              <SummaryItem 
                label="DA" 
                value={formatCurrency(calculatedData.da)}
              />
              <SummaryItem 
                label="Basic + DA" 
                value={formatCurrency(calculatedData.basicPlusDA)}
              />
              <SummaryItem 
                label="Per Day Salary" 
                value={formatCurrency(calculatedData.perDaySalary)}
              />
            </dl>
          </div>
        </section>

        {/* Contributions */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Monthly Contributions
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem 
                label="PF Contribution" 
                value={formatCurrency(calculatedData.pfContribution)}
                tooltip="Monthly PF contribution"
              />
              <SummaryItem 
                label="SBFP Contribution" 
                value={formatCurrency(calculatedData.sbfpContribution)}
                tooltip="Monthly SBFP contribution"
              />
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
                label="Final Compensation"
                value={formatCurrency(calculatedData.vrsCalculations.finalCompensation)}
                tooltip="One-time compensation amount paid at the time of VRS"
              />
              <SummaryItem
                label="After Tax Amount"
                value={formatCurrency(calculatedData.vrsCalculations.afterTaxAmount)}
                tooltip="Net amount after applicable tax deductions on VRS compensation"
              />
              <SummaryItem
                label="Monthly Interest"
                value={formatCurrency(calculatedData.vrsCalculations.monthlyInterest)}
                tooltip="Expected monthly interest earnings from investing the VRS amount"
              />
              <SummaryItem
                label="Matured Amount at Retirement"
                value={formatCurrency(calculatedData.vrsCalculations.maturedAmountAtRetirement)}
                tooltip="Projected value of VRS amount at retirement age including compound interest"
              />
            </dl>
          </div>
        </section>

        {/* Financial Impact */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Financial Impact Analysis
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem
                label="Expected Salary Till Retirement"
                value={formatCurrency(calculatedData.comparisonMetrics.salaryTillRetirement)}
                tooltip="Total salary you would earn if continuing till retirement"
              />
              <SummaryItem
                label="Expected Benefits Till Retirement"
                value={formatCurrency(calculatedData.comparisonMetrics.benefitsTillRetirement)}
                tooltip="Additional benefits and allowances you would receive till retirement"
              />
              <SummaryItem
                label="Total Expected Financial Value"
                value={formatCurrency(calculatedData.comparisonMetrics.totalFinancials)}
                tooltip="Total value of all salary and benefits if working till retirement"
              />
              <SummaryItem
                label="Financial Impact of VRS"
                value={formatCurrency(calculatedData.comparisonMetrics.vrsLoss)}
                tooltip="Direct financial difference between taking VRS versus working till retirement"
              />
              <SummaryItem
                label="Net Impact with Interest"
                value={formatCurrency(calculatedData.comparisonMetrics.vrsLossWithInterest)}
                tooltip="Total financial impact including potential interest earnings/losses"
              />
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