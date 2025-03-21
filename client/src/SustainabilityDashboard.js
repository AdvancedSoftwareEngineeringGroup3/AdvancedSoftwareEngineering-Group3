import { LineChart, PieChart } from 'react-native-chart-kit';
import { TouchableOpacity, Text, Platform } from 'react-native';
import susDashboardStyles from './components/styles/SustainabilityDashboard.styles';
import { useEffect, useState } from 'react';

const configurePieChartData = (emissionsSavings) => {
  // Defien colors for types
  const colors = {
    train: '#6689c6',
    bus: '#e0ac2b',
    walk: '#9a6fb0',
    car: '#a53253',
  };

  // Map emissions savings JSON to PieChart data
  return Object.keys(emissionsSavings).map((key) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    emissions: emissionsSavings[key],
    color: colors[key] || '#cccccc', // default color
    legendFontColor: '#7F7F7F',
    legendFOntSize: 15,
  }));
}

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
  const [monthlyEmissionsSavings, setMonthlyEmissionsSavings]  = useState([]);
  const [savingsPieChartData, setPieChartData] = useState([]);

  // test name
  const senderName = 'Cormac'


  useEffect(() => {
    getSustainabilityStats();
  }, []);

  // this needs to be updated reactively, perhaps using usestate
  let lineGraphData = yearDataLineGraph;

  const switchTimeframe = (timeFrame) => {
    if (timeFrame === 'm') {
      lineGraphData = monthDataLineGraph;
    } else if (timeFrame === 'y') {
      lineGraphData = yearDataLineGraph;
    }
  };

  const getSustainabilityStats = async () =>{
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(
        `Sending request to ${baseUrl}/get_sus_stats?sender=${senderName}`,
      );

      const response = await fetch(
        `${baseUrl}/get_sus_stats?sender=${senderName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const serverMessage = await response.json();
        console.log("Response from Server: ", serverMessage.message);

        savingsPieChartData = configurePieChartData(serverMessage.emissions_savings);

        setMonthlyEmissionsSavings(savingsPieChartData);
        setPieChartData(savingsPieChartData);
      }
      else{
        const responseText = await response.text();
        console.error("Failed to get monthly emissions: ", responseText);
        alert("Server error: ", error);
      }

    } catch (error){
      console.error("Error getting sustainability stats: ", error)
    }
  };

  return (
    <>
      <PieChart
        data={savingsPieChartData}
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
