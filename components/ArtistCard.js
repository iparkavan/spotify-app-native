import React from "react";
import { Image, View } from "react-native";

const ArtistCard = ({ item }) => {
  return (
    <View>
      <Image
        style={{ width: 130, height: 130, borderRadius: 5 }}
        sourcey={{ uri: item.image[0].url }}
      />
    </View>
  );
};

export default ArtistCard;
