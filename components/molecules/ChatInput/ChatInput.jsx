import PropTypes from "prop-types";
import { TextInput, View, Pressable, Text, ActivityIndicator } from "react-native";
import { Send, Mic, Trash2, Play, Pause, Square } from "lucide-react-native";
import { styles, voiceColors } from "./ChatInput.styles";

const WAVEFORM_HEIGHTS = [6, 12, 8, 16, 10, 14, 7, 18, 9, 13, 11, 15, 8, 12, 6];

const Waveform = ({ activeIndex = -1 }) => (
  <View style={styles.waveformRow}>
    {WAVEFORM_HEIGHTS.map((height, index) => (
      <View
        key={`bar-${index}`}
        style={[
          styles.waveformBar,
          {
            height,
            backgroundColor:
              activeIndex >= index
                ? voiceColors.waveformActive
                : voiceColors.waveformIdle,
          },
        ]}
      />
    ))}
  </View>
);

Waveform.propTypes = {
  activeIndex: PropTypes.number,
};

Waveform.defaultProps = {
  activeIndex: -1,
};

const RecordingBar = ({
  recordingMs,
  isPaused,
  canPause,
  onDiscard,
  onTogglePause,
  onFinish,
  formatDuration,
}) => (
  <View style={styles.voiceBar}>
    <Pressable
      onPress={onDiscard}
      style={styles.iconBtn}
      accessibilityLabel="Descartar gravacao"
    >
      <Trash2 size={18} color="#C45C4A" />
    </Pressable>

    {canPause ? (
      <Pressable
        onPress={onTogglePause}
        style={styles.iconBtn}
        accessibilityLabel={isPaused ? "Retomar gravacao" : "Pausar gravacao"}
      >
        {isPaused ? (
          <Play size={18} color="#30344F" />
        ) : (
          <Pause size={18} color="#30344F" />
        )}
      </Pressable>
    ) : null}

    <View style={styles.recordingCenter}>
      <View
        style={[
          styles.recordingDot,
          isPaused && styles.recordingDotPaused,
        ]}
      />
      <Text style={styles.durationText}>{formatDuration(recordingMs)}</Text>
      <Waveform activeIndex={isPaused ? -1 : WAVEFORM_HEIGHTS.length - 1} />
    </View>

    <Pressable
      onPress={onFinish}
      style={styles.finishBtn}
      accessibilityLabel="Finalizar gravacao"
    >
      <Square size={14} color="#FFEEE7" fill="#FFEEE7" />
    </Pressable>
  </View>
);

RecordingBar.propTypes = {
  recordingMs: PropTypes.number.isRequired,
  isPaused: PropTypes.bool,
  canPause: PropTypes.bool,
  onDiscard: PropTypes.func.isRequired,
  onTogglePause: PropTypes.func,
  onFinish: PropTypes.func.isRequired,
  formatDuration: PropTypes.func.isRequired,
};

RecordingBar.defaultProps = {
  isPaused: false,
  canPause: false,
  onTogglePause: undefined,
};

const PreviewBar = ({
  durationMs,
  playbackMs,
  isPlaying,
  loading,
  onDiscard,
  onTogglePlayback,
  onSend,
  formatDuration,
}) => {
  const progress =
    durationMs > 0 ? Math.min(1, playbackMs / durationMs) : 0;
  const activeBars = Math.round(progress * WAVEFORM_HEIGHTS.length);

  return (
    <View style={styles.voiceBar}>
      <Pressable
        onPress={onDiscard}
        style={styles.iconBtn}
        accessibilityLabel="Excluir audio"
      >
        <Trash2 size={18} color="#30344F" />
      </Pressable>

      <Pressable
        onPress={onTogglePlayback}
        style={styles.iconBtn}
        accessibilityLabel={isPlaying ? "Pausar audio" : "Ouvir audio"}
      >
        {isPlaying ? (
          <Pause size={18} color="#30344F" />
        ) : (
          <Play size={18} color="#30344F" />
        )}
      </Pressable>

      <View style={styles.recordingCenter}>
        <Waveform activeIndex={activeBars - 1} />
        <Text style={styles.durationText}>
          {formatDuration(isPlaying ? playbackMs : durationMs)}
        </Text>
      </View>

      <Pressable
        onPress={loading ? undefined : onSend}
        style={[styles.sendVoiceBtn, loading && styles.sendBtnDisabled]}
        accessibilityLabel="Enviar audio"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFEEE7" />
        ) : (
          <Send size={18} color="#FFEEE7" />
        )}
      </Pressable>
    </View>
  );
};

