import { useState, useRef, useCallback, useEffect } from "react";
import { Audio } from "expo-av";
import { Platform } from "react-native";

const WEB_RECORDING_OPTIONS = {
  ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
  web: {
    mimeType: "audio/webm",
    bitsPerSecond: 128000,
  },
};

const formatDuration = (ms) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export { formatDuration };

export function useVoiceRecording() {
  const [mode, setMode] = useState("idle");
  const [recordingMs, setRecordingMs] = useState(0);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMs, setPlaybackMs] = useState(0);

  const recordingRef = useRef(null);
  const soundRef = useRef(null);
  const recordingStartedAtRef = useRef(0);
  const pausedAccumRef = useRef(0);
  const pauseStartedAtRef = useRef(0);

  const stopPlayback = useCallback(async () => {
    const sound = soundRef.current;
    soundRef.current = null;
    setIsPlaying(false);
    setPlaybackMs(0);
    if (!sound) return;
    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } catch {
      return;
    }
  }, []);

  const discard = useCallback(async () => {
    await stopPlayback();

    const recording = recordingRef.current;
    recordingRef.current = null;
    setIsRecordingPaused(false);
    setRecordingMs(0);
    recordingStartedAtRef.current = 0;
    pausedAccumRef.current = 0;
    pauseStartedAtRef.current = 0;

    if (recording) {
      try {
        await recording.stopAndUnloadAsync();
      } catch {
        return;
      }
    }

    setPreview(null);
    setMode("idle");
  }, [stopPlayback]);

  const startRecording = useCallback(async () => {
    await discard();

    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) {
      throw new Error("Permissao de microfone negada.");
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Platform.OS === "web"
        ? WEB_RECORDING_OPTIONS
        : Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    await recording.startAsync();

    recordingRef.current = recording;
    recordingStartedAtRef.current = Date.now();
    pausedAccumRef.current = 0;
    pauseStartedAtRef.current = 0;
    setRecordingMs(0);
    setIsRecordingPaused(false);
    setMode("recording");
  }, [discard]);

  const toggleRecordingPause = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording || mode !== "recording") return;

    if (Platform.OS === "web") {
      return;
    }

    if (isRecordingPaused) {
      pausedAccumRef.current += Date.now() - pauseStartedAtRef.current;
      await recording.startAsync();
      setIsRecordingPaused(false);
      return;
    }

    pauseStartedAtRef.current = Date.now();
    await recording.pauseAsync();
    setIsRecordingPaused(true);
  }, [isRecordingPaused, mode]);

  const finishRecording = useCallback(async () => {
    const recording = recordingRef.current;
    if (!recording || mode !== "recording") {
      return null;
    }

    const durationMs = recordingMs;
    recordingRef.current = null;
    setIsRecordingPaused(false);

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const mimeType = Platform.OS === "web" ? "audio/webm" : "audio/mp4";

    if (!uri) {
      setRecordingMs(0);
      return null;
    }

    const clip = {
      uri,
      mimeType,
      durationMs: durationMs || 0,
    };
    setPreview(clip);
    setRecordingMs(0);
    setMode("preview");
    return clip;
  }, [mode, recordingMs]);

  const togglePlayback = useCallback(async () => {
    if (!preview?.uri || mode !== "preview") return;

    if (isPlaying && soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
    });

    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
      return;
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: preview.uri },
      { shouldPlay: true },
      (status) => {
        if (!status.isLoaded) return;
        setPlaybackMs(status.positionMillis || 0);
        if (status.didJustFinish) {
          setIsPlaying(false);
          setPlaybackMs(0);
          soundRef.current = null;
          sound.unloadAsync().catch(() => {});
        }
      }
    );
    soundRef.current = sound;
    setIsPlaying(true);
  }, [isPlaying, mode, preview]);

  useEffect(() => {
    if (mode !== "recording" || isRecordingPaused) {
      return undefined;
    }

    const tick = () => {
      setRecordingMs(
        Date.now() - recordingStartedAtRef.current - pausedAccumRef.current
      );
    };

    tick();
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
  }, [mode, isRecordingPaused]);

  useEffect(() => {
    return () => {
      discard();
    };
  }, [discard]);

  return {
    mode,
    recordingMs,
    isRecordingPaused,
    preview,
    isPlaying,
    playbackMs,
    formatDuration,
    startRecording,
    toggleRecordingPause,
    finishRecording,
    discard,
    togglePlayback,
    canPauseRecording: Platform.OS !== "web",
  };
}
