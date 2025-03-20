import { LineChart, PieChart } from 'react-native-chart-kit';
import { TouchableOpacity, Text } from 'react-native';
import susDashboardStyles from './components/styles/SustainabilityDashboard.styles';

// Dummy pie chart data
const data = [
  {
    name: 'Bus',
    emissions: 20,
    color: '#e0ac2b',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Luas',
    emissions: 34,
    color: '#e85252',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Train',
    emissions: 28,
    color: '#6689c6',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Walk',
    emissions: 45,
    color: '#9a6fb0',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Cycle',
    emissions: 75,
    color: '#a53253',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

// Dummy line chart data - year
const yearDataLineGraph = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June'],
  datasets: [
    {
      data: [455, 896, 231, 473, 147, 369],
      color: (opacity = 1) => `rgba(7, 32, 114, ${opacity})`,
      strokeWidth: 2,
    },
  ],
  legend: ['Rainy Days'],
};

// Dummy line chart data - month
const monthDataLineGraph = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      data: [20, 45, 28, 80],
      color: (opacity = 1) => `rgba(7, 32, 114, ${opacity})`,
      strokeWidth: 2,
    },
  ],
  legend: ['Rainy Days'],
};

// chart configuration (for chart kit)
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(91, 87, 89, ${opacity})`,
  strokeWidth: 2,
  useShadowColorFromDataset: false,
};

// eslint-disable-next-line no-unused-vars
export default function Dashboard({ navigation }) {
  // this needs to be updated reactively, perhaps using usestate
  let lineGraphData = yearDataLineGraph;

  const switchTimeframe = (timeFrame) => {
    if (timeFrame === 'm') {
      lineGraphData = monthDataLineGraph;
    } else if (timeFrame === 'y') {
      lineGraphData = yearDataLineGraph;
    }
  };

  return (
    <>
      <PieChart
        data={data}
        width={370}
        height={240}
        chartConfig={chartConfig}
        accessor="emissions"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
      />
      <LineChart
        style={susDashboardStyles.lineChart}
        data={lineGraphData}
        width={370}
        height={220}
        chartConfig={chartConfig}
      />
      <TouchableOpacity
        style={susDashboardStyles.monthButton}
        onPress={switchTimeframe('m')}
      >
        <Text style={susDashboardStyles.buttonText}>Month</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={susDashboardStyles.yearButton}
        onPress={switchTimeframe('y')}
      >
        <Text style={susDashboardStyles.buttonText}>Year</Text>
      </TouchableOpacity>
    </>
  );
}
