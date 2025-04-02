import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import axios from "axios";
import { API_URL } from "@/configs";

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

const fileRecordStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 48,
    gap: 32,
    marginTop: 32,
  },
  heading: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    textTransform: "capitalize",
    color: colors.green,
    width: "100%",
    textAlign: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: colors.green,
    borderRadius: 9999,
    backgroundColor: colors.white,
  },
  icon: {
    width: 100,
    height: 100,
  },
});

const fileUploadStyles = StyleSheet.create({
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
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [uploadedFile, setUploadedFile] = useState<boolean>(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const handleUploadedFile = () => {
    if (uploadedFile) return;
    setUploadedFile(true);
  };

  const deleteUploadedFile = () => setUploadedFile(false);

  async function startRecording() {
    try {
      if (permissionResponse?.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: ".mp3",
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
      });
      setRecording(recording);
    } catch (err) {
      console.log("Recording failed:", err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = recording.getURI();

      if (uri) {
        const formData = new FormData();
        const fileName = uri.split("/").pop() || "audio.m4a";
        const file = {
          uri: uri,
          name: fileName,
          type: "audio/x-m4a",
        };

        formData.append("audio", file as any);
        console.log("Attempting to send file:", fileName);
        console.log("File URI:", uri);

        const response = await axios.post(`${API_URL}/getReciter`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        });

        console.log("Server response:", JSON.stringify(response.data, null, 2));
      }
    } catch (err: any) {
      console.log("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
    }
    setRecording(null);
  }

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
      {fileInputType === "record" && (
        <View style={fileRecordStyles.container}>
          <Pressable
            onPress={recording ? stopRecording : startRecording}
            style={fileRecordStyles.button}
          >
            <Image
              source={recording ? icons.stop : icons.play}
              tintColor={colors.green}
              style={fileRecordStyles.icon}
            />
          </Pressable>
          {!recording && (
            <Text style={fileRecordStyles.heading}>
              Press to start recording
            </Text>
          )}
        </View>
      )}
      {fileInputType === "upload" && (
        <Pressable
          onPress={handleUploadedFile}
          style={fileUploadStyles.container}
        >
          {!uploadedFile && (
            <>
              <Text style={fileUploadStyles.heading}>Choose a file</Text>
              <Image
                source={icons.upload}
                tintColor={colors.green}
                style={fileUploadStyles.icon}
              />
              <Text style={fileUploadStyles.text}>
                PNG, SVG, PDF, GIF or JPG (max of 25mb)
              </Text>
            </>
          )}
          {uploadedFile && (
            <>
              <Image
                source={icons.uploaded}
                tintColor={colors.green}
                style={fileUploadStyles.icon}
              />
              <View style={fileUploadStyles.inner}>
                <Text style={fileUploadStyles.fileText}>Sudais.mp3</Text>
                <Pressable onPress={deleteUploadedFile}>
                  <Image
                    source={icons.delete}
                    tintColor={colors.red}
                    style={fileUploadStyles.deleteIcon}
                  />
                </Pressable>
              </View>
            </>
          )}
          <View style={fileUploadStyles.buttonContainer}>
            <Pressable style={fileUploadStyles.button}>
              <Text style={fileUploadStyles.buttonText}>Upload</Text>
            </Pressable>
          </View>
        </Pressable>
      )}
    </View>
  );
}
