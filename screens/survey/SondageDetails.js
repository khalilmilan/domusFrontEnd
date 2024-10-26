import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const SondageDetails = ({survey}) => {
const sampleSurvey = {
    title: "Préférence de saveurs de glace",
    description: "Un sondage pour déterminer les saveurs de glace préférées parmi nos clients fidèles. Ce sondage a été mené auprès de 500 participants sur une période de deux semaines.",
    results: [
      { name: 'Vanille', population: 30, color: '#FFA500' },
      { name: 'Chocolat', population: 25, color: '#8B4513' },
      { name: 'Fraise', population: 20, color: '#FF69B4' },
      { name: 'Pistache', population: 15, color: '#90EE90' },
      { name: 'Autre', population: 10, color: '#A9A9A9' },
    ],
    totalVotes: 500,
    dateConducted: "15 Mai - 30 Mai 2023"
  };

  const { title, description, results, totalVotes, dateConducted } = survey || sampleSurvey;

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.headerGradient}
      >
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Conduit du {dateConducted}</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.chartContainer}>
          <PieChart
            data={results}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>
        
        <View style={styles.legendContainer}>
          {results.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.name}: {item.population}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Total des votes: {totalVotes}</Text>
        </View>

        <TouchableOpacity style={styles.shareButton}/* onPress={onShare}*/>
          <Text style={styles.shareButtonText}>Partager les résultats</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  headerGradient: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#ddd',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    lineHeight: 24,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  legendContainer: {
    marginTop: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
    color: '#333',
  },
  statsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  shareButton: {
    backgroundColor: '#4c669f',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SondageDetails