PreviewBar.propTypes = {
  durationMs: PropTypes.number.isRequired,
  playbackMs: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool,
  loading: PropTypes.bool,
  onDiscard: PropTypes.func.isRequired,
  onTogglePlayback: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  formatDuration: PropTypes.func.isRequired,
};

PreviewBar.defaultProps = {
  isPlaying: false,
  loading: false,
};

const ChatInput = ({
  value,
  onChangeText,
  onSend,
  loading,
  voiceMode,
  recordingMs,
  isRecordingPaused,
  canPauseRecording,
  previewDurationMs,
  playbackMs,
  isPlayingPreview,
  formatDuration,
  onStartRecording,
  onToggleRecordingPause,
  onFinishRecording,
  onDiscardVoice,
  onTogglePlayback,
  onSendVoice,
}) => {
  const isVoiceActive = voiceMode === "recording" || voiceMode === "preview";
  const canSend = value.trim().length > 0 && !loading && !isVoiceActive;
  const canRecord = !loading && voiceMode === "idle";

  return (
    <View>
      <View style={styles.container}>
        {voiceMode === "recording" ? (
          <RecordingBar
            recordingMs={recordingMs}
            isPaused={isRecordingPaused}
            canPause={canPauseRecording}
            onDiscard={onDiscardVoice}
            onTogglePause={onToggleRecordingPause}
            onFinish={onFinishRecording}
            formatDuration={formatDuration}
          />
        ) : null}

        {voiceMode === "preview" ? (
          <PreviewBar
            durationMs={previewDurationMs}
            playbackMs={playbackMs}
            isPlaying={isPlayingPreview}
            loading={loading}
            onDiscard={onDiscardVoice}
            onTogglePlayback={onTogglePlayback}
            onSend={onSendVoice}
            formatDuration={formatDuration}
          />
        ) : null}

        {voiceMode === "idle" ? (
          <>
            <Pressable
              onPress={canRecord ? onStartRecording : undefined}
              style={[styles.micBtn, !canRecord && styles.sendBtnDisabled]}
              accessibilityLabel="Gravar audio"
            >
              <Mic size={16} color={voiceColors.gold} />
            </Pressable>
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
          </>
        ) : null}
      </View>
      <Text style={styles.disclaimer}>
        {voiceMode === "recording"
          ? "Pause, finalize ou descarte a gravacao"
          : voiceMode === "preview"
            ? "Ouça, exclua ou envie o audio"
            : "Respostas baseadas em dados reais do sistema"}
      </Text>
    </View>
  );
};

ChatInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  voiceMode: PropTypes.oneOf(["idle", "recording", "preview"]),
  recordingMs: PropTypes.number,
  isRecordingPaused: PropTypes.bool,
  canPauseRecording: PropTypes.bool,
  previewDurationMs: PropTypes.number,
  playbackMs: PropTypes.number,
  isPlayingPreview: PropTypes.bool,
  formatDuration: PropTypes.func,
  onStartRecording: PropTypes.func,
  onToggleRecordingPause: PropTypes.func,
  onFinishRecording: PropTypes.func,
  onDiscardVoice: PropTypes.func,
  onTogglePlayback: PropTypes.func,
  onSendVoice: PropTypes.func,
};

ChatInput.defaultProps = {
  loading: false,
  voiceMode: "idle",
  recordingMs: 0,
  isRecordingPaused: false,
  canPauseRecording: false,
  previewDurationMs: 0,
  playbackMs: 0,
  isPlayingPreview: false,
  formatDuration: (ms) => `${Math.floor(ms / 1000)}s`,
  onStartRecording: undefined,
  onToggleRecordingPause: undefined,
  onFinishRecording: undefined,
  onDiscardVoice: undefined,
  onTogglePlayback: undefined,
  onSendVoice: undefined,
};

export default ChatInput;
