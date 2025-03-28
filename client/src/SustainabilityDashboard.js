import { LineChart, PieChart } from 'react-native-chart-kit';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import susDashboardStyles from './components/styles/SustainabilityDashboard.styles';

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
    legendFontSize: 15,
  }));
};

const configureLineChartData = (yearEmissions) => {
  if (!yearEmissions || Object.keys(yearEmissions).length === 0) {
    return {
      labels: ['dummy1', 'dummy2'],
      datasets: [
        {
          data: [14, 50],
          color: (opacity = 1) => `rgba(7, 32, 114, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  }

  // Month mapping to full names
  const monthMapping = {
    '1': 'Jan',
    '2': 'Feb',
    '3': 'Mar',
    '4': 'Apr',
    '5': 'May',
    '6': 'Jun',
    '7': 'Jul',
    '8': 'Aug',
    '9': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
  };

  // Sort the months numerically
  const sortedMonths = Object.keys(yearEmissions)
    // eslint-disable-next-line prettier/prettier
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  return {
    labels: sortedMonths.map(month => monthMapping[month]),
    datasets: [
      {
        data: sortedMonths.map(month => yearEmissions[month]),
        color: (opacity = 1) => `rgba(7, 32, 144, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };
};

// chart configuration (for chart kit)
const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0,
  color: (opacity = 1) => `rgba(91, 87, 89, ${opacity})`,
  strokeWidth: 2,
  propsForHorizontalLabels: {
    transform: [{ rotate: '-45deg' }],
    textAnchor: 'end', // or 'start' depending on your rotate angle
    // Adjust originY/originX to help position the text
    originX: 0,
    // originY: 0,
  }
};

// eslint-disable-next-line no-unused-vars
export default function Dashboard({ navigation }) {
  // const [monthlyEmissionsSavings, setMonthlyEmissionsSavings]  = useState([]);
  // const [yearEmissions, setYearEmissions] = useState([])

  const [savingsPieChartData, setPieChartData] = useState([]);
  const  [yearLineChartData, setYearLineChartData] = useState({
    labels: ['Fetching data...'],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(7, 32, 114, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  });

  // test name
  const senderName = 'Cormac'

  useEffect(() => {
    getSustainabilityStats();
  }, []);

  // this needs to be updated reactively, perhaps using usestate
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

        const { emissions_savings, current_year_emissions } = serverMessage;

        console.log("Emissions savings: ", emissions_savings);
        console.log("Year emissions: ", current_year_emissions);

        setPieChartData(configurePieChartData(emissions_savings));
        setYearLineChartData(configureLineChartData(current_year_emissions));

      } else {
        const responseText = await response.text();
        console.error("Failed to get monthly emissions: ", responseText);
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
        data={yearLineChartData}
        width={370}
        height={220}
        chartConfig={chartConfig}
        accessor="emissions"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
      />
    </>
  );
}
