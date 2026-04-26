// app/index.jsx
import { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import PropTypes from "prop-types";
import caramboloImage from "../assets/carambolo.png";
import bannerCarambolo from "../assets/bannerCarambolo.png";
import bannerFornada from "../assets/bannerFornada.png";
import dashboardImage from "../assets/dashboard.jpg";
import fornadasImage from "../assets/fornadas.jpg";
import fundoBolos from "../assets/fundoBolos.png";
import historicoImage from "../assets/historico.jpg";
import pedidosImage from "../assets/pedidos.jpg";
import producaoImage from "../assets/producao.jpg";
import produtosImage from "../assets/produtos.jpg";
import { LinearGradient } from "expo-linear-gradient";
import lupaImage from "../assets/lupa.png";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_SIZE = (width - 48) / 3;

// ─── Dados dos cards de navegação ────────────────────────────
const NAV_ITEMS = [
  {
    label: "PRODUTOS",
    route: "/produtos",
    image: produtosImage,
  },
  {
    label: "PEDIDOS",
    route: "/pedidos",
    image: pedidosImage,
  },
  {
    label: "PRODUÇÃO",
    route: "/producao",
    image: producaoImage,
  },
  {
    label: "FORNADAS",
    route: "/fornadas",
    image: fornadasImage,
  },
  {
    label: "DASHBOARD",
    route: "/dashboard",
    image: dashboardImage,
  },
  {
    label: "HISTÓRICO",
    route: "/historico",
    image: historicoImage,
  },
];

// ─── Card de navegação ────────────────────────────────────────
function NavCard({ label, image, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 20,
    }).start();

  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.navCard, { transform: [{ scale }] }]}>
        {/* ── Área da imagem ──
            Quando tiver as fotos reais, remova o placeholder abaixo
            e descomente o <Image /> */}
        <View style={styles.navCardImagePlaceholder}>
          {image ? (
            <Image source={image} style={styles.navCardImage} resizeMode="cover" />
          ) : (
            <Text style={styles.navCardPlaceholderText}>🎂</Text>
          )}
        </View>

        {/* ── Label ── */}
        <View style={styles.navCardLabelWrap}>
          <Text style={styles.navCardLabel}>{label}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

NavCard.propTypes = {
  label: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  onPress: PropTypes.func.isRequired,
};

