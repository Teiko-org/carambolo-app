import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./ConfirmationActions.styles";

const ConfirmationActions = ({ pending, onConfirm, onCancel, disabled }) => {
  if (!pending?.confirm_token) return null;

  return (
    <View style={styles.container}>
      {pending.message ? (
        <Text style={styles.previewText}>{pending.message}</Text>
      ) : null}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.btnCancel]}
          onPress={onCancel}
          disabled={disabled}
          activeOpacity={0.85}
        >
          <Text style={styles.btnCancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnConfirm]}
          onPress={onConfirm}
          disabled={disabled}
          activeOpacity={0.85}
        >
          <Text style={styles.btnConfirmText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

ConfirmationActions.propTypes = {
  pending: PropTypes.shape({
    action: PropTypes.string,
    confirm_token: PropTypes.string,
    payload: PropTypes.object,
    message: PropTypes.string,
  }),
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

ConfirmationActions.defaultProps = {
  pending: null,
  disabled: false,
};

export default ConfirmationActions;
