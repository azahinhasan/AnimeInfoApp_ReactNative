import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView,Pressable } from "react-native";
import jiken from "../api/jikan";
import TopAnimeManga from "./component/topAnime";
import SerachBar from "./component/searchBar";
import UpcomingAnime from "./component/upcomingAnime";
const HomeScreen = (props) => {
  const [topAnimeResult, setTopAnimeResult] = useState([]);
  const [topMangaResult, setTopMangaResult] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [search, setSearch] = useState("");
  const [serachType, setSerachType] = useState("anime");
  const [pageAnime, setPageAnime] = useState(1);
  const [pageManga, setPageManga] = useState(1);

  const topAnimeLoad = async (pageNum) => {
    try {
      setPageAnime(pageNum);
      const response = await jiken.get("/top/anime?page=" + pageNum, {});
      //setTopAnimeResult(response.data.top);
      await setTopAnimeResult([...topAnimeResult, ...response.data.data]);
      //setTopAnimeResult(response.data.data.top);
      //console.log(response.data.top,'dddd')

      if (!response.data.data) {
        setErrorMsg("Data Not Found!");
      } else {
        setErrorMsg("");
      }
    } catch (err) {
      console.log(err);
      //setErrorMsg('Something Want Wrong');
    }
  };
  const topMangaLoad = async (pageNum) => {
    try {
      setPageManga(pageNum);
      const response = await jiken.get("/top/manga?page=" + pageNum, {});

      let temp = [...topMangaResult, ...response.data.data];
      setTopMangaResult(temp);
      setErrorMsg("");
    } catch (err) {
      console.log(err);
      //setErrorMsg('Data Not Loaded!');
    }
  };

  const searchResults = async () => {
    console.log("search");
    try {
      const response = await jiken.get("/"+serachType+ "/"+"?q=" + search, {});
      if (response.data.data.length === 0) {
        setErrorMsg("Data Not Found!");
      } else if (search == null) {
        setErrorMsg("");
      } else {
        setErrorMsg("");

        props.navigation.navigate("SerachResult", {
          data: response.data.data,
          search: search,
          type: serachType,
        });
      }
    } catch (err) {
      //console.log(err);
      if (search == "") {
        setErrorMsg("");
      } else {
        setErrorMsg("Data Not Found!");
      }
    }
  };

  const toAnimeHnadler = async () => {
    setSerachType("anime");
  };
  const toMangaHnadler = async () => {
    setSerachType("manga");
  };
  const nextPageAnime = () => {
    if (pageAnime < 20) {
      topAnimeLoad(pageAnime + 1);
    }
  };
  const nextPageManga = () => {
    if (pageManga < 20) {
      topMangaLoad(pageManga + 1);
    }
  };

  const nextZero = () => {
    setPage(1);
    topAnimeLoad();
  };

  useEffect(() => {
    setErrorMsg("");
    topAnimeLoad(1);
    topMangaLoad(1);
  }, []);

  let pageData = "";
  if (serachType == "anime") {
    pageData = (
      <ScrollView>
        <TopAnimeManga
          data={topAnimeResult}
          type={"anime"}
          nextPage={nextPageAnime}
          pageZero={nextZero}
          topAnimeLoad={topAnimeLoad}
        />
        <UpcomingAnime season={"winter"} />
        <UpcomingAnime season={"summer"} />
        <UpcomingAnime season={"fall"} />
      </ScrollView>
    );
  } else {
    pageData = (
      <ScrollView>
        <TopAnimeManga
          data={topMangaResult}
          type={"manga"}
          nextPage={nextPageManga}
        />
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SerachBar
        onTermChange={(newTerm) => setSearch(newTerm)}
        onTermSubmit={searchResults}
        toAnime={toAnimeHnadler}
        toManga={toMangaHnadler}
        serachType={serachType}
      />

      <Text
        style={{ marginLeft: 20, marginTop: 8, marginBottom: 8, color: "red" }}
      >
        {errorMsg}
      </Text>
      {pageData}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeScreen;
