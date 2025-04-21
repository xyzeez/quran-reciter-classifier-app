import colors from "@/constants/colors";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { InputMethodToggleProps } from "@/types/ui";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.greyLight,
    marginTop: 32,
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    paddingInline: 14,
  },
  itemActive: {
    alignItems: "center",
    justifyContent: "center",
    paddingInline: 12,
    backgroundColor: colors.greenLight,
  },
  itemRecordActive: {
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    marginTop: -1,
    marginLeft: -1,
    paddingInline: 12,
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.green,
    borderTopStartRadius: 4,
    borderBottomStartRadius: 4,
  },
  itemUploadActive: {
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    marginTop: -1,
    marginRight: -1,
    paddingInline: 12,
    backgroundColor: colors.greenLight,
    borderWidth: 1,
    borderColor: colors.green,
    borderTopEndRadius: 4,
    borderBottomEndRadius: 4,
  },
  text: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: colors.grey,
  },
  textActive: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: colors.green,
  },
});

const InputMethodToggle = ({
  fileInputType,
  setFileInputType,
}: InputMethodToggleProps) => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setFileInputType("record")}
        style={
          fileInputType === "record" ? styles.itemRecordActive : styles.item
        }
      >
        <Text
          style={fileInputType === "record" ? styles.textActive : styles.text}
        >
          Record
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setFileInputType("upload")}
        style={
          fileInputType === "upload" ? styles.itemUploadActive : styles.item
        }
      >
        <Text
          style={fileInputType === "upload" ? styles.textActive : styles.text}
        >
          Upload
        </Text>
      </Pressable>
    </View>
  );
};

export default InputMethodToggle;
