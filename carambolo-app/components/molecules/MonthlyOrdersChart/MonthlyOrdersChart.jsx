import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import styles from './MonthlyOrdersChart.styles';

const MonthlyOrdersChart = () => {
  const data = [
    { 
      value: 45,
      label: 'Jan', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },
    { 
      value: 36, 
      label: 'Fev', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },
    { 
      value: 48, 
      label: 'Mar', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },
    { 
      value: 42, 
      label: 'Abr', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Mai', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },
    { 
      value: 44, 
      label: 'Jun', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },{ 
      value: 58, 
      label: 'Jul', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },
    { 
      value: 22, 
      label: 'Ago', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },{ 
      value: 45, 
      label: 'Set', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },
    { 
      value: 52, 
      label: 'Out', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },{ 
      value: 50, 
      label: 'Nov', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Dez', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text>Cacau Expresso</Text>
      ),
    },
  ];

  return (
    <View>
      <BarChart
        data={data}
        horizontal={true}
        barWidth={20}
        barBorderTopRightRadius={100}
        barBorderTopLeftRadius={100}
        spacing={10}
        xAxisType="numeric"
        rulesColor={""}
        width={300}
        height={380}
        topLabelContainerStyle={styles.topLabelContainerStyle}
        backgroundColor={"#FFE7DD"}
        maxValue={90}
      />
    </View>
  );
};

export default MonthlyOrdersChart;
