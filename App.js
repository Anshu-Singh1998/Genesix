import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Dimensions, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import WallpaperManager from '@ajaybhatia/react-native-wallpaper-manager';
import axios from 'axios';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const App = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://api.unsplash.com/search/photos?query=wanderlust");
        setData(response.data.results);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSetWallpaper = async (imageUrl) => {
    try {
      await WallpaperManager.setWallpaper({ uri: imageUrl, screen: 'home' });
      Alert.alert('Wallpaper Set Successfully');
    } catch (error) {
      Alert.alert('Error setting wallpaper', error.message);
    }
  };

  const dataViewer = ({ item }) => (
    <TouchableOpacity onPress={() => handleSetWallpaper(item.urls.regular)}>
      <View>
        <Image source={{ uri: item.urls.regular }} style={{ height: height, width: width }} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="orange" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={dataViewer}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default App;
