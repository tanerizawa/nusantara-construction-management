import React from 'react';
import ReactDOM from 'react-dom';

const MODAL_ROOT_ID = 'modal-root';

export default function ModalPortal({ children }) {
  let modalRoot = document.getElementById(MODAL_ROOT_ID);
  if (!modalRoot) {
    modalRoot = document.createElement('div');
    modalRoot.id = MODAL_ROOT_ID;
    document.body.appendChild(modalRoot);
  }
  return ReactDOM.createPortal(children, modalRoot);
}
