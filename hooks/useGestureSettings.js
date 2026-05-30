import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  cloneGestureSettings,
  DEFAULT_GESTURE_SETTINGS,
  GESTURE_PRESETS,
  GESTURE_SETTINGS_STORAGE_KEY,
  mergeGestureSettings,
} from "./gesture/gestureSettings";

function parseStored(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return mergeGestureSettings(parsed);
  } catch {
    return null;
  }
}

export function useGestureSettings() {
  const [settings, setSettings] = useState(() => cloneGestureSettings());
  const [ready, setReady] = useState(false);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(GESTURE_SETTINGS_STORAGE_KEY)
      .then((raw) => {
        if (cancelled) return;
        const stored = parseStored(raw);
        if (stored) setSettings(stored);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((next) => {
    const merged = mergeGestureSettings(next);
    settingsRef.current = merged;
    setSettings(merged);
    AsyncStorage.setItem(GESTURE_SETTINGS_STORAGE_KEY, JSON.stringify(merged)).catch(() => {});
  }, []);

  const updateField = useCallback(
    (key, value) => {
      persist({ ...settingsRef.current, [key]: value });
    },
    [persist]
  );

  const applyPreset = useCallback(
    (presetKey) => {
      const preset = GESTURE_PRESETS[presetKey];
      if (preset) persist(cloneGestureSettings(preset));
    },
    [persist]
  );

  const resetDefaults = useCallback(() => {
    persist(cloneGestureSettings(DEFAULT_GESTURE_SETTINGS));
  }, [persist]);

  return {
    settings,
    settingsRef,
    ready,
    updateField,
    applyPreset,
    resetDefaults,
    persist,
  };
}
