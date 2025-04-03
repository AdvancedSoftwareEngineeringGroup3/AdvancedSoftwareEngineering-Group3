import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import {
  Animated,
  TouchableWithoutFeedback,
  Platform,
  View,
  Image,
  ScrollView,
  Text,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
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

// Define thresholds for medals
const MEDAL_THRESHOLDS = {
  gold: 70,
  silver: 50,
  bronze: 0,
};

// Determine medal type based on distance
const getMedalImage = (value, vehicleType) => {
  const medalImages = {
    bike: {
      gold: goldBike,
      silver: silverBike,
      bronze: bronzeBike,
    },
    bus: {
      gold: goldBus,
      silver: silverBus,
      bronze: bronzeBus,
    },
    train: {
      gold: goldTrain,
      silver: silverTrain,
      bronze: bronzeTrain,
    },
    car: {
      gold: goldCar,
      silver: silverCar,
      bronze: bronzeCar,
    },
    // Add default images for other vehicle types
    default: {
      gold: goldCar,
      silver: silverCar,
      bronze: bronzeCar,
    },
  };

  if (value >= MEDAL_THRESHOLDS.gold) {
    return medalImages[vehicleType]?.gold || medalImages.default.gold;
  }
  if (value >= MEDAL_THRESHOLDS.silver) {
    return medalImages[vehicleType]?.silver || medalImages.default.silver;
  }
  return medalImages[vehicleType]?.bronze || medalImages.default.bronze;
};

const getIconForScore = (score) => {
  if (score >= 70) return fullBloom;
  if (score >= 40) return bushy;
  if (score >= 20) return bloom;
  return bald;
};

const configurePieChartData = (emissionsSavings) => {
  // Define colors for types
  const colors = {
    train: '#6689c6',
    bus: '#e0ac2b',
    walk: '#9a6fb0',
    bike: '#a53253',
    luas: '#229e1c',
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
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec',
  };

  // Sort the months numerically
  const sortedMonths = Object.keys(yearEmissions)
    // eslint-disable-next-line prettier/prettier
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  return {
    labels: sortedMonths.map((month) => monthMapping[month]),
    datasets: [
      {
        data: sortedMonths.map((month) => yearEmissions[month]),
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
  },
};

export default function Dashboard() {
  const [userSustainabilityScore, setUserSustainabilityScore] = useState(0);
  const [userSustainabilityImage, setUserSustainabilityImage] = useState(bald); // Default image
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [gridItems, setGridItems] = useState([]);
  const [savingsPieChartData, setPieChartData] = useState([]);
  const [yearLineChartData, setYearLineChartData] = useState({
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
  const senderName = 'Cormac';

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    getSustainabilityStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateGridItems = (rawDistances) => {
    const items = [
      {
        type: 'bike',
        label: 'Distance traveled by Bike',
        value: rawDistances.bike || 0,
        total: 100,
      },
      {
        type: 'walk',
        label: 'Distance traveled by Walking',
        value: rawDistances.walk || 0,
        total: 100,
      },
      {
        type: 'bus',
        label: 'Distance traveled by Bus',
        value: rawDistances.bus || 0,
        total: 100,
      },
      {
        type: 'car',
        label: 'Distance traveled by Car',
        value: rawDistances.car || 0,
        total: 100,
      },
      {
        type: 'train',
        label: 'Distance traveled by Train',
        value: rawDistances.train || 0,
        total: 100,
      },
      {
        type: 'luas',
        label: 'Distance traveled by Luas',
        value: rawDistances.luas || 0,
        total: 100,
      },
    ];

    setGridItems(
      items.map((item) => ({
        ...item,
        image: getMedalImage(item.value, item.type),
        ratio: item.value,
      })),
    );
  };

  const getSustainabilityStats = async () => {
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
        console.log('Response from Server: ', serverMessage.message);

        const {
          emissionsSavings,
          currentYearEmissions,
          rawDistances,
          friendsSusScores,
        } = serverMessage;

        console.log('Emissions savings: ', emissionsSavings);
        console.log('Year emissions: ', currentYearEmissions);
        console.log('Raw distances: ', rawDistances);
        console.log('Sust scores of friends: ', friendsSusScores);

        // Format leaderboard data with icons
        const formattedLeaderboardData = Object.entries(friendsSusScores)
          .map(([username, sustainabilityScore]) => ({
            name: username,
            sustainabilityScore: parseInt(sustainabilityScore, 10),
            icon: getIconForScore(parseInt(sustainabilityScore, 10)),
          }))
          .sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);

        const userSustScore = formattedLeaderboardData.find(
          (item) => item.name === senderName,
        );
        // Set the sustainability score and icon for senderName
        if (userSustScore) {
          setUserSustainabilityScore(userSustScore.sustainabilityScore);
          setUserSustainabilityImage(userSustScore.icon);
        }

        updateGridItems(rawDistances); // Update grid items with raw distances
        setPieChartData(configurePieChartData(emissionsSavings));
        setYearLineChartData(configureLineChartData(currentYearEmissions));
        setLeaderBoardData(formattedLeaderboardData);
      } else {
        const responseText = await response.text();
        console.error('Failed to get monthly emissions: ', responseText);
      }
    } catch (error) {
      console.error('Error getting sustainability stats: ', error);
    }
  };

  const [shakeAnims] = useState(() =>
    Array(6)
      .fill(0)
      .map(() => new Animated.Value(0)),
  );

  const handlePressIn = (index) => {
    if (!shakeAnims[index]) return;

    // Start the shake animation when the image is pressed
    Animated.sequence([
      Animated.timing(shakeAnims[index], {
        toValue: -5, // Move left
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnims[index], {
        toValue: 5, // Move right
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnims[index], {
        toValue: 0, // Return to center
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ScrollView
      style={susDashboardStyles.container} // Outer container styles
      contentContainerStyle={susDashboardStyles.scrollContent} // Inner content alignment
    >
      {/* Sustainability Score Section */}
      <View style={susDashboardStyles.scoreContainer}>
        <Text style={susDashboardStyles.scoreText}>
          Sustainability Score: {userSustainabilityScore}
        </Text>
        <Image
          source={userSustainabilityImage}
          style={susDashboardStyles.image}
        />
      </View>

      {/* Rankings Section */}
      <Text style={susDashboardStyles.titleText}>Leaderboard</Text>
      <View style={susDashboardStyles.rankingsContainer}>
        {/* Title Row */}
        <View style={susDashboardStyles.rankingsHeader}>
          <Text style={susDashboardStyles.rankColumn}>Rank</Text>
          <Text style={susDashboardStyles.iconColumn}> </Text>
          <Text style={susDashboardStyles.nameHeader}>Name</Text>
          <Text style={susDashboardStyles.scoreColumn}>Score</Text>
        </View>

        <ScrollView>
          {leaderBoardData.map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <View key={index} style={susDashboardStyles.rankingsItem}>
              {/* Row with four columns */}
              <View style={susDashboardStyles.rankingsRow}>
                {/* Rank Column */}
                <Text style={susDashboardStyles.rankColumn}>{index + 1}</Text>

                {/* Icon/Image Column */}
                <Image
                  source={item.icon}
                  style={susDashboardStyles.iconColumn}
                />

                {/* Name and Score Column */}
                <Text style={susDashboardStyles.nameColumn}>{item.name}</Text>

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
        {gridItems.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <View key={index} style={susDashboardStyles.gridItem}>
            <TouchableWithoutFeedback
              onPressIn={() => handlePressIn(index)}
              // eslint-disable-next-line react/no-array-index-key
              key={`touch-${index}`}
            >
              <Animated.Image
                source={item.image}
                style={[
                  susDashboardStyles.gridImage,
                  {
                    transform: [
                      {
                        translateX: shakeAnims[index] || new Animated.Value(0),
                      },
                    ],
                  },
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
        ))}
      </View>

      {/* Pie Chart Section */}
      <Text
        style={[susDashboardStyles.titleText, susDashboardStyles.centeredText]}
      >
        Monthly Emissions Savings Breakdown
      </Text>
      <PieChart
        data={savingsPieChartData}
        width={370} // Ensure this is a number
        height={220} // Ensure this is a number
        chartConfig={chartConfig}
        accessor="emissions"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]} // Adjust the center position as needed
        absolute
      />

      {/* Line Chart Section */}
      <Text
        style={[susDashboardStyles.titleText, susDashboardStyles.centeredText]}
      >
        Monthly Emissions
      </Text>
      <View style={susDashboardStyles.chartContainer}>
        <LineChart
          style={susDashboardStyles.lineChart}
          data={yearLineChartData}
          width={370} // Ensure this is a number
          height={220} // Ensure this is a number
          chartConfig={chartConfig}
        />
      </View>
    </ScrollView>
  );
}
