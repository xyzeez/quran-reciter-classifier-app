import colors from "@/constants/colors";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { useState, useMemo, useEffect } from "react";
import ReciterSearchBar from "@/components/ReciterSearchBar";
import ReciterListItem from "@/components/ReciterListItem";
import reciterService from "@/services/reciterService";
import { Reciter } from "@/types/reciter";
import SectionListHeader from "@/components/SectionListHeader";
import TabHeader from "@/components/TabHeader";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    backgroundColor: colors.crest,
    minHeight: "100%",
  },
  searchListContainer: {
    gap: 12,
    flex: 1,
    paddingHorizontal: 16,
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
      <TabHeader
        title="Explore Reciters"
        subtitle="Browse through our collection of renowned Quran reciters"
      />
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
