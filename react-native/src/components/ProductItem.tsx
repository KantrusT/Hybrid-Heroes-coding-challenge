import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Chip } from "react-native-paper";
import { Inventory } from "../store/inventory";

interface ProductItemProps {
  product: Inventory;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const [expanded, setExpanded] = useState(false);
  const imageSize = useRef(new Animated.Value(50)).current;
  const tagsOpacity = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.timing(imageSize, {
      toValue: expanded ? 50 : 70,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(tagsOpacity, {
      toValue: expanded ? 0 : 1, // Fade out if collapsing, fade in if expanding
      duration: 300,
      useNativeDriver: true,
    }).start();

    setExpanded(!expanded);
  };

  const isNew = () => {
    const postedDate = new Date(product.fields.Posted);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const categories = product.fields["Product Categories"]
    ? product.fields["Product Categories"].split(",").map((cat) => cat.trim())
    : [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Animated.Image
          source={
            product.fields["Product Image"]
              ? { uri: product.fields["Product Image"] }
              : require("./assets/placeholder.png")
          }
          style={[
            styles.image,
            {
              width: imageSize,
              height: imageSize,
            },
          ]}
        />
        <View style={styles.infoContainer}>
          <View style={styles.topRow}>
            <Text style={styles.name} numberOfLines={expanded ? undefined : 1}>
              {product.fields["Product Name"]}
            </Text>
            {isNew() && (
              <Image
                source={require('./assets/new.png')}
                style={styles.newBadge}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity onPress={toggleExpand}>
              <MaterialCommunityIcons
                name={expanded ? "chevron-up" : "chevron-down"}
                size={24}
                color="#5e646e"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.date}>{formatDate(product.fields.Posted)}</Text>
          {/* Fade-in tags */}
          {expanded && (
            <Animated.View style={[styles.tagsContainer, { opacity: tagsOpacity }]}>
              {categories.map((category, index) => (
                <Chip key={index} style={styles.chip} textStyle={styles.chipText}>
                  {category}
                </Chip>
              ))}
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f8f9fc",
    marginVertical: 8,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  image: {
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    flexDirection: "column",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  newBadge: {
    width: 36,
    height: 18,
    marginLeft: 8,
  },
  date: {
    fontSize: 12,
    color: "#1b2633",
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    backgroundColor: "#d4e5ff",
    marginRight: 5,
    marginTop: 5,
    height: 28,
  },
  chipText: {
    color: "#5e646e",
    fontSize: 12,
  },
});

export default React.memo(ProductItem);
