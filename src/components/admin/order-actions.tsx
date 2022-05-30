import { Button, Modal, Form, Alert } from 'react-bootstrap';
import React, { useState } from 'react';
import { btAdmin, IAdminActionResponse } from '@synonymdev/blocktank-client';

export default ({ orderId }: { orderId: string }): JSX.Element => {
	const [txId, setTxId] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showActionModalType, setShowActionModalType] = useState<
		'credit_order' | 'refund_order' | 'close_channel' | undefined
	>(undefined);

	let title = '';
	let txFieldLabel = '';
	let body = '';
	let buttonTitle = 'Submit';
	switch (showActionModalType) {
		case 'refund_order': {
			title = 'Refund order';
			txFieldLabel = 'Refund transaction ID';
			buttonTitle = 'Refund';
			break;
		}
		case 'credit_order': {
			title = 'Credit order';
			txFieldLabel = 'Payment transaction ID';
			buttonTitle = 'Credit order';
			break;
		}
		case 'close_channel': {
			title = 'Close channel';
			body = "Are you sure you want to close this order's channel?";
			buttonTitle = 'Close channel';
			break;
		}
		default:
	}

	const onSubmit = async (): Promise<void> => {
		setIsSubmitting(true);
		try {
			switch (showActionModalType) {
				case 'credit_order': {
					await btAdmin.manualCredit({ tx_id: txId, order_id: orderId });
					break;
				}
				case 'refund_order': {
					await btAdmin.refund({ refund_tx: txId, order_id: orderId });
					break;
				}
				case 'close_channel': {
					await btAdmin.close({ order_id: orderId });
					break;
				}
				default:
			}

			onClose();
		} catch (e) {
			setError(e.toString());
		} finally {
			setIsSubmitting(false);
		}
	};

	const onClose = (): void => {
		if (isSubmitting) {
			return;
		}

		setShowActionModalType(undefined);
		setError('');
	};

	return (
		<>
			<Button variant='primary' onClick={() => setShowActionModalType('credit_order')}>
				Manual credit
			</Button>{' '}
			<Button variant='warning' onClick={() => setShowActionModalType('refund_order')}>
				Refund
			</Button>{' '}
			<Button variant='danger' onClick={() => setShowActionModalType('close_channel')}>
				Close channel
			</Button>
			<Modal show={!!showActionModalType} keyboard={false} onHide={onClose}>
				<Modal.Header closeButton>
					<Modal.Title>{title}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{txFieldLabel ? (
						<Form>
							<Form.Group>
								<Form.Label>{txFieldLabel}</Form.Label>
								<Form.Control type='text' value={txId} onChange={(e) => setTxId(e.target.value)} />
							</Form.Group>
						</Form>
					) : null}
					{body ? <p>{body}</p> : null}

					<br />
					<Alert show={!!error} variant={'danger'}>
						{error}
					</Alert>
				</Modal.Body>
				<Modal.Footer>
					<Button variant='light' onClick={onClose}>
						Cancel
					</Button>
					<Button variant='primary' onClick={onSubmit} disabled={isSubmitting}>
						{isSubmitting ? 'Submitting...' : buttonTitle}
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
};
