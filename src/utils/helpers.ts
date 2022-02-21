export const clipCenter = (str: string, maxLength: number): string => {
	if (str.length > maxLength) {
		const center = Math.round(maxLength / 2);
		return `${str.substr(0, center)}...${str.substr(str.length - center, str.length)}`;
	}

	return str;
};

export const test = (): boolean => {
	return true;
};
