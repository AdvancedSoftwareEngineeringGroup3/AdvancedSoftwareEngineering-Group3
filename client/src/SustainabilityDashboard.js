import React, { useRef, useEffect } from 'react';
import * as Progress from 'react-native-progress';
import { Animated, TouchableWithoutFeedback } from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { TouchableOpacity, Text, View, Image, ScrollView } from 'react-native';
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

// Dummy pie chart data
const rankings = [
  { name: 'You', icon: fullBloom, sustainabilityScore: 85 },
  { name: 'Alice', icon: bushy, sustainabilityScore: 95 },
  { name: 'Bob', icon: bloom, sustainabilityScore: 70 },
  { name: 'Charlie', icon: bald, sustainabilityScore: 88 },
  { name: 'Diana', icon: goldCar, sustainabilityScore: 78 },
];

const sustainabilityScore = '75';
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
const gridItems = [
  { image: goldBike, label: 'Distance traveled by Bike', ratio: 50, total: 100 },
  { image: silverBike, label: 'Distance traveled by Walking', ratio: 30, total: 100 },
  { image: bronzeBus, label: 'Distance traveled by Bus', ratio: 70, total: 100 },
  { image: goldCar, label: 'Distance traveled by Car', ratio: 90, total: 100 },
  { image: silverTrain, label: 'Distance traveled by Train', ratio: 20, total: 100 },
  { image: bronzeCar, label: 'Distance traveled by Luas', ratio: 60, total: 100 },
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

export default function Dashboard({ navigation }) {
  let lineGraphData = yearDataLineGraph;

  const switchTimeframe = (timeFrame) => {
    if (timeFrame === 'm') {
      lineGraphData = monthDataLineGraph;
    } else if (timeFrame === 'y') {
      lineGraphData = yearDataLineGraph;
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