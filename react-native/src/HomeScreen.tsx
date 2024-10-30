// App.tsx
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  RefreshControl,
  StyleSheet,
  View,
  FlatList,
} from "react-native";
import { Appbar, FAB } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { selectors, actions } from "./store/inventory";
import { RootState } from "./store";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackScreenProps } from "@react-navigation/stack";
import { StackParamList } from "./App";
import ProductItem from "./components/ProductItem"; // Adjust the path as necessary

export default (props: StackScreenProps<StackParamList, "Home">) => {
  const fetching = useSelector(
    (state: RootState) => state.inventory.fetching
  );
  const inventory = useSelector(selectors.selectInventory);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      dispatch(actions.fetchInventory());
    });
    return unsubscribe;
  }, [props.navigation]);

  const renderItem = ({ item }: { item: any }) => <ProductItem product={item} />;

  const keyExtractor = (item: { id: any; }) => item.id;

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style = {styles.header}>
        <Appbar.Content title="Inventory"
        titleStyle={{textAlign: "center"}} 
        />
      </Appbar.Header>

      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        refreshControl={
          <RefreshControl
            refreshing={fetching}
            onRefresh={() => dispatch(actions.fetchInventory())}
          />
        }
        // contentContainerStyle={{ paddingBottom: 80 }} // To prevent FAB overlap
      />
      <SafeAreaView style={styles.fab}>
        <FAB
          icon={() => (
             <MaterialCommunityIcons name="barcode-scan" size={24} color="545454" /> // Changed barcode icon and color
          )}
          label="Scan Product"
          onPress={() => props.navigation.navigate("Camera")}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 10,
    backgroundColor: "#fdfbfc"
  },
  fab: {
    position: "absolute",
    bottom: 50, // Changed bottom padding
    width: "100%",
    flex: 1,
    alignItems: "center"
  }
});
