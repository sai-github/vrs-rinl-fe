import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';

function TaxDisclaimer() {
    const { t } = useTranslation();

    return (
        <div className="rounded-md bg-yellow-50 p-4 mb-4">
            <div className="flex items-center">
                <div className="shrink-0">
                <Icon aria-hidden="true" icon="heroicons:exclamation-triangle-16-solid" className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="ml-3">
                <div className="text-sm text-yellow-700">
                    {t('tax_disclaimer_message')}
                </div>
                </div>
            </div>
        </div>
    );
}

export default TaxDisclaimer;
