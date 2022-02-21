import TimeAgo, { CommonUnit } from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const orderExpiryFormatLabels = (unit: CommonUnit): any => {
	return {
		past: {
			one: `expired {0} ${unit} ago`,
			other: `expired {0} ${unit}s ago`
		},
		future: {
			one: `expires in {0} ${unit}`,
			other: `expires in {0} ${unit}`
		}
	};
};

const orderExpiryLabels = {
	year: orderExpiryFormatLabels('year'),
	month: orderExpiryFormatLabels('month'),
	week: orderExpiryFormatLabels('week'),
	day: orderExpiryFormatLabels('day'),
	hour: orderExpiryFormatLabels('hour'),
	minute: orderExpiryFormatLabels('minute'),
	second: orderExpiryFormatLabels('second')
};

TimeAgo.addLabels('en', 'long', orderExpiryLabels);

export const clipCenter = (str: string, maxLength: number): string => {
	if (str.length > maxLength) {
		const center = Math.round(maxLength / 2);
		return `${str.substr(0, center)}...${str.substr(str.length - center, str.length)}`;
	}

	return str;
};

export const orderExpiryFormat = (timestamp: number): string => {
	return timeAgo.format(new Date(timestamp)).toString();
};
