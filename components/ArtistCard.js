import React from "react";
import { Image, Text, View } from "react-native";

const ArtistCard = ({ item }) => {
  return (
    <View style={{ margin: 10 }}>
      <Image
        style={{ width: 130, height: 130, borderRadius: 5 }}
        source={{ uri: item.images[0].url }}
      />
      <Text
        style={{ color: "white", fontSize: 13, fontWeight: 500, marginTop: 10 }}
      >
        {item?.name}
      </Text>
    </View>
  );
};

export default ArtistCard;
