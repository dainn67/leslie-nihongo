import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useAppTheme } from '../../theme';
import { CustomText } from '../text/customText';
import { useDialog } from '../../core/providers';

export const ResetProgressButton = () => {
  const { colors } = useAppTheme();
  const dialog = useDialog();

  const handleToggle = () => {
    dialog.show('Clear Progress ?');
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleToggle}>
      <Ionicons name={'remove'} size={24} color={colors.primary} style={styles.icon} />
      <CustomText style={[styles.label, { color: colors.text }]}>Xoá Tiến Trình</CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'grey',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
