import PropTypes from "prop-types";
import { useState } from "react";
import { Text, View, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import InsightCard from "../../molecules/InsightCard/InsightCard";
import { styles } from "./InsightsPanel.styles";

const InsightsPanel = ({ insights, isLoading, isError, onRetry, onExpand }) => {
  const [dismissed, setDismissed] = useState([]);
  const [collapsed, setCollapsed] = useState(true);

  const hasInsights = (insights || []).length > 0;

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (!next && !hasInsights && !isLoading && onExpand) {
      onExpand();
    }
  };

  const handleDismiss = (index) => {
    setDismissed((prev) => [...prev, index]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Insights do dia</Text>
        <Pressable onPress={handleToggle} style={styles.toggleBtn}>
          {collapsed ? (
            <ChevronDown size={20} color="#A47032" />
          ) : (
            <ChevronUp size={20} color="#A47032" />
          )}
        </Pressable>
      </View>
      {!collapsed && isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator size="small" color="#A47032" />
          <Text style={styles.loadingText}>Carregando insights...</Text>
        </View>
      )}
      {!collapsed && isError && !isLoading && (
        <View style={styles.loading}>
          <Text style={styles.errorText}>Não foi possível carregar os insights.</Text>
          {onRetry && (
            <Pressable onPress={onRetry} style={styles.retryBtn}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          )}
        </View>
      )}
      {!collapsed && hasInsights && !isLoading && (
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={styles.scrollContent}
          nestedScrollEnabled
        >
          {(insights || []).map((insight, index) => {
            if (dismissed.includes(index)) return null;
            return (
              <InsightCard
                key={index}
                type={insight.type}
                title={insight.title}
                message={insight.message}
                onDismiss={() => handleDismiss(index)}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

InsightsPanel.propTypes = {
  insights: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string,
      message: PropTypes.string.isRequired,
    })
  ),
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  onRetry: PropTypes.func,
  onExpand: PropTypes.func,
};

InsightsPanel.defaultProps = {
  insights: [],
  isLoading: false,
  isError: false,
  onRetry: null,
  onExpand: null,
};

export default InsightsPanel;
