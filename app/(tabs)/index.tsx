import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import {
  Poppins_500Medium,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingInline: 16,
    paddingTop: 48,
    marginBottom: 96,
    minHeight: "100%",
    backgroundColor: colors.crest,
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
  },
});

const toggleStyle = StyleSheet.create({
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

const inputStyles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    height: 360,
    marginTop: 32,
    padding: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.green,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  heading: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "capitalize",
    color: colors.green,
    width: "100%",
    textAlign: "center",
  },
  text: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: colors.black,
    textAlign: "center",
  },
  icon: {
    width: 100,
    height: 100,
    marginBlock: 16,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    width: "100%",
    padding: 8,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
    backgroundColor: colors.greenLight,
  },
  fileText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: colors.black,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: -24,
    insetInline: 0,
  },
  deleteIcon: {
    width: 24,
    height: 24,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 164,
    height: 48,
    borderRadius: 9999,
    backgroundColor: colors.green,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
    color: colors.white,
  },
});

export default function Index() {
  const [fileInputType, setFileInputType] = useState<"record" | "upload">(
    "record"
  );
  const [uploadedFile, setUploadedFile] = useState<boolean>(false);

  const handleUploadedFile = () => {
    if (uploadedFile) return;

    setUploadedFile(true);
  };

  const deleteUploadedFile = () => setUploadedFile(false);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload a File</Text>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <View style={toggleStyle.container}>
        <Pressable
          onPress={() => setFileInputType("record")}
          style={
            fileInputType === "record"
              ? toggleStyle.itemRecordActive
              : toggleStyle.item
          }
        >
          <Text
            style={
              fileInputType === "record"
                ? toggleStyle.textActive
                : toggleStyle.text
            }
          >
            Record
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setFileInputType("upload")}
          style={
            fileInputType === "upload"
              ? toggleStyle.itemUploadActive
              : toggleStyle.item
          }
        >
          <Text
            style={
              fileInputType === "upload"
                ? toggleStyle.textActive
                : toggleStyle.text
            }
          >
            Upload
          </Text>
        </Pressable>
      </View>
      {fileInputType === "upload" && (
        <Pressable onPress={handleUploadedFile} style={inputStyles.container}>
          {!uploadedFile && (
            <>
              <Text style={inputStyles.heading}>Choose a file</Text>
              <Image
                source={icons.upload}
                tintColor={colors.green}
                style={inputStyles.icon}
              />
              <Text style={inputStyles.text}>
                PNG, SVG, PDF, GIF or JPG (max of 25mb)
              </Text>
            </>
          )}
          {uploadedFile && (
            <>
              <Image
                source={icons.uploaded}
                tintColor={colors.green}
                style={inputStyles.icon}
              />
              <View style={inputStyles.inner}>
                <Text style={inputStyles.fileText}>Sudais.mp3</Text>
                <Pressable onPress={deleteUploadedFile}>
                  <Image
                    source={icons.delete}
                    tintColor={colors.red}
                    style={inputStyles.deleteIcon}
                  />
                </Pressable>
              </View>
            </>
          )}
          <View style={inputStyles.buttonContainer}>
            <Pressable style={inputStyles.button}>
              <Text style={inputStyles.buttonText}>Upload</Text>
            </Pressable>
          </View>
        </Pressable>
      )}
    </View>
  );
}
