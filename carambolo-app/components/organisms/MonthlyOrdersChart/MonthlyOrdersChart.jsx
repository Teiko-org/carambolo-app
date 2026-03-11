import { Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

const MonthlyOrdersChart = () => {
  const data = [
    { 
      value: 45, 
      label: 'Jan', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Fev', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Mar', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Abr', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Mai', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Jun', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },{ 
      value: 45, 
      label: 'Jul', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Ago', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },{ 
      value: 45, 
      label: 'Set', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 14}}>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Out', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },{ 
      value: 45, 
      label: 'Nov', 
      frontColor: '#103464',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },
    { 
      value: 45, 
      label: 'Dec', 
      frontColor: '#A47032',
      topLabelComponent: () => (
        <Text style={{color: '#000000', fontSize: 18, marginBottom: 6}}>Cacau Expresso</Text>
      ),
    },
  ];

  return (
    <View style={{
      flex: 1
    }}>
      <BarChart
        data={data}
        horizontal={true}
        barWidth={20}
        barBorderTopRightRadius={4}
        barBorderTopLeftRadius={4}
        initialSpacing={0}
        spacing={10}
        xAxisType="numeric"
        width={400}
        height={350}
        top
      />
    </View>
  );
};

export default MonthlyOrdersChart;
