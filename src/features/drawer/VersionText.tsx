import React from "react";
import { AppConfig } from "../../constants/appConfig";
import { CustomText } from "../../components/text/customText";

export const VersionText = () => {
  return (
    <CustomText
      style={{ marginLeft: 16, fontSize: 14, textDecorationLine: "underline", fontStyle: "italic" }}
    >{`Phiên bản: ${AppConfig.version} (${AppConfig.buildVersion})`}</CustomText>
  );
};
