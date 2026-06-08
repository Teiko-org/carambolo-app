import PropTypes from "prop-types";
import { Modal, Pressable, Text, View } from "react-native";
import Button from "../../atoms/Button/Button";
import styles from "./GestureCameraPermissionModal.styles";

const GestureCameraPermissionModal = ({
  visible,
  onAllow,
  onDeny,
  loading = false,
}) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onDeny}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Câmera para gestos</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.lead}>
            O modo Gestos usa a câmera frontal para reconhecer sua mão e mover os cards no Kanban.
          </Text>
          <Text style={styles.detail}>
            A imagem é processada no aparelho. Nada é gravado nem enviado para servidores.
          </Text>
          <Text style={styles.hint}>
            Na próxima etapa, o sistema pode pedir confirmação da permissão de câmera.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={onDeny}
            disabled={loading}
            style={styles.secondaryAction}
            accessibilityRole="button"
            accessibilityLabel="Usar modo toque"
          >
            <Text style={styles.secondaryActionText}>Usar toque</Text>
          </Pressable>
          <View style={styles.primaryAction}>
            <Button
              title={loading ? "Aguarde…" : "Permitir câmera"}
              variant="primary"
              onPress={onAllow}
            />
          </View>
        </View>
      </View>
    </View>
  </Modal>
);

GestureCameraPermissionModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onAllow: PropTypes.func.isRequired,
  onDeny: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

GestureCameraPermissionModal.defaultProps = {
  loading: false,
};

export default GestureCameraPermissionModal;
