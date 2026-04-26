import PropTypes from "prop-types";
import { TextInput, View, Pressable, Text, ActivityIndicator } from "react-native";
import { Send } from "lucide-react-native";
import { styles } from "./ChatInput.styles";

const ChatInput = ({ value, onChangeText, onSend, loading }) => {
  const canSend = value.trim().length > 0 && !loading;

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Pergunte algo..."
          placeholderTextColor="#B0A090"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={canSend ? onSend : undefined}
          returnKeyType="send"
          blurOnSubmit={false}
          multiline={false}
          editable={!loading}
          autoComplete="off"
          autoCorrect={false}
          spellCheck={false}
        />
        <Pressable
          onPress={canSend ? onSend : undefined}
          style={[styles.sendBtn, !canSend && styles.sendBtnDisabled]}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#30344F" />
          ) : (
            <Send size={16} color="#30344F" />
          )}
        </Pressable>
      </View>
      <Text style={styles.disclaimer}>
        Respostas baseadas em dados reais do sistema
      </Text>
    </View>
  );
};

ChatInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ChatInput.defaultProps = {
  loading: false,
};

export default ChatInput;
