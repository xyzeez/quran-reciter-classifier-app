import colors from "@/constants/colors";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useState, useMemo, useEffect } from "react";
import ReciterSearchBar from "@/components/ReciterSearchBar";
import ReciterListItem from "@/components/ReciterListItem";
import reciterService from "@/services/reciterService";
import { Reciter } from "@/types/reciter";
import SectionListHeader from "@/components/SectionListHeader";

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
  searchHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  searchListContainer: {
    gap: 12,
    height: "100%",
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
    height: 216,
  },
});

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [reciters, setReciters] = useState<Reciter[]>([]);

  useEffect(() => {
    // Get reciters data from service
    const fetchedReciters = reciterService.getAllReciters();
    setReciters(fetchedReciters);
  }, []);

  const filteredReciters = useMemo(() => {
    if (!searchQuery.trim()) {
      return reciters;
    }

    const query = searchQuery.toLowerCase().trim();
    return reciters.filter(
      (reciter) =>
        reciter.name.toLowerCase().includes(query) ||
        reciter.nationality.toLowerCase().includes(query)
    );
  }, [searchQuery, reciters]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Explore Reciters</Text>
      <Text style={styles.text}>
        Browse through our collection of renowned Quran reciters
      </Text>
      <View style={styles.searchListContainer}>
        <ReciterSearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search reciters..."
        />
        <SectionListHeader
          title={
            searchQuery ? `Search results for: ${searchQuery}` : "All reciters"
          }
          count={filteredReciters.length}
        />
        <ScrollView style={styles.listContainer}>
          <View style={styles.reciterList}>
            {filteredReciters.length > 0 ? (
              filteredReciters.map((reciter) => (
                <ReciterListItem key={reciter.name} {...reciter} />
              ))
            ) : (
              <Text style={styles.noResults}>No reciters found</Text>
            )}
          </View>
          <View style={styles.footer}></View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Search;
