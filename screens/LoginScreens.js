import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
// import * as AppAuth from "expo-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const LoginScreens = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const expirationDate = await AsyncStorage.getItem("expirationDate");

      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < expirationDate) {
          // The Token is still valid
          navigation.navigate("Main");
        } else {
          // The token would be expired. So, we are going to remove it from the AsyncStorage
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("expirationDate");
          navigation.navigate("Login");
        }
      }
    };

    checkTokenValidity();
  }, []);

  // const authenticate = async () => {
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "cf869acb3ca14fb4b70aa37bb52c9025",
      clientSecret: "fd2e0c2e0f0a4bfeb9fdbbbba7df6c81",
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public", // or "playlist-modify-private"
      ],
      usePKCE: false,
      redirectUri: "exp://192.168.1.6:19000/--/spotify-auth-callback",
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      if (access_token) {
        const expirationDate = new Date(
          response.authentication.expiresIn
        ).getTime();
        AsyncStorage.setItem("token", access_token);
        AsyncStorage.setItem("expirationDate", expirationDate.toString());
        navigation.navigate("Main");
      }
    }
  }, [response]);

  return (
    <LinearGradient colors={["#040306", "#131624"]} style={{ flex: 1 }}>
      <SafeAreaView>
        <View style={{ height: 100 }} />
        <Entypo
          name="spotify"
          size={80}
          color="white"
          style={{ textAlign: "center" }}
        />
        <Text
          style={{
            color: "white",
            textAlign: "center",
            marginTop: 40,
            fontWeight: "bold",
            fontSize: 40,
          }}
        >
          Millions of Songs Free on Spotify!
        </Text>

        <View style={{ height: 80 }} />
        {/* <TouchableOpacity></TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => promptAsync()}
          disabled={!request}
          style={{
            backgroundColor: "#1DB954",
            padding: 10,
            width: 300,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 25,
          }}
        >
          <Text>Sign In with spotify</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#131624",
            padding: 10,
            width: 300,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 25,
            flexDirection: "row",
            marginTop: 20,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
          }}
        >
          <MaterialIcons name="phone-android" size={24} color="white" />
          <Text
            style={{
              fontWeight: 500,
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Continue with phone number
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#131624",
            padding: 10,
            width: 300,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 25,
            flexDirection: "row",
            marginTop: 20,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
          }}
        >
          <AntDesign name="google" size={24} color="red" />
          <Text
            style={{
              fontWeight: 500,
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "#131624",
            padding: 10,
            width: 300,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 25,
            flexDirection: "row",
            marginTop: 20,
            borderColor: "#C0C0C0",
            borderWidth: 0.8,
          }}
        >
          <Entypo name="facebook" size={24} color="#264084" />
          <Text
            style={{
              fontWeight: 500,
              color: "white",
              textAlign: "center",
              flex: 1,
            }}
          >
            Sign In with facebook
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default LoginScreens;

const styles = StyleSheet.create({});
