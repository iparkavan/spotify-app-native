import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SongInfoScreens = () => {
  const route = useRoute();
  const [tracks, setTracks] = useState([]);
  // console.log(route.params);
  const album_url = route?.params?.item?.track?.album?.uri;
  const albumId = album_url.split(":")[2];
  console.log(albumId);

  useEffect(() => {
    const fetchSongs = async () => {
      const accessToken = await AsyncStorage.getItem("token");

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/albums/${albumId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch album songs");
        }

        const data = await response.json();
        const tracks = data.items;
        setTracks(tracks);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchSongs();
  }, []);
  
  console.log(tracks);

  return (
    <View>
      <Text>SongInfoScreens</Text>
    </View>
  );
};

export default SongInfoScreens;

const styles = StyleSheet.create({});
