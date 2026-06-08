import { useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import PropTypes from "prop-types";

const PRESET_OPTIONS = [
  { key: "suave", label: "Suave" },
  { key: "normal", label: "Normal" },
  { key: "rapido", label: "Rápido" },
];

function SettingRow({ label, hint, value, min, max, step, onChange, format }) {
  const display = format ? format(value) : String(value);

  const bump = (delta) => {
    const next = Math.min(max, Math.max(min, Number((value + delta).toFixed(4))));
    onChange(next);
  };

  return (
    <View style={{ marginBottom: 16, gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ color: "#4a2f14", fontWeight: "600", fontSize: 14 }}>{label}</Text>
        <Text style={{ color: "#A47032", fontWeight: "700", fontSize: 13 }}>{display}</Text>
      </View>
      {hint ? (
        <Text style={{ color: "#6b3f1a", fontSize: 11 }}>{hint}</Text>
      ) : null}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Pressable
          onPress={() => bump(-step)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#A47032",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ color: "#4a2f14", fontSize: 18, fontWeight: "700" }}>−</Text>
        </Pressable>
        <View
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: "#e8d4c4",
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: `${((value - min) / (max - min)) * 100}%`,
              height: "100%",
              backgroundColor: "#A47032",
              borderRadius: 3,
            }}
          />
        </View>
        <Pressable
          onPress={() => bump(step)}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#A47032",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ color: "#4a2f14", fontSize: 18, fontWeight: "700" }}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

SettingRow.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  format: PropTypes.func,
};

function ToggleRow({ label, hint, value, onChange }) {
  return (
    <View style={{ marginBottom: 16, gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ color: "#4a2f14", fontWeight: "600", fontSize: 14 }}>{label}</Text>
          {hint ? (
            <Text style={{ color: "#6b3f1a", fontSize: 11, marginTop: 4 }}>{hint}</Text>
          ) : null}
        </View>
        <Pressable
          onPress={() => onChange(!value)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: value ? "#A47032" : "#bbb",
            backgroundColor: value ? "#A47032" : "#fff",
            minWidth: 56,
            alignItems: "center",
          }}
          accessibilityRole="switch"
          accessibilityState={{ checked: value }}
        >
          <Text style={{ color: value ? "#fff" : "#555", fontWeight: "700", fontSize: 13 }}>
            {value ? "Sim" : "Não"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

ToggleRow.propTypes = {
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const GestureSettingsPanel = ({
  visible,
  onClose,
  settings,
  onUpdateField,
  onApplyPreset,
  onResetDefaults,
}) => {
  const isWeb = Platform.OS === "web";

  const rows = useMemo(
    () => [
      {
        key: "pinchClose",
        label: "Pinça — fechar",
        hint: "Menor = precisa apertar mais para pegar o card.",
        min: 0.04,
        max: 0.1,
        step: 0.005,
        format: (v) => v.toFixed(3),
      },
      {
        key: "pinchOpen",
        label: "Pinça — abrir",
        hint: "Maior = mais difícil soltar o card por acidente.",
        min: 0.08,
        max: 0.15,
        step: 0.005,
        format: (v) => v.toFixed(3),
      },
      {
        key: "pinchOpenFrames",
        label: "Estabilidade ao soltar",
        hint: "Frames com pinça aberta antes de largar (maior = mais seguro).",
        min: 1,
        max: 8,
        step: 1,
        format: (v) => String(Math.round(v)),
      },
      {
        key: "oneEuroIdleMinCutoff",
        label: "Cursor — agilidade",
        hint: "Maior = cursor mais rápido (sem pinça).",
        min: 0.4,
        max: 2.2,
        step: 0.1,
        format: (v) => v.toFixed(1),
      },
      {
        key: "oneEuroPinchMinCutoff",
        label: "Cursor — ao arrastar",
        hint: "Maior = card segue o dedo com menos atraso.",
        min: 0.3,
        max: 1.2,
        step: 0.05,
        format: (v) => v.toFixed(2),
      },
      {
        key: "scrollMinPx",
        label: "Scroll colunas — mínimo",
        min: 0.5,
        max: 4,
        step: 0.5,
        format: (v) => `${v.toFixed(1)} px`,
      },
      {
        key: "scrollMaxPx",
        label: "Scroll colunas — máximo",
        hint: "Velocidade na borda da tela.",
        min: 2,
        max: 12,
        step: 0.5,
        format: (v) => `${v.toFixed(1)} px`,
      },
      {
        key: "edgeThreshold",
        label: "Zona da borda",
        hint: "Largura (px) da faixa que ativa o scroll.",
        min: 60,
        max: 200,
        step: 10,
        format: (v) => `${Math.round(v)} px`,
      },
      {
        key: "edgeDelayMs",
        label: "Delay na borda",
        hint: "Tempo parado na borda antes de rolar (evita scroll acidental).",
        min: 0,
        max: 500,
        step: 20,
        format: (v) => `${Math.round(v)} ms`,
      },
      {
        key: "handStableOffFrames",
        label: "Tolerância perda de mão",
        hint: "Quanto tempo a câmera pode perder a mão sem soltar o card.",
        min: 5,
        max: 30,
        step: 1,
        format: (v) => `${Math.round(v)} fr`,
      },
    ],
    []
  );

  if (!isWeb) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          justifyContent: "center",
          padding: 20,
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            maxHeight: "88%",
            backgroundColor: "#FFEEE7",
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: "#d4b896",
          }}
          onPress={(e) => e?.stopPropagation?.()}
        >
          <Text style={{ color: "#4a2f14", fontSize: 18, fontWeight: "700", marginBottom: 4 }}>
            Configurações de gestos
          </Text>
          <Text style={{ color: "#6b3f1a", fontSize: 12, marginBottom: 16 }}>
            Ajustes salvos neste navegador. No modal: pinça e arraste para rolar
            o conteúdo. Fechar: toque ou aponte em Fechar / topo escuro.
          </Text>

          <ToggleRow
            label="Abrir detalhes por gesto"
            hint="Desligado: só arrasta cards. Ligado: aponte parado em cima do botão Detalhes."
            value={Boolean(settings.openDetailsWithGesture)}
            onChange={(v) => onUpdateField("openDetailsWithGesture", v)}
          />

          <View style={{ flexDirection: "row", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {PRESET_OPTIONS.map((p) => (
              <Pressable
                key={p.key}
                onPress={() => onApplyPreset(p.key)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: "#A47032",
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ color: "#4a2f14", fontWeight: "600", fontSize: 13 }}>{p.label}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={onResetDefaults}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: "#888",
              }}
            >
              <Text style={{ color: "#555", fontWeight: "600", fontSize: 13 }}>Padrão</Text>
            </Pressable>
          </View>

          <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator>
            {rows.map((row) => (
              <SettingRow
                key={row.key}
                label={row.label}
                hint={row.hint}
                value={settings[row.key] ?? row.min}
                min={row.min}
                max={row.max}
                step={row.step}
                format={row.format}
                onChange={(v) => onUpdateField(row.key, v)}
              />
            ))}
          </ScrollView>

          <Pressable
            onPress={onClose}
            style={{
              marginTop: 16,
              paddingVertical: 12,
              borderRadius: 10,
              backgroundColor: "#A47032",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>Fechar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

GestureSettingsPanel.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  onUpdateField: PropTypes.func.isRequired,
  onApplyPreset: PropTypes.func.isRequired,
  onResetDefaults: PropTypes.func.isRequired,
};

export default GestureSettingsPanel;
