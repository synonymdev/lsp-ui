import React from 'react';
import './index.scss';

export default ({ className }: { className?: string }): JSX.Element => {
	return <div className={`custom-divider ${className}`}></div>;
};
