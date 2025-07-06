import { useState } from 'react';
import { useLocation, Link } from 'react-router';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { CalculatedData } from '@/types';
import { formatCurrency } from '@/utils/currencyUtils';
import { formatToDisplayDate } from '@/utils/dateUtils';
import InfoDrawer from './InfoDrawer';
import TaxDisclaimer from './TaxDisclaimer';

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
  const valueClassName = `mt-1 text-2xl print:text-xl font-semibold tracking-tight ${
    highlightType === 'GOOD'
      ? 'text-green-600'
      : highlightType === 'BAD'
      ? 'text-red-600'
      : 'text-gray-900'
  }`;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg bg-white p-3 shadow-sm sm:p-6">
      <dt className="truncate flex items-center text-sm font-medium text-gray-500">
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

function SummaryTitle({ title }: { title: string }) {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      <div className="relative flex justify-start">
        <span className="bg-white pr-3 text-base font-semibold text-indigo-600">{title}</span>
      </div>
    </div>
  );
}

function Summary() {
  const location = useLocation();
  const { t } = useTranslation();
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

      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-gray-900">
          {t('summary_basic_info')}
        </h2>

        {/* Service Information */}
        <section className="p-2 sm:p-4">
          <SummaryTitle title={t('summary_service_info')} />
          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryItem
              label={t('calculator_doj')}
              value={formatToDisplayDate(calculatedData.dateOfJoining)}
              tooltip={t('summary_tooltip_doj')}
            />
            <SummaryItem
              label={t('calculator_dor')}
              value={formatToDisplayDate(calculatedData.dateOfRetirement)}
              tooltip={t('summary_tooltip_dor')}
            />
            <SummaryItem
              label={t('calculator_completed_service')}
              value={calculatedData.completedService}
              tooltip={t('summary_tooltip_completed')}
            />
            <SummaryItem
              label={t('calculator_service_left')}
              value={calculatedData.leftOutService}
              tooltip={t('summary_tooltip_left')}
            />
          </dl>
        </section>

        {/* Monthly Salary Details section */}
        <section className="p-2 sm:p-4 mt-2">
          <SummaryTitle title={t('summary_monthly_salary')} />
          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryItem
              label={t('calculator_basic_pay')}
              value={formatCurrency(calculatedData.basic)}
              tooltip={t('summary_tooltip_basic')}
            />
            <SummaryItem
              label={t('calculator_da')}
              value={formatCurrency(calculatedData.da)}
              tooltip={t('summary_tooltip_da')}
            />
            <SummaryItem
              label={t('calculator_basic_da')}
              value={formatCurrency(calculatedData.basicPlusDA)}
              tooltip={t('summary_tooltip_basic_da')}
            />
            <SummaryItem
              label={t('calculator_per_day')}
              value={formatCurrency(calculatedData.perDaySalary)}
              tooltip={t('summary_tooltip_per_day')}
            />
          </dl>
        </section>

        {/* Monthly Contributions section */}
        <section className="p-2 sm:p-4 mt-2">
          <SummaryTitle title={t('summary_monthly_contributions')} />
          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryItem
              label={t('calculator_pf_contribution')}
              value={formatCurrency(calculatedData.pfContribution)}
              tooltip={t('summary_tooltip_pf')}
            />
            <SummaryItem
              label={t('calculator_sbfp_contribution')}
              value={formatCurrency(calculatedData.sbfpContribution)}
              tooltip={t('summary_tooltip_sbfp')}
            />
          </dl>
        </section>

        <h2 className="text-xl font-extrabold text-gray-900 benefits-section">
          {t('summary_benefits_calc')}
        </h2>

        <TaxDisclaimer />
        
        {/* VRS Calculations */}
        <section className="p-2 sm:p-4 mt-2">
          <SummaryTitle title={t('summary_vrs_benefits')} />
          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryItem
              label={t('summary_final_comp')}
              value={formatCurrency(calculatedData.vrsCalculations.finalCompensation)}
              tooltip={t('summary_tooltip_final_comp')}
            />
            <SummaryItem
              label={t('summary_after_tax')}
              value={formatCurrency(calculatedData.vrsCalculations.afterTaxAmount)}
              tooltip={t('summary_tooltip_after_tax')}
            />
            <SummaryItem
              label={t('summary_monthly_interest')}
              value={formatCurrency(calculatedData.vrsCalculations.monthlyInterest)}
              tooltip={t('summary_tooltip_monthly_interest', { rate: calculatedData.bankInterestRate })}
            />
            <SummaryItem
              label={t('summary_matured_amount')}
              value={formatCurrency(calculatedData.vrsCalculations.maturedAmountAtRetirement)}
              tooltip={t('summary_tooltip_matured')}
              highlightType="GOOD"
            />
          </dl>
        </section>

        {/* Financial Impact */}
        <section className="p-2 sm:p-4 mt-2">
          <SummaryTitle title={t('summary_financial_impact')} />
          <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryItem
              label={t('summary_expected_salary')}
              value={formatCurrency(calculatedData.comparisonMetrics.salaryTillRetirement)}
              tooltip={t('summary_tooltip_expected_salary')}
            />
            <SummaryItem
              label={t('summary_expected_benefits')}
              value={formatCurrency(calculatedData.comparisonMetrics.benefitsTillRetirement)}
              tooltip={t('summary_tooltip_expected_benefits')}
            />
            <SummaryItem
              label={t('summary_total_financial')}
              value={formatCurrency(calculatedData.comparisonMetrics.totalFinancials)}
              tooltip={t('summary_tooltip_total_financial')}
            />
            <SummaryItem
              label={t('summary_vrs_impact')}
              value={formatCurrency(calculatedData.comparisonMetrics.vrsLoss)}
              tooltip={t('summary_tooltip_vrs_impact')}
            />
            <SummaryItem
              label={t('summary_net_impact')}
              value={formatCurrency(calculatedData.comparisonMetrics.vrsLossWithInterest)}
              tooltip={t('summary_tooltip_net_impact')}
              highlightType="BAD"
            />
          </dl>
        </section>

        {/* Action btns */}
        <div className="flex justify-center md:justify-end space-x-4 print:hidden">
          <Link
            to="/calculator"
            className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            {t('summary_recalculate')}
          </Link>
          <button
            onClick={() => window.print()}
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t('summary_print')}
          </button>
        </div>

        {/* Contact Me Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 print:hidden">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
                {t('summary_get_in_touch')}
              </h2>
              <p className="mt-4 text-base text-gray-600 font-mono">
                {t('summary_feedback')} <a href="mailto:saiediitm@gmail.com" className="font-semibold text-indigo-600">
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
