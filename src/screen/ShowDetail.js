import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { withNavigation } from "react-navigation";
//npm install --save moment
import jiken from "../api/jikan";
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from "rn-placeholder";

const TopAnime = (props) => {
  const [info, setInfo] = useState("");
  const [aired, setAired] = useState("");
  const [studios, setStudios] = useState("");
  const [licensors, setLicensors] = useState("");
  const [genres, setGenres] = useState([]);
  const id = props.navigation.getParam("id");
  const type = props.navigation.getParam("type");
  const [errorMsg, setErrorMsg] = useState("");

  const loadDetails = async () => {
    try {
      const response = await jiken.get("/" + type + "/" + id, {});
      setInfo(response.data.data);
      setAired(response.data.data.aired.string);
      setLicensors(response.data.data.licensors[0].name);
      setStudios(response.data.data.studios[0].name);
      setGenres(response.data.data.genres);
    } catch (err) {
      console.log(err);
      setErrorMsg("Data Not Found!");
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  return (
    <View style={styles.container}>
      {info.title != null ? (
        <ScrollView>
          <Text style={styles.taitleTitle}>Details</Text>
          <Image style={styles.image} source={{ uri: info.images.jpg.image_url }} />
          <Text></Text>
          <Text style={styles.title}>Information</Text>
          <Text>Name: {info.title}</Text>
          <Text>Japanese Name: {info.title_japanese}</Text>
          <Text>
            Total Episodes: {info.episodes == null ? "Unknown" : info.episodes}
          </Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate("SerachResultGenre", {
                type: info.type,
                searchTopic: info.type,
              })
            }
          >
            <Text>Type:{info.type}</Text>
          </TouchableOpacity>
          <Text>Aired: {aired}</Text>
          <Text>Duration: {info.duration}</Text>
          <Text>Licensors: {licensors}</Text>
          <Text>Studios: {studios}</Text>
          <Text>Rating: {info.rating}</Text>

          <Text></Text>
          <Text style={styles.title}>Genres</Text>
          {/* <FlatList
                style={styles.genres}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={info.genres}
                    renderItem={({item}) =>{
                        return(
                            <Text>{item.name}  </Text>
                        ) 
            }}/> */}

          {/* <TouchableOpacity>
                {genres.map((data,i)=>
                    <Pressable  
                    key={data.mal_id}
                    onPress={()=>props.navigation.navigate('Details',{id : data.mal_id,type:data.name})}
                    >
                        {data.name}    </Pressable>
                )
                }
            </TouchableOpacity> */}

          <Text>
            {genres.map((data, i) => (
              <TouchableOpacity
                style={styles.TouchableOpacity}
                onPress={() =>
                  props.navigation.navigate("SerachResultGenre", {
                    id: data.mal_id,
                    searchTopic: data.name,
                  })
                }
              >
                <Text key={i}>{data.name} </Text>
              </TouchableOpacity>
            ))}
          </Text>

          <Text></Text>
          <Text style={styles.title}>Statistics</Text>
          <Text>Score: {info.score == null ? "NaN" : info.score}</Text>
          <Text>Rank: {info.rank == null ? "NaN" : info.rank}</Text>
          <Text>Popularity Rank: {info.popularity}</Text>

          <Text></Text>
          <Text style={styles.title}>Synopsis</Text>
          <Text>{info.synopsis}</Text>
        </ScrollView>
      ) : (
        <Placeholder Animation={Fade}>
          <Text style={styles.taitleTitle}>Details</Text>
          <PlaceholderMedia style={{ width: 100, height: 160 }} />
          <Text />
          <PlaceholderLine width={90} />
          <PlaceholderLine width={50} />
          <PlaceholderLine width={50} />
          <PlaceholderLine width={30} />
          <PlaceholderLine width={40} />
          <PlaceholderLine width={65} />
          <PlaceholderLine width={45} />
          <PlaceholderLine width={20} />
          <PlaceholderLine width={50} />
          <PlaceholderLine width={80} />
          <PlaceholderLine width={40} />
        </Placeholder>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  taitleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textDecorationLine: "underline",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    paddingBottom: 5,
    borderBottomWidth: 2,
  },
  container: {
    marginTop: 30,
    marginLeft: 15,
    // borderBottomColor:'#F0EADE',
    // paddingBottom:10,
  },
  data: {
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    width: Dimensions.get("window").width / 3 - 35,
  },
  image: {
    //width:Dimensions.get('window').width-80,
    width: 130,
    height: 200,
    borderRadius: 4,
    marginBottom: 6,
  },
  name: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  genres: {
    width: 100,
  },
  TouchableOpacity: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginRight: 50,
  },
});

export default withNavigation(TopAnime);
