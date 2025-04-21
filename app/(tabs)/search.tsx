import { colors } from "@/constants/colors";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useState, useMemo, useEffect } from "react";
import { SearchBar } from "@/components/SearchBar";
import { ReciterCard } from "@/components/ReciterCard";
import { reciterService } from "@/services/reciterService";
import { Reciter } from "@/types/reciter";
import { SectionListHeader } from "@/components/SectionListHeader";

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
  countContainer: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  count: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: colors.green,
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
      <SearchBar
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
              <ReciterCard key={reciter.name} {...reciter} />
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
