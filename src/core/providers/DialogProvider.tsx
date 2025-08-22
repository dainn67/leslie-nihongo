import React, { Modal, View, Button, Text } from 'react-native';
import { createContext, ReactNode, useContext, useState } from 'react';

type DialogContextType = {
  show: (message: string) => void;
  hide: () => void;
};

const DialogContext = createContext<DialogContextType | null>(null);

export const useDialog = () => {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used inside DialogProvider');
  return ctx;
};

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const show = (msg: string) => {
    setMessage(msg);
    setVisible(true);
  };

  const hide = () => setVisible(false);

  return (
    <DialogContext.Provider value={{ show, hide }}>
      {children}

      {/* Dialog UI */}
      <Modal transparent visible={visible} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, minWidth: 200 }}>
            <Text style={{ marginBottom: 10 }}>{message}</Text>
            <Button title="Close" onPress={hide} />
          </View>
        </View>
      </Modal>
    </DialogContext.Provider>
  );
};
