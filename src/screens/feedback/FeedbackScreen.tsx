import React, { useState } from "react";
import { SafeAreaView, View, Text, Pressable, TextInput, ScrollView, Alert } from "react-native";
import { useColorScheme } from "react-native";
import { AppBar } from "../../components/AppBar";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerParamList } from "../../app/DrawerNavigator";

type Category = "Bug" | "Feature" | "UX" | "Content" | "Other";

export const FeedbackScreen = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const colors = {
    bg: isDark ? "#0B0F14" : "#FFFFFF",
    text: isDark ? "#E6EDF7" : "#0B1220",
    subtext: isDark ? "#A5B0C2" : "#5A6B86",
    border: isDark ? "#1F2A3A" : "#E4E9F2",
    primary: "#3B82F6",
    chipBg: isDark ? "#182233" : "#EEF3FF",
    chipText: isDark ? "#C7D2FE" : "#274690",
    inputBg: isDark ? "#0F1520" : "#FFFFFF",
    placeholder: isDark ? "#6B7280" : "#9AA6B2",
  };

  const [category, setCategory] = useState<Category | null>(null);
  const [message, setMessage] = useState("");

  const canSubmit = category && message.trim().length > 0;

  const drawerNavigation = useNavigation<DrawerNavigationProp<DrawerParamList, "FeedbackScreen">>();

  const handleSubmit = () => {
    if (!canSubmit) return;
    Alert.alert("Thank you!", `Category: ${category}\nMessage: ${message}`);
    setCategory(null);
    setMessage("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <AppBar
        title="Feedback"
        leftIcon={<Ionicons name="menu" size={24} color="white" />}
        onLeftPress={() => drawerNavigation.openDrawer()}
      />
      <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: "700" }}>Feedback</Text>

        {/* Category */}
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>Category</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {(["Bug", "Feature", "UX", "Content", "Other"] as Category[]).map((c) => {
              const selected = category === c;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategory(selected ? null : c)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: selected ? colors.primary : colors.chipBg,
                  }}
                >
                  <Text
                    style={{
                      color: selected ? "#fff" : colors.chipText,
                      fontWeight: "500",
                    }}
                  >
                    {c}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Message */}
        <View style={{ gap: 8 }}>
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: "600" }}>Message</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 8,
              backgroundColor: colors.inputBg,
            }}
          >
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Write your feedback here..."
              placeholderTextColor={colors.placeholder}
              multiline
              style={{
                minHeight: 120,
                padding: 12,
                fontSize: 15,
                color: colors.text,
                textAlignVertical: "top",
              }}
            />
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={{
            backgroundColor: canSubmit ? colors.primary : colors.border,
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: canSubmit ? "#fff" : colors.subtext,
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Gửi phản hồi
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};
