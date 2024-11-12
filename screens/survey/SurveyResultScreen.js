import React from 'react';
import { View, Text, StyleSheet, ScrollView, Share } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Button } from '@rneui/themed'; // Importer le bouton d'@rneui
import { useNavigation } from '@react-navigation/native';

const SurveyResultScreen = () => {
  const navigation = useNavigation();

  // Exemple de données pour le PieChart
  const surveyData = [
    { name: 'Option 1', population: 50, color: '#f39c12', legendFontColor: '#f39c12', legendFontSize: 15 },
    { name: 'Option 2', population: 30, color: '#e74c3c', legendFontColor: '#e74c3c', legendFontSize: 15 },
    { name: 'Option 3', population: 20, color: '#3498db', legendFontColor: '#3498db', legendFontSize: 15 },
  ];

  // Infos du sondage
  const surveyInfo = {
    title: "Survey on Customer Satisfaction",
    groupName: "Marketing Team",
    startDate: "2024-11-01",
    endDate: "2024-11-30",
    description: "This survey helps us understand customer satisfaction and gather feedback on our services."
  };

  // Fonction de partage
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Survey Results: \nTitle: ${surveyInfo.title}\nGroup: ${surveyInfo.groupName}\nStart Date: ${surveyInfo.startDate}\nEnd Date: ${surveyInfo.endDate}\nResults: ${surveyData.map(option => `${option.name}: ${option.population}%`).join('\n')}`,
      });
    } catch (error) {
      console.error("Error sharing: ", error.message);
    }
  };

  // Rediriger vers la page d'options
  const handleOptionsClick = () => {
    navigation.navigate('SurveyOptions'); // Changez 'SurveyOptions' avec le nom de votre screen
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{surveyInfo.title}</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Group: </Text>{surveyInfo.groupName}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>Start Date: </Text>{surveyInfo.startDate}
          </Text>
          <Text style={styles.infoText}>
            <Text style={styles.bold}>End Date: </Text>{surveyInfo.endDate}
          </Text>
        </View>
      </View>

      {/* Description Section */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{surveyInfo.description}</Text>
        <Text style={styles.link} onPress={handleOptionsClick}>
          View Options
        </Text>
      </View>

      {/* Pie Chart Section */}
      <View style={styles.chartContainer}>
        <PieChart
          data={surveyData}
          width={350}
          height={220}
          chartConfig={styles.chartConfig}
          accessor="population"
          backgroundColor="transparent"
        />
      </View>

      {/* Share Button Section */}
      <View style={styles.shareButtonContainer}>
        <Button
          title="Share Results"
          onPress={handleShare}
          buttonStyle={styles.shareButton}
          titleStyle={styles.shareButtonTitle}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f7f8f9', // Fond clair pour une interface moderne
    padding: 20,
  },
  headerContainer: {
    marginBottom: 25,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Bordure pour séparer le header
    paddingBottom: 15,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoContainer: {
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#7f8c8d',
    textAlign: 'center',
    marginVertical: 5,
  },
  bold: {
    fontWeight: '700',
    color: '#34495e',
  },
  descriptionContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  link: {
    color: '#3498db',
    fontSize: 18,
    fontFamily: 'Montserrat',
    fontWeight: '600',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
  },
  chartContainer: {
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Ombre pour Android
  },
  chartConfig: {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  },
  shareButtonContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#3498db',
    borderRadius: 50,
    paddingVertical: 15,
    width: '100%',
  },
  shareButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SurveyResultScreen;
