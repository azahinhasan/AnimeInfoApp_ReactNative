import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import { withNavigation } from "react-navigation";
import jiken from "../../api/jikan";
import ResultsDetail from "./resultDetails";
import Loading from "./loading";

const UpcomingAnime = (props) => {
  const [upcomingAnimeList, setUpcomingAnimeList] = useState();
  const year = new Date().getFullYear();

  const searchResults = async () => {
    try {
    if(upcomingAnimeList){
        setUpcomingAnimeList()
        return
    }
      const response = await jiken.get(
        "/seasons/" + year + "/" + props.season,
        {}
      );
      await setUpcomingAnimeList([...response.data.data]);
      //console.log(response.data.anime);
    } catch (err) {
      console.log(err);
      setErrorMsg("Data Not Found!");
    }
  };



  return (
    <View style={styles.container}>
      <Pressable style={ styles.button} onPress={() => searchResults()}>
        <Text style={styles.title}>
          Upcoming Anime {year} - {props.season}
        </Text>
      </Pressable>

      {upcomingAnimeList&& (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={upcomingAnimeList}
          keyExtractor={(r) => r.mal_id+Math.random()}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("Details", {
                    id: item.mal_id,
                    type: "anime",
                  })
                }
              >
                <ResultsDetail  result={item} />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 15,
    marginBottom: 5,
    textTransform: "capitalize",
  },
  container: {
    marginTop: 5,
    //marginBottom:15,
    borderBottomColor: "black",
    paddingBottom: 10,
    borderBottomWidth: 3,
  },
  data: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    width: Dimensions.get("window").width / 3 - 35,
  },
  image: {
    // width: Dimensions.get('window').width-30,
    width: 100,
    height: 170,
    borderRadius: 4,
    marginBottom: 6,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "white",
    borderWidth: 2,
    paddingTop:3
    
  },
});

//export default withNavigation(TopAnime);

export default withNavigation(UpcomingAnime);
