import { colors } from "@/constants/colors";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useState, useMemo } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ReciterCard } from "@/components/ReciterCard";
import { SearchHeader } from "@/components/SearchHeader";
import recitersData from "@/constants/reciters.json";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: 16,
    paddingTop: 48,
    backgroundColor: colors.crest,
    minHeight: "100%",
  },
  heading: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    textTransform: "capitalize",
    color: colors.green,
    width: "100%",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: colors.black,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  reciterList: {
    gap: 12,
  },
  noResults: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
    color: colors.grey,
    textAlign: "center",
    marginTop: 32,
  },
  footer: {
    height: 96,
  },
});

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReciters = useMemo(() => {
    if (!searchQuery.trim()) {
      return recitersData.reciters;
    }

    const query = searchQuery.toLowerCase().trim();
    return recitersData.reciters.filter(
      (reciter) =>
        reciter.name.toLowerCase().includes(query) ||
        reciter.nationality.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Reciters</Text>
      <Text style={styles.text}>
        Browse through our collection of renowned Quran reciters
      </Text>
      <SearchBar
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search reciters..."
      />
      <SearchHeader query={searchQuery} count={filteredReciters.length} />
      <ScrollView style={styles.listContainer}>
        <View style={styles.reciterList}>
          {filteredReciters.length > 0 ? (
            filteredReciters.map((reciter) => (
              <ReciterCard
                key={reciter.id}
                name={reciter.name}
                nationality={reciter.nationality}
                flagUrl={reciter.flagUrl}
                recordings={reciter.recordings}
                imageUrl={reciter.imageUrl}
              />
            ))
          ) : (
            <Text style={styles.noResults}>No reciters found</Text>
          )}
        </View>
        <View style={styles.footer}></View>
      </ScrollView>
    </View>
  );
};

export default Search;
