import React from "react";
import { Image, Pressable, Text } from "react-native";

const RecentlyPlayedCard = ({ item }) => {
  return (
    <Pressable style={{ margin: 10 }}>
      <Image
        style={{ width: 130, height: 130, borderRadius: 5 }}
        source={{ uri: item.track.album.images[0].url }}
      />
      <Text
        numberOfLines={1}
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: "white",
          marginTop: 10,
        }}
      >
        {item?.track?.name}
      </Text>
    </Pressable>
  );
};

export default RecentlyPlayedCard;
