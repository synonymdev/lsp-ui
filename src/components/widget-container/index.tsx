import React, { ReactElement } from 'react';
import { Row } from 'react-bootstrap';
import './index.scss';

export default ({ children }): ReactElement => (
	<>
		<div className={'glowy-main1'} />
		<div className={'glowy-main2'} />
		<div className={'glowy-main3'} />
		<Row className={'widget-container'}>{children}</Row>
	</>
);
