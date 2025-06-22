import { useState } from 'react';
import { useLocation, Link } from 'react-router';
import { Icon } from '@iconify/react';
import { CalculatedData } from '@/types';
import { formatCurrency } from '@/utils/currencyUtils';
import { formatToDisplayDate } from '@/utils/dateUtils'; // Assume this exists for date formatting
import InfoDrawer from './InfoDrawer';

function SummaryItem({
  label,
  value,
  highlightType,
  tooltip
}: {
  label: string;
  value: string | number;
  highlightType?: 'GOOD' | 'BAD';
  tooltip?: string;
}) {
  const valueClassName = `mt-1 text-sm ${
    highlightType === 'GOOD'
      ? 'text-green-600 font-bold'
      : highlightType === 'BAD'
        ? 'text-red-600 font-bold'
        : 'text-gray-900'
  }`;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div>
      <dt className="flex items-center text-sm font-medium text-gray-500">
        {label}
        {tooltip && (
          <>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="ml-2 text-gray-400 hover:text-gray-600"
            >
              <Icon icon="heroicons:information-circle" className="w-4 h-4" />
            </button>
            <InfoDrawer
              isOpen={isDrawerOpen}
              setIsOpen={setIsDrawerOpen}
              title={label}
              content={tooltip}
            />
          </>
        )}
      </dt>
      <dd className={valueClassName}>{value}</dd>
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
      <style>
        {`
      @media print {
        .benefits-section {
          page-break-before: always;
        }
      }
    `}
      </style>

      <div className="space-y-12">
        <h2 className="text-xl font-extrabold text-gray-900">
          Your basic information
        </h2>

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
                tooltip="Your initial date of joining the organization"
              />
              <SummaryItem
                label="Date of Retirement"
                value={formatToDisplayDate(calculatedData.dateOfRetirement)}
                tooltip="Expected date of retirement if continuing with organization"
              />
              <SummaryItem
                label="Completed Service"
                value={calculatedData.completedService}
                tooltip="Total completed years and months of service (in decimal format)"
              />
              <SummaryItem
                label="Service Left"
                value={calculatedData.leftOutService}
                tooltip="Remaining years and months until retirement (in decimal format)"
              />
            </dl>
          </div>
        </section>

        {/* Monthly Salary Details section */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Monthly Salary Details
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem
                label="Basic Pay"
                value={formatCurrency(calculatedData.basic)}
                tooltip="Your current basic salary component"
              />
              <SummaryItem
                label="DA"
                value={formatCurrency(calculatedData.da)}
                tooltip="Current Dearness Allowance based on latest rates"
              />
              <SummaryItem
                label="Basic + DA"
                value={formatCurrency(calculatedData.basicPlusDA)}
                tooltip="Total of Basic Pay and Dearness Allowance"
              />
              <SummaryItem
                label="Per Day Salary"
                value={formatCurrency(calculatedData.perDaySalary)}
                tooltip="Daily salary calculated based on Basic + DA"
              />
            </dl>
          </div>
        </section>

        {/* Monthly Contributions section */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Monthly Contributions
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem
                label="PF Contribution"
                value={formatCurrency(calculatedData.pfContribution)}
                tooltip="Company's contribution of 12% of (Basic + DA) - (including EPS 95 contribution which is paid to employee)"
              />
              <SummaryItem
                label="SBFP Contribution"
                value={formatCurrency(calculatedData.sbfpContribution)}
                tooltip="Company's contribution of 3% of Basic plus DA"
              />
            </dl>
          </div>
        </section>

        <h2 className="text-xl font-extrabold text-gray-900 benefits-section">
          Benefits calculations
        </h2>
        {/* VRS Calculations */}
        <section className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              VRS Benefits
            </h3>
            <dl className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <SummaryItem
                label="Final Compensation"
                value={formatCurrency(
                  calculatedData.vrsCalculations.finalCompensation
                )}
                tooltip="VRS compensation calculated as: 35 days salary for completed years + 25 days salary for remaining years (Gujarat Pattern), capped at total Basic+DA till retirement"
              />
              <SummaryItem
                label="After Tax Amount"
                value={formatCurrency(
                  calculatedData.vrsCalculations.afterTaxAmount
                )}
                tooltip="Net amount after tax consideration (₹5 Lakh exempt, remaining taxed at 32%)"
              />
              <SummaryItem
                label="Monthly Interest"
                value={formatCurrency(
                  calculatedData.vrsCalculations.monthlyInterest
                )}
                tooltip={`Expected monthly interest earnings from VRS amount at ${calculatedData.bankInterestRate}% bank rate`}
              />
              <SummaryItem
                label="Matured Amount at Retirement"
                value={formatCurrency(
                  calculatedData.vrsCalculations.maturedAmountAtRetirement
                )}
                tooltip="Projected value of VRS amount at retirement considering compound interest annually"
                highlightType="GOOD"
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
                value={formatCurrency(
                  calculatedData.comparisonMetrics.salaryTillRetirement
                )}
                tooltip="Total Basic + DA + perks till retirement (after 32% tax) from current date"
              />
              <SummaryItem
                label="Expected Benefits Till Retirement"
                value={formatCurrency(
                  calculatedData.comparisonMetrics.benefitsTillRetirement
                )}
                tooltip="Total PF + SBFP contributions till retirement (tax exempt)"
              />
              <SummaryItem
                label="Total Expected Financial Value"
                value={formatCurrency(
                  calculatedData.comparisonMetrics.totalFinancials
                )}
                tooltip="Total value including salary (post-tax) and benefits (tax-exempt) if working till retirement"
              />
              <SummaryItem
                label="Financial Impact of VRS"
                value={formatCurrency(calculatedData.comparisonMetrics.vrsLoss)}
                tooltip="Direct financial loss: Total receivables till retirement (excluding taxes) minus VRS amount after tax"
              />
              <SummaryItem
                label="Net Impact with Interest"
                value={formatCurrency(
                  calculatedData.comparisonMetrics.vrsLossWithInterest
                )}
                tooltip="Total financial impact considering VRS amount invested at 5.5% compound interest till retirement"
                highlightType="BAD"
              />
            </dl>
          </div>
        </section>

        {/* Action btns */}
        <div className="flex justify-end space-x-4 print:hidden">
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

        {/* Contact Me Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight text-gray-900">Get in touch</h2>
              <p className="mt-4 text-base text-gray-600">
                Have feedback? Feel free to reach out at <a href="mailto:saiediitm@gmail.com" className="font-semibold text-indigo-600">
                  saiediitm@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* made with love footer */}
        <footer className="py-4 text-center text-sm text-gray-500">
          <span>
            Made with ❤️ on <span className="text-green-600 font-semibold">RINL</span>
          </span>
        </footer>
      </div>
    </main>
  );
}

export default Summary;
