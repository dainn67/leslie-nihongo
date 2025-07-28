import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dialog } from "react-native-paper";
import { useTheme } from "../../theme";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import MainButton from "../buttons/MainButton";

interface MyDatePickerProps {
  visible: boolean;
  date: Date;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  setVisible: (visible: boolean) => void;
  handleChange: (selectedDate: Date | undefined) => void;
}

export const MyDatePicker = ({
  visible,
  date,
  title = "Chọn ngày thi",
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  setVisible,
  handleChange,
}: MyDatePickerProps) => {
  const { colors } = useTheme();
  const [tempDate, setTempDate] = useState(date);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
    if (selectedDate) setTempDate(selectedDate);
  };

  const handleConfirm = () => {
    handleChange(tempDate);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Dialog visible={visible} onDismiss={handleCancel} style={[styles.dialog, { backgroundColor: colors.card }]}>
      <Dialog.Title style={[styles.title, { color: colors.text }]}>{title}</Dialog.Title>

      <Dialog.Content style={styles.content}>
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            style={[styles.picker, { backgroundColor: colors.background }]}
            textColor={colors.text}
          />
        </View>
      </Dialog.Content>

      <Dialog.Actions style={styles.actions}>
        <MainButton title={cancelText} onPress={handleCancel} paddingHorizontal={30} paddingVertical={10} />
        <MainButton
          title={confirmText}
          onPress={handleConfirm}
          paddingHorizontal={30}
          paddingVertical={10}
          backgroundColor={colors.primary}
          radius={100}
          textColor={"white"}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 16,
    margin: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 8,
  },
  content: {
    paddingHorizontal: 8,
  },
  pickerContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  picker: {
    width: "100%",
    height: 200,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
