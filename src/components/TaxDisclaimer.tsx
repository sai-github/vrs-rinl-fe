import { Icon } from '@iconify/react';

function TaxDisclaimer() {
    return (
        <div className="rounded-md bg-yellow-50 p-4 mb-4">
            <div className="flex items-center">
                <div className="shrink-0">
                <Icon aria-hidden="true" icon="heroicons:exclamation-triangle-16-solid" className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="ml-3">
                <div className="text-sm text-yellow-700">
                    Tax calculations shown are for March 2025 VRS benefits. Please check against your chosen tax regime.
                </div>
                </div>
            </div>
        </div>
    );
}

export default TaxDisclaimer;
