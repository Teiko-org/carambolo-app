import PropTypes from "prop-types";
import { Text, View } from "react-native";
import { BarChart } from 'react-native-gifted-charts';
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
  const normalizedData = data.map((item) => ({ ...item }));

  return (
    <View style={styles.chartWrapper}>
      <View style={styles.chartRow}>
        <View style={styles.chartArea}>
          <BarChart
            data={normalizedData}
            horizontal={true}
            barWidth={20}
            barBorderTopRightRadius={100}
            barBorderTopLeftRadius={100}
            spacing={14}
            initialSpacing={0}
            endSpacing={0}
            xAxisType="numeric"
            rulesColor="transparent"
            width={190}
            height={360}
            backgroundColor={"#FFE7DD"}
            maxValue={Math.ceil(maxValue * 1.2)}
            xAxisColor="#8A8A8A"
            yAxisColor="transparent"
          />
        </View>
        <View style={styles.labelsColumn}>
          {normalizedData.map((item, index) => (
            <View key={`${item.label}-${index}`} style={styles.itemLabelRow}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemLabelText}>
                {item.nomeItem || ""}
              </Text>
            </View>
          ))}
        </View>
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
