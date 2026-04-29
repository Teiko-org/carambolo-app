// app/ImportarDados.jsx
import { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Montserrat_600SemiBold,
} from "@expo-google-fonts/montserrat";
import caramboloImage from "../assets/carambolo.png";
import uploadIcon from "../assets/uploadIcon.png";
import * as DocumentPicker from "expo-document-picker";
import { useETL } from "../hooks/useETL";

export default function ImportarDados() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const {
    executarETL,
    limparResultado,
    resultado,
    isLoading,
    isSuccess,
    isError,
  } = useETL();
  const [selectedFiles, setSelectedFiles] = useState([]);

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
        type: [
          "text/csv",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled) {
        return;
      }

      const files = result.assets;
      setSelectedFiles(files);
      limparResultado();

      console.log(
        "Arquivos selecionados:",
        files.map((f) => f.name),
      );
    } catch (error) {
      console.log("Erro ao selecionar arquivo:", error);
    }
  };

  const handleImportar = () => {
    if (selectedFiles.length === 0) return;
    executarETL(selectedFiles);
  };

  const handleNovaImportacao = () => {
    setSelectedFiles([]);
    limparResultado();
  };

  // Formata bytes para exibição legível
  const formatBytes = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
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

        {/* Upload Area */}
        {!isLoading && !isSuccess && !isError && (
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={pickFile}
            activeOpacity={0.7}
          >
            <Image
              source={uploadIcon}
              style={styles.uploadIconImage}
              resizeMode="contain"
            />
            <Text style={styles.uploadText}>
              Toque para selecionar arquivos{"\n"}
              csv ou xlsx para extrair o histórico
            </Text>
          </TouchableOpacity>
        )}

        {/* Loading State */}
        {isLoading && (
          <View style={styles.statusArea}>
            <ActivityIndicator size="large" color={GOLD} />
            <Text style={styles.statusTitle}>Processando ETL...</Text>
            <Text style={styles.statusSubtext}>
              Extraindo, transformando e carregando dados.{"\n"}
              Isso pode levar alguns segundos.
            </Text>
          </View>
        )}

        {/* Success State */}
        {isSuccess && resultado?.status === "success" && (
          <View style={styles.statusArea}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.statusTitle}>Importação concluída!</Text>
            <Text style={styles.statusSubtext}>
              {resultado.etl_resultado?.mensagem ||
                "ETL executado com sucesso."}
            </Text>

            {/* Detalhes do resultado */}
            {resultado.etl_resultado?.total_registros > 0 && (
              <View style={styles.resultCard}>
                <Text style={styles.resultCardTitle}>Resumo da importação</Text>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Total de registros:</Text>
                  <Text style={styles.resultValue}>
                    {resultado.etl_resultado.total_registros}
                  </Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Duração:</Text>
                  <Text style={styles.resultValue}>
                    {resultado.etl_resultado.duracao_segundos}s
                  </Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Arquivos processados:</Text>
                  <Text style={styles.resultValue}>
                    {resultado.arquivos_salvos?.length || 0}
                  </Text>
                </View>

                {/* Tabelas inseridas */}
                {resultado.etl_resultado?.tabelas && (
                  <View style={styles.tableSection}>
                    <Text style={styles.tableSectionTitle}>
                      Registros por tabela:
                    </Text>
                    {Object.entries(resultado.etl_resultado.tabelas).map(
                      ([tabela, count]) => (
                        <View key={tabela} style={styles.tableRow}>
                          <Text style={styles.tableName}>{tabela}</Text>
                          <Text style={styles.tableCount}>{count}</Text>
                        </View>
                      ),
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Avisos */}
            {resultado.avisos?.length > 0 && (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>⚠️ Avisos</Text>
                {resultado.avisos.map((aviso, idx) => (
                  <Text key={idx} style={styles.warningText}>
                    • {aviso}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Error State */}
        {isError && (
          <View style={styles.statusArea}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.statusTitle}>Erro na importação</Text>
            <Text style={styles.statusSubtext}>
              {resultado?.message ||
                "Ocorreu um erro ao executar o ETL. Verifique os logs do servidor."}
            </Text>
          </View>
        )}

        {/* Selected Files List */}
        {selectedFiles.length > 0 && !isLoading && !isSuccess && (
          <View style={styles.fileListContainer}>
            <Text style={styles.fileListTitle}>
              {selectedFiles.length} arquivo(s) selecionado(s):
            </Text>
            {selectedFiles.map((file, index) => (
              <View key={index} style={styles.fileItem}>
                <Text style={styles.fileIcon}>
                  {file.name.endsWith(".csv") ? "📄" : "📊"}
                </Text>
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={styles.fileSize}>{formatBytes(file.size)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* CTA Buttons */}
        {!isLoading && (
          <>
            {/* Importar — só mostra se tem arquivos selecionados e não processou ainda */}
            {selectedFiles.length > 0 && !isSuccess && !isError && (
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={handleImportar}
                style={styles.ctaWrap}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <LinearGradient
                    colors={["#A47032", "#D4B076"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.ctaGradient}
                  >
                    <Text style={styles.ctaText}>
                      Importar {selectedFiles.length} arquivo(s)
                    </Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            )}

            {/* Selecionar arquivos — quando nenhum arquivo foi selecionado */}
            {selectedFiles.length === 0 && !isSuccess && !isError && (
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
                    <Text style={styles.ctaText}>Selecionar arquivos</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            )}

            {/* Nova importação — após sucesso ou erro */}
            {(isSuccess || isError) && (
              <TouchableOpacity
                activeOpacity={1}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={handleNovaImportacao}
                style={styles.ctaWrap}
              >
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <LinearGradient
                    colors={["#103464", "#30344F"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.ctaGradient}
                  >
                    <Text style={styles.ctaText}>Nova importação</Text>
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            )}
          </>
        )}
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
    width: 180,
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

  // Status (loading/success/error)
  statusArea: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#30344F",
    marginTop: 16,
    textAlign: "center",
  },
  statusSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  successIcon: {
    fontSize: 48,
  },
  errorIcon: {
    fontSize: 48,
  },

  // Result Card
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e8ddd4",
  },
  resultCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#A47032",
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f0ebe6",
  },
  resultLabel: {
    fontSize: 13,
    color: "#666",
  },
  resultValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#30344F",
  },

  // Table Section
  tableSection: {
    marginTop: 16,
  },
  tableSectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#A47032",
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  tableName: {
    fontSize: 12,
    color: "#555",
  },
  tableCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#30344F",
  },

  // Warning Card
  warningCard: {
    backgroundColor: "#FFF8E1",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FFD54F",
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F57F17",
    marginBottom: 8,
  },
  warningText: {
    fontSize: 12,
    color: "#795548",
    marginBottom: 4,
  },

  // File List
  fileListContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e8ddd4",
  },
  fileListTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#30344F",
    marginBottom: 12,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0ebe6",
    gap: 10,
  },
  fileIcon: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  fileSize: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
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
