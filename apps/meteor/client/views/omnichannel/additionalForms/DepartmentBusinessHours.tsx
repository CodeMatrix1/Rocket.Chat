import type { SelectOption } from '@rocket.chat/fuselage';
import { Field, FieldError, FieldHint, FieldLabel, FieldRow, SelectFiltered } from '@rocket.chat/fuselage';
import { useEndpoint } from '@rocket.chat/ui-contexts';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useHasLicenseModule } from '../../../hooks/useHasLicenseModule';

export const DepartmentBusinessHours = ({
	value,
	onChange,
}: {
	value?: string;
	onChange: (value: string) => void;
}) => {
	const { t } = useTranslation();
	const { data: hasLicense = false } = useHasLicenseModule('livechat-enterprise');
	const getBusinessHours = useEndpoint('GET', '/v1/livechat/business-hours');
	const { data, isLoading, isError } = useQuery({
		queryKey: ['/v1/livechat/business-hours', 'department-form'],
		queryFn: () => getBusinessHours({ count: 500 }),
		enabled: hasLicense,
	});

	if(isError) {
		console.error('Failed to load business hours', data);
	}

	const options = useMemo<SelectOption[]>(() => {
		const businessHours = data?.businessHours ?? [];
		return businessHours.map((businessHour) => [businessHour._id, businessHour.name]);
	}, [data?.businessHours]);

	if (!hasLicense) {
		return null;
	}

	return (
		<Field>
			<FieldLabel>{t('Business_Hour')}</FieldLabel>
			<FieldRow>
				<SelectFiltered
					value={value || undefined}
					onChange={(nextValue) => onChange(typeof nextValue === 'string' ? nextValue : '')}
					options={options}
					placeholder={t('Select_an_option')}
					flexGrow={1}
				/>
			</FieldRow>
			{isLoading && <FieldHint>{t('Loading...')}</FieldHint>}
			{isError && <FieldError>{t('Something_went_wrong')}</FieldError>}
			{!isLoading && !isError && options.length === 0 && <FieldHint>{t('No_results_found')}</FieldHint>}
		</Field>
	);
};

export default DepartmentBusinessHours;
