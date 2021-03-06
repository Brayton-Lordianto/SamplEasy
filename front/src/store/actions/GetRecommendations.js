import request from "@/api/http";

export const GetRecommendations = ({ getters, commit }) => {
  const filters = getters["filters"];
  let searchTab = [];
  console.log("Filters:", filters);
  if (filters.genres.length !== 0)
    searchTab.push(`seed_genres=${filters.genres.join(",")}`);
  if (filters.key !== null) searchTab.push(`target_key=${filters.key}`);
  if (filters.tempo !== null) searchTab.push(`target_tempo=${filters.tempo}`);
  if (filters.popularity !== null)
    searchTab.push(
      `min_popularity=${filters.popularity.value - 25}&max_popularity=${
        filters.popularity.value
      }`
    );
  const query = {
    method: "GET",
    url: `https://api.spotify.com/v1/recommendations?${searchTab.join("&")}`,
  };

  console.log("URL:", query.url);
  return request(query).then((data) => {
    console.log("Data:", data);
    const dataFormatted = data.tracks.map((t) => {
      return {
        id: t.id,
        uri: t.uri,
        name: t.name,
        popularity: t.popularity,
        mainArtist: t.artists[0].name,
        img: t.album.images[2].url,
        album: t.album.name,
      };
    });
    commit("setRecommendations", dataFormatted);
  });
};
