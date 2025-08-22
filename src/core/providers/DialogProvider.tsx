import React, { ReactNode, useContext, useState } from 'react';
import { createContext } from 'react';
import { ConfirmDialog } from '../../screens/chatbot/components/ConfirmDialog';
import { AlertDialog } from '../../screens/chatbot/components/AlertDialog';

export enum DialogType {
  CONFIRM = 'confirm',
  ALERT = 'alert',
}

type DialogContextType = {
  showConfirm: (message: string, onConfirm: () => void, onCancel?: () => void, confirmText?: string, cancelText?: string) => void;
  showAlert: (message: string, onClose?: () => void, buttonText?: string) => void;
  hide: () => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used inside DialogProvider');
  return ctx;
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
  const [cancelCallback, setCancelCallback] = useState<(() => void) | null>(null);
  const [closeCallback, setCloseCallback] = useState<(() => void) | null>(null);
  const [confirmText, setConfirmText] = useState('Xác nhận');
  const [cancelText, setCancelText] = useState('Hủy');
  const [buttonText, setButtonText] = useState('Đóng');

  const showConfirm = (
    message: string, 
    onConfirm: () => void, 
    onCancel?: () => void, 
    confirmTextParam?: string, 
    cancelTextParam?: string
  ) => {
    setConfirmMessage(message);
    setConfirmCallback(() => onConfirm);
    setCancelCallback(() => onCancel || (() => {}));
    setConfirmText(confirmTextParam || 'Xác nhận');
    setCancelText(cancelTextParam || 'Hủy');
    setConfirmVisible(true);
  };

  const showAlert = (message: string, onClose?: () => void, buttonTextParam?: string) => {
    setAlertMessage(message);
    setCloseCallback(() => onClose || (() => {}));
    setButtonText(buttonTextParam || 'Đóng');
    setAlertVisible(true);
  };

  const hide = () => {
    setConfirmVisible(false);
    setAlertVisible(false);
  };

  const handleConfirm = () => {
    if (confirmCallback) {
      confirmCallback();
    }
    hide();
  };

  const handleCancel = () => {
    if (cancelCallback) {
      cancelCallback();
    }
    hide();
  };

  const handleAlertClose = () => {
    if (closeCallback) {
      closeCallback();
    }
    hide();
  };

  return (
    <DialogContext.Provider value={{ showConfirm, showAlert, hide }}>
      {children}

      {/* Confirm Dialog */}
      <ConfirmDialog
        message={confirmMessage}
        confirmText={confirmText}
        cancelText={cancelText}
        visible={confirmVisible}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />

      {/* Alert Dialog */}
      <AlertDialog
        message={alertMessage}
        buttonText={buttonText}
        visible={alertVisible}
        onClose={handleAlertClose}
      />
    </DialogContext.Provider>
  );
};
