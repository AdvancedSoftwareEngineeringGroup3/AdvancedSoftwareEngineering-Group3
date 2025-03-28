import React, { useRef, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Platform, View, Image, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import susDashboardStyles from './components/styles/SustainabilityDashboard.styles';
import fullBloom from './assets/SustainablityDashboard/Rootyfullbloom.png';
import bushy from './assets/SustainablityDashboard/RootyBushy.png';
import bloom from './assets/SustainablityDashboard/Rootybloom.png';
import bald from './assets/SustainablityDashboard/RootyBald.png';
import goldCar from './assets/SustainablityDashboard/CarGold.png';
import silverCar from './assets/SustainablityDashboard/CarSilver.png';
import bronzeCar from './assets/SustainablityDashboard/CarBronze.png';
import goldBike from './assets/SustainablityDashboard/BikeGold.png';
import silverBike from './assets/SustainablityDashboard/BikeSilver.png';
import bronzeBike from './assets/SustainablityDashboard/BikeBronze.png';
import goldBus from './assets/SustainablityDashboard/BusGold.png';
import silverBus from './assets/SustainablityDashboard/BusSilver.png';
import bronzeBus from './assets/SustainablityDashboard/BusBronze.png';
import goldTrain from './assets/SustainablityDashboard/GoldTrain.png';
import silverTrain from './assets/SustainablityDashboard/SilverTrain.png';
import bronzeTrain from './assets/SustainablityDashboard/BronzeTrain.png';

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
    <ScrollView
      style={susDashboardStyles.container} // Outer container styles
      contentContainerStyle={susDashboardStyles.scrollContent} // Inner content alignment
    >
      {/* Sustainability Score Section */}
      <View style={susDashboardStyles.scoreContainer}>
        <Text style={susDashboardStyles.scoreText}>
          Sustainability Score: {sustainabilityScore}
        </Text>
        <Image source={fullBloom} style={susDashboardStyles.image} />
      </View>

       {/* Rankings Section */}
       <Text style={susDashboardStyles.titleText}>Leadership Board</Text>
      <View style={susDashboardStyles.rankingsContainer}>
        {/* Title Row */}
        <View style={susDashboardStyles.rankingsHeader}>
          <Text style={susDashboardStyles.rankColumn}>Rank</Text>
          <Text style={susDashboardStyles.iconColumn}> </Text>
          <Text style={susDashboardStyles.nameHeader}>Name</Text>
          <Text style={susDashboardStyles.scoreColumn}>Score</Text>
        </View>

        <ScrollView>
          {rankings.map((item, index) => (
            <View key={index} style={susDashboardStyles.rankingsItem}>
              {/* Row with four columns */}
              <View style={susDashboardStyles.rankingsRow}>
                {/* Rank Column */}
                <Text style={susDashboardStyles.rankColumn}>{index + 1}</Text>

                {/* Icon/Image Column */}
                <Image source={item.icon} style={susDashboardStyles.iconColumn} />

                {/* Name and Score Column */}
                <Text style={susDashboardStyles.nameColumn}>
                  {item.name}
                </Text>

                {/* Sustainability Score Column */}
                <Text style={susDashboardStyles.scoreColumn}>
                  {item.sustainabilityScore}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>


      
        {/* Grid Section */}
      <View style={susDashboardStyles.gridContainer}>
        {gridItems.map((item, index) => {
          const shakeAnim = useRef(new Animated.Value(0)).current; // Initial horizontal position

          const handlePressIn = () => {
            // Start the shake animation when the image is pressed
            Animated.sequence([
              Animated.timing(shakeAnim, {
                toValue: -5, // Move left
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(shakeAnim, {
                toValue: 5, // Move right
                duration: 50,
                useNativeDriver: true,
              }),
              Animated.timing(shakeAnim, {
                toValue: 0, // Return to center
                duration: 50,
                useNativeDriver: true,
              }),
            ]).start();
          };

          return (
            <View key={index} style={susDashboardStyles.gridItem}>
              <TouchableWithoutFeedback onPressIn={handlePressIn}>
                <Animated.Image
                  source={item.image}
                  style={[
                    susDashboardStyles.gridImage,
                    { transform: [{ translateX: shakeAnim }] }, // Apply shaking animation
                  ]}
                />
              </TouchableWithoutFeedback>
              <Text style={susDashboardStyles.gridLabel}>{item.label}</Text>
              <Text style={susDashboardStyles.progressText}>
                {item.ratio}/{item.total}
              </Text>
              <Progress.Bar
                progress={item.ratio / item.total}
                width={100}
                height={10}
                color="#4CAF50"
                unfilledColor="#D3D3D3"
                borderWidth={0}
                borderColor="#000"
              />
            </View>
          );
        })}
      </View>


      {/* Line Chart Section */}
      <View style={susDashboardStyles.chartContainer}>
        <LineChart
          style={susDashboardStyles.lineChart}
          data={lineGraphData}
          width={370} // Ensure this is a number
          height={220} // Ensure this is a number
          chartConfig={chartConfig}
        />
      </View>

     
    </ScrollView>
  );
}