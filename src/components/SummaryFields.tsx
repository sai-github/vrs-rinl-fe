import { Icon } from '@iconify/react';

interface SummaryFieldProps {
  label: string;
  value: string | number;
  tooltip?: string;
}

function SummaryField({ label, value, tooltip }: SummaryFieldProps) {
  return (
    <div className="sm:col-span-3">
      <label className="text-sm/6 font-medium text-gray-500 flex items-center">
        {label}
        {tooltip && (
          <span className="ml-2 text-gray-400 hover:text-gray-600 cursor-help">
            <Icon icon="heroicons:information-circle" className="w-4 h-4" />
          </span>
        )}
      </label>
      <div className="mt-2">
        <input
          type="text"
          value={value}
          readOnly
          className="block w-full rounded-md bg-gray-50 px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
        />
      </div>
    </div>
  );
}

export default SummaryField;
