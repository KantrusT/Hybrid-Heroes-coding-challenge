import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FAB } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { actions } from "./store/inventory";
import { StackParamList } from "./App";
import { CameraView, Camera } from "expo-camera";

export default (props: StackScreenProps<StackParamList, "Camera">) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };
    checkPermissions();
  }, []);

  if (hasPermission === null) {
    return <View />;
  } else if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <CameraView
        style={{ flex: 1 }}
        onBarcodeScanned={(code) =>
          dispatch(
            actions.sendInventory(code.data, () => {
              props.navigation.navigate("Home");
            })
          )
        }
      >
        <SafeAreaView style={styles.fab}>
          <FAB
            icon={() => (
              <MaterialCommunityIcons
                name="close"
                size={24}
                color="#0B5549"
              />
            )}
            label="Close Camera"
            onPress={() => props.navigation.goBack()}
          />
        </SafeAreaView>
      </CameraView>
    );
  }
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 16,
    width: "100%",
    flex: 1,
    alignItems: "center"
  }
});
