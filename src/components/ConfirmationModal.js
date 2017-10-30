import Modal from 'react-modal';
import styled from 'styled-components';
import React from 'react';
import Colors from '../constants/Colors';

const ConfirmButton = styled.button`
  background: ${Colors.blue};
  color: #fff;
  border: 0;
  padding: 12px;
  min-width: 150px;
  text-align: center;
  border-radius: 3px;
  margin-right: 36px;
  font-size: 15px;
  cursor: pointer;
`;

const CancelButton = styled.button`
  background: ${Colors.white};
  color: ${Colors.grayDark};
  border: 0;
  padding: 12px 0px;
  text-align: center;
  border-radius: 3px;
  font-size: 15px;
  cursor: pointer;
`;
const ModalContent = styled.div`
  padding: 0 0 30px;

  .pagination-bottom {
    display: none;
  }
`;
const ConfirmationModal = props => {
  const {
    children,
    title,
    handleConfirm,
    handleCancel,
    confirmText,
    cancelText,
  } = props;
  return (
    <Modal {...props}>
      <h1>{title}</h1>
      <ModalContent>{children}</ModalContent>
      <ConfirmButton onClick={handleConfirm}>{confirmText}</ConfirmButton>
      <CancelButton onClick={handleCancel}>{cancelText}</CancelButton>
    </Modal>
  );
};

ConfirmationModal.defaultProps = {
  confirmText: 'Yup, do it.',
  cancelText: 'Nah, nevermind.',
  handleCancel: () => {},
  handleConfirm: () => {},
  title: '',
};

export default ConfirmationModal;
