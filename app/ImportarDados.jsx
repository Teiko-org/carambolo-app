// app/ImportarDados.jsx
import { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts, Montserrat_600SemiBold } from "@expo-google-fonts/montserrat";
import caramboloImage from "../assets/carambolo.png";
import uploadIcon from "../assets/uploadIcon.png";
import * as DocumentPicker from "expo-document-picker";

export default function ImportarDados() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
  });

  const onPressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();

  const onPressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

    const pickFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "text/csv",
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return;
    }

    const file = result.assets[0];

    console.log("Arquivo selecionado:", file);

    // aqui você pode:
    // - ler o arquivo
    // - enviar pra API
    // - processar CSV
  } catch (error) {
    console.log("Erro ao selecionar arquivo:", error);
  }
};

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={["#103464", "#30344F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.brandImageWrap}
        >
          <Image
            source={caramboloImage}
            style={styles.brandImage}
            resizeMode="cover"
          />
        </LinearGradient>

        {/* Nav */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.push("/")}
            activeOpacity={0.8}
          >
            <Text style={styles.backBtnArrow}>‹</Text>
            <Text style={styles.backBtnText}>
              Visualizar pedidos importados
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.pageTitleRow}>
          <Text
            style={[
              styles.pageTitle,
              fontsLoaded && { fontFamily: "Montserrat_600SemiBold" },
            ]}
          >
            Importar histórico de pedidos
          </Text>
        </View>

        {/* Upload */}
        <View style={styles.uploadArea}>
          <Image
            source={uploadIcon}
            style={styles.uploadIconImage}
            resizeMode="contain"
          />

          <Text style={styles.uploadText}>
            Arraste ou faça upload de um arquivo{"\n"}
            csv para extrair o histórico de pedidos
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          activeOpacity={1}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={pickFile}
          style={styles.ctaWrap}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <LinearGradient
              colors={["#A47032", "#D4B076"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>Importar csv</Text>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const CREAM = "#FFEEE7";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREAM },
  scroll: { flex: 1, backgroundColor: CREAM },
  scrollContent: { paddingBottom: 40 },

  // Header
  brandImageWrap: {
    alignItems: "center",
    justifyContent: "center",
    height: 76,
    overflow: "hidden",
    paddingHorizontal: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: "#A47032",
  },
  brandImage: {
    width: "130%",
    height: "100%",
  },

  // Nav
  navBar: {
    backgroundColor: "#30344F",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#A47032",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 4,
  },
  backBtnArrow: {
    color: GOLD_LIGHT,
    fontSize: 18,
  },
  backBtnText: {
    color: GOLD_LIGHT,
    fontSize: 12,
    fontWeight: "500",
  },

  // Title
  pageTitleRow: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 26,
    color: "#A47032", // cor principal do gradiente (fallback)
  },

  // Upload
  uploadArea: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  uploadIconImage: {
    width: 180, // 🔥 aumentado
    height: 180,
    marginBottom: 28,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3a3a3a",
    textAlign: "center",
    lineHeight: 21,
  },

  // CTA
  ctaWrap: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 24,
    overflow: "hidden",
  },
  ctaGradient: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 24,
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});