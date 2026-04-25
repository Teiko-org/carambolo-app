import PropTypes from "prop-types";
import { Text, View } from "react-native";
import styles from './MonthlyOrdersChart.styles';

const MonthlyOrdersChart = ({ data = [], isLoading, isError }) => {
  if (isLoading) {
    return (
      <View>
        <Text>Carregando dados do grafico...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>Erro ao carregar dados do grafico.</Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View>
        <Text>Nenhum dado encontrado para os filtros selecionados.</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const normalizedData = data.map((item, index) => ({
    ...item,
    frontColor: item.frontColor || (index % 2 === 0 ? "#103464" : "#A47032"),
  }));
  const barMaxWidth = 190;

  return (
    <View style={styles.chartWrapper}>
      <View style={styles.chartColumn}>
        {normalizedData.map((item, index) => {
          const ratio = Math.max(item.value / maxValue, 0.18);
          const barWidth = ratio * barMaxWidth;

          return (
            <View key={`${item.label}-${index}`} style={styles.chartItem}>
              <View style={styles.labelsRow}>
                <Text style={styles.monthLabel}>{item.label}</Text>
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemLabelText}>
                  {item.nomeItem || ""}
                </Text>
              </View>

              <View style={styles.metricsRow}>
                <View style={[styles.bar, { width: barWidth, backgroundColor: item.frontColor }]} />
                <Text style={styles.ordersCount}>{item.value} Pedidos</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

MonthlyOrdersChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      nomeItem: PropTypes.string,
      frontColor: PropTypes.string,
    })
  ),
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
};

export default MonthlyOrdersChart;
