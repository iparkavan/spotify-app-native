import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SongItem from "../components/SongItem";
import { useTrackContext } from "../PlayerContext";
import { BottomModal, ModalContent } from "react-native-modals";
import { Audio } from "expo-av";
import { without } from "lodash";
// import { Player } from "../PlayerContext";
// import { BottomModal } from "react-native-modals";
// import { ModalContent } from "react-native-modals";
// import { Audio } from "expo-av";
// import { debounce } from "lodash";

const LikedSongsScreen = () => {
  const navigation = useNavigation();

  const { currentTrack, setCurrentTrack } = useTrackContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [progress, setProgress] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const [input, setInput] = useState();
  const [savedTracks, setSavedTracks] = useState([]);

  useEffect(() => {
    const getSavedTrackes = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const response = await fetch(
        "https://api.spotify.com/v1/me/tracks?offset=0&limit=50",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }

      const data = await response.json();
      setSavedTracks(data.items);
    };

    getSavedTrackes();
    // console.log(savedTracks);
  }, []);

  const playTrack = async () => {
    if (savedTracks.length > 0) {
      setCurrentTrack(savedTracks[0]);
    }

    await play(savedTracks[0]);
  };

  const play = async (nextTrack) => {
    const preview_url = nextTrack?.track?.preview_url;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: preview_url },
        { shouldPlay: true, isLooping: false },
        onPlayBackStatusUpdate
      );
      onPlayBackStatusUpdate(status);
      setCurrentSound(sound);
      console.log("sound", status);
      await sound.playAsync();
    } catch (error) {
      console.log(error.message);
    }
  };

  const onPlayBackStatusUpdate = async (status) => {
    console.log(status);
    if (status.isLoaded && status.isPlaying) {
      const progress = status.positionMillis / status.durationMillis;
      // console.log("Progress", progress);
      setProgress(progress);
      setCurrentTime(progress.positionMillis);
      setTotalDuration(progress.durationMillis);
    }
  };

  const circleSize = 12;

  return (
    <>
      <LinearGradient colors={["#614385", "#516395"]} style={{ flex: 1 }}>
        <ScrollView style={{ marginTop: 50, flex: 1 }}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{ marginHorizontal: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Pressable
            style={{
              marginHorizontal: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 9,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: "#42275a",
                padding: 9,
                flex: 1,
                borderRadius: 3,
                height: 38,
              }}
            >
              <AntDesign name="search1" size={24} color="black" />
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                placeholder="Find in Liked songs"
                placeholderTextColor={"white"}
              />
            </Pressable>

            <Pressable
              style={{
                marginHorizontal: 10,
                backgroundColor: "#42275a",
                padding: 10,
                borderRadius: 3,
                height: 38,
              }}
            >
              <Text style={{ color: "white" }}>Sort</Text>
            </Pressable>
          </Pressable>

          <View style={{ height: 50 }} />
          <View style={{ marginHorizontal: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
              Liked Songs
            </Text>
            <Text style={{ color: "white", fontSize: 13, marginTop: 5 }}>
              430 songs
            </Text>
          </View>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 10,
            }}
          >
            <Pressable
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: "#1DB954",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AntDesign name="arrowdown" size={20} color="white" />
            </Pressable>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <MaterialCommunityIcons
                name="cross-bolnisi"
                size={24}
                color="#1DB954"
              />
              <Pressable
                onPress={playTrack}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#1DB954",
                }}
              >
                <Entypo name="controller-play" size={24} color="white" />
              </Pressable>
            </View>
          </Pressable>

          <FlatList
            showsVerticalScrollIndicator={false}
            data={savedTracks}
            renderItem={({ item }) => <SongItem item={item} />}
          />
        </ScrollView>
      </LinearGradient>

      {currentTrack && (
        <Pressable
          onPress={() => setModalVisible(!modalVisible)}
          style={{
            backgroundColor: "#5072A7",
            width: "90%",
            padding: 10,
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: 15,
            position: "absolute",
            borderRadius: 6,
            left: 20,
            bottom: 10,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              style={{ width: 40, height: 40 }}
              source={{ uri: currentTrack?.track?.album?.images[0].url }}
            />
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                width: 220,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {currentTrack?.track?.name} •{" "}
              {currentTrack?.track?.artists[0].name}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <AntDesign name="heart" size={24} color="#1DB954" />
            <Pressable>
              <AntDesign name="pausecircle" size={24} color="white" />
            </Pressable>
          </View>
        </Pressable>
      )}

      <BottomModal
        visible={modalVisible}
        onHardwareBackPress={() => setModalVisible(false)}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
      >
        <ModalContent
          style={{ height: "100%", width: "100%", backgroundColor: "#5072A7" }}
        >
          <View style={{ height: "100%", width: "100%", marginTop: 40 }}>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AntDesign
                onPress={() => setModalVisible(!modalVisible)}
                name="down"
                size={24}
                color="white"
              />

              <Text
                style={{ fontSize: 14, fontWeight: "bold", color: "white" }}
              >
                {currentTrack?.track?.name}
              </Text>

              <Entypo name="dots-three-vertical" size={24} color="white" />
            </Pressable>

            <View style={{ height: 70 }} />
            <View style={{ padding: 10 }}>
              <Image
                style={{ width: "100%", height: 330, borderRadius: 5 }}
                source={{ uri: currentTrack?.track?.album?.images[0].url }}
              />
              <View
                style={{
                  marginTop: 80,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "white" }}
                  >
                    {currentTrack?.track?.name}
                  </Text>
                  <Text style={{ color: "#D3D3D3", marginTop: 4 }}>
                    {currentTrack?.track?.artists[0].name}
                  </Text>
                </View>

                <AntDesign name="heart" size={24} color="#1DB954" />
              </View>

              <View style={{ marginTop: 10 }}>
                <View
                  style={{
                    width: "100%",
                    marginTop: 10,
                    height: 3,
                    backgroundColor: "gray",
                    borderRadius: 5,
                  }}
                >
                  <View
                    style={{
                      width: `${progress * 100}%`,
                      backgroundColor: "white",
                      height: "100%",
                    }}
                  />
                  <View
                    style={[
                      {
                        position: "absolute",
                        top: -5,
                        width: circleSize,
                        height: circleSize,
                        borderRadius: circleSize / 2,
                        backgroundColor: 'white'
                      },
                      { left:`${progress * 100}%` ,marginLeft: -circleSize / 2}
                    ]}
                  />
                </View>

                <View
                  style={{
                    marginTop: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}
                  >
                    0:00
                  </Text>
                  <Text
                    style={{ color: "white", fontSize: 15, color: "#D3D3D3" }}
                  >
                    0:30
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 17,
                }}
              >
                <Pressable>
                  <FontAwesome name="arrows" size={30} color="#03C03C" />
                </Pressable>
                <Pressable>
                  <Ionicons name="play-skip-back" size={30} color="white" />
                </Pressable>
                <Pressable>
                  {/* <AntDesign name="pausecircle" size={60} color="white" /> */}
                  <Pressable
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: "white",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Entypo name="controller-play" size={26} color="black" />
                  </Pressable>
                </Pressable>
                <Pressable>
                  <Ionicons name="play-skip-forward" size={30} color="white" />
                </Pressable>
                <Pressable>
                  <Feather name="repeat" size={30} color="#03C03C" />
                </Pressable>
              </View>
            </View>
          </View>
        </ModalContent>
      </BottomModal>
    </>
  );
};

export default LikedSongsScreen;

const styles = StyleSheet.create({
  progressBar: {
    height: "100%",
    backgroundColor: "white",
  },
});