// ─── HomeScreen ───────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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

      {/* ── Barra de busca ── */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="O que está procurando?"
              placeholderTextColor="#999"
            />
            <Image source={lupaImage} style={styles.searchIconImage} resizeMode="contain" />
          </View>
        </View>

      {/* ── Banner Carambolo ── */}
        <View style={styles.kurokoBannerContainer}>
          <Image
            source={fundoBolos}
            style={styles.fundoBolosImage}
            resizeMode="cover"
          />
          <Image
            source={bannerCarambolo}
            style={styles.kurokoBannerImage}
            resizeMode="contain"
          />
          
          <View style={styles.kurokoTitleRow}>
            <Text style={styles.kurokoTitle}>Kuroko Assistant</Text>
          </View>
          <Text style={styles.kurokoSubtitle}>
            Fale para analisar os dados do{"\n"}seu negócio
          </Text>
          <TouchableOpacity style={styles.kurokoCtaWrap} activeOpacity={0.85}>
            <LinearGradient
              colors={["#A47032", "#D4B076"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.kurokoCtaGradient}
            >
              <Text style={styles.kurokoCtaText}>Conversar com Assistant</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      {/* ── Banner Fornadas ── */}
        <View style={styles.countdownBannerWrap}>
          <Image
            source={bannerFornada}
            style={styles.countdownBannerImage}
            resizeMode="contain"
          />
        </View>

      {/* ── Título da seção ── */}
        <View style={styles.sectionTitleWrap}>
          <Text style={styles.sectionTitle}>O que deseja visualizar?</Text>
        </View>

      {/* ── Grid de navegação ── */}
        <View style={styles.navGrid}>
          {NAV_ITEMS.map((item) => (
            <NavCard
              key={item.route}
              label={item.label}
              image={item.image}
              onPress={() => router.push(item.route)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────
const NAVY      = "#0D1B3E";
const GOLD      = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const GOLD_DIM  = "rgba(201,168,76,0.4)";
const CREAM     = "#FFEEE7";
const CREAM_DIM = "#F5E0D0";
const WHITE     = "#FFFFFF";

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: CREAM },
  scroll: { flex: 1, backgroundColor: CREAM },
  scrollContent: { paddingBottom: 32 },

  brandImageWrap: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 0,
    paddingHorizontal: 12,
    height: 76,
    overflow: "hidden",
  },
  brandImage: {
    width: "130%",
    height: "100%",
  },

  // ── Busca ──
  searchWrap: {
    backgroundColor: "#30344F",
    paddingHorizontal: 16,
    height: 64,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#A47032",
  },
  searchBox: {
    flexDirection: "row",
    backgroundColor: WHITE,
    borderRadius: 8,
    width: "88%",
    alignSelf: "center",
    paddingHorizontal: 18,
    height: 40,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    paddingVertical: 0,
    textAlign: "center",
  },
  searchIconImage: { width: 18, height: 18 },

  // ── Kuroko Banner ──
  kurokoBanner: {
    margin: 12,
    backgroundColor: NAVY,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: GOLD,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    elevation: 5,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  kurokoSide: {
    width: 68,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(201,168,76,0.06)",
  },
  kurokoSideImage: {
    width: 68,
    height: "100%",
  },
  kurokoSideEmoji: { fontSize: 34 },
  kurokoCenter: { flex: 1, alignItems: "center", paddingVertical: 18 },
  kurokoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    marginTop: 2,
    width: "90%",
    zIndex: 2,
    justifyContent: "center",
  },
  kurokoLine: {
    flex: 1,
    height: 1,
    backgroundColor: GOLD,
    opacity: 0.5,
  },
  kurokoTitle: {
    color: GOLD_LIGHT,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  kurokoSubtitle: {
    color: "#C8D8F5",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 8,
    zIndex: 2,
  },
  kurokoCtaWrap: {
    zIndex: 2,
    borderRadius: 18,
    overflow: "hidden",
    marginTop: 0,
  },
  kurokoCtaGradient: {
    paddingHorizontal: 20,
    paddingVertical: 3,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  kurokoCtaText: {
    color: "#103464",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.4,
  },
  kurokoBtn: {
    borderWidth: 1.5,
    borderColor: GOLD,
    borderRadius: 22,
    paddingHorizontal: 26,
    paddingVertical: 7,
    backgroundColor: "rgba(201,168,76,0.12)",
  },
  kurokoBtnText: {
    color: GOLD,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 2,
  },
  kurokoBannerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginBottom: 0,
    position: "relative",
    height: 186,
  },
  fundoBolosImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  kurokoBannerImage: {
    position: "absolute",
    width: 320,
    height: 200,
    zIndex: 1,
  },

  // ── Banner Fornadas ──
  countdownBannerWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: 72,
    marginTop: 8,
    marginBottom: 4,
  },
  countdownBannerImage: {
    alignSelf: "center",
    width: "90%",
    height: 58,
  },

  // ── Título seção ──
  sectionTitleWrap: {
    marginHorizontal: 12,
    marginTop: 18,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(255,238,231,0.6)",
  },
  sectionTitle: {
    color: "#6B4C2A",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
  },

  // ── Grid ──
  navGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    paddingHorizontal: 10,
    gap: 8,
    justifyContent: "center",
  },
  navCard: {
    width: CARD_SIZE,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: GOLD_DIM,
    backgroundColor: WHITE,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navCardImagePlaceholder: {
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: CREAM_DIM,
  },
  navCardImage: {
    width: "100%",
    height: 80,
  },
  navCardPlaceholderText: { fontSize: 36 },
  navCardLabelWrap: {
    backgroundColor: NAVY,
    paddingVertical: 7,
    alignItems: "center",
  },
  navCardLabel: {
    color: GOLD_LIGHT,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});