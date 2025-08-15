import Toast from "react-native-toast-message";

export class ToastService {
  static show({
    message,
    type = "success",
    position = "top",
    duration = 2000,
  }: {
    message: string;
    type?: "success" | "error" | "info";
    position?: "top" | "bottom";
    duration?: number;
  }) {
    Toast.show({
      type: type,
      text1: message,
      position: position,
      autoHide: true,
      visibilityTime: duration,
      text1Style: { fontSize: 16, fontWeight: "bold", fontFamily: "Inter-Regular" },
    });
  }
}
