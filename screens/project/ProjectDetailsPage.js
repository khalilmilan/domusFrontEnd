import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

// Données d'exemple pour le projet
const exampleProject = {
  title: "Développement de l'application mobile EcoTrack",
  description: "Application mobile pour suivre et réduire l'empreinte carbone personnelle des utilisateurs.",
  startDate: "2024-03-01",
  endDate: "2024-08-31",
  participants: [
    { id: 1, firstName: "Sophie", lastName: "Martin", photo: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 2, firstName: "Thomas", lastName: "Dubois", photo: "https://randomuser.me/api/portraits/men/1.jpg" },
    { id: 3, firstName: "Emma", lastName: "Leroy", photo: "https://randomuser.me/api/portraits/women/2.jpg" },
    { id: 4, firstName: "Lucas", lastName: "Moreau", photo: "https://randomuser.me/api/portraits/men/2.jpg" },
  ],
  tickets: [
    { id: 1, title: "Conception de l'interface utilisateur", status: "finished" },
    { id: 2, title: "Implémentation du suivi GPS", status: "inprogress" },
    { id: 3, title: "Intégration de l'API de calcul carbone", status: "todo" },
    { id: 4, title: "Création de la base de données utilisateurs", status: "finished" },
    { id: 5, title: "Développement des notifications push", status: "inprogress" },
    { id: 6, title: "Tests d'utilisabilité", status: "todo" },
  ]
};

const ProjectDetailsPage = () => {
  const project = exampleProject;  // Utilisation directe des données d'exemple

  const renderParticipant = ({ item }) => (
    <View style={styles.participantItem}>
      <Image source={{ uri: item.photo }} style={styles.participantPhoto} />
      <Text style={styles.participantName}>{`${item.firstName} ${item.lastName}`}</Text>
    </View>
  );

  const renderTicket = ({ item }) => (
    <View style={[styles.ticketItem, { backgroundColor: getStatusColor(item.status) }]}>
      <Text style={styles.ticketTitle}>{item.title}</Text>
      <Text style={styles.ticketStatus}>{item.status}</Text>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return '#FFA07A';
      case 'inprogress': return '#98FB98';
      case 'finished': return '#87CEFA';
      default: return '#FFFFFF';
    }
  };

  const calculateProgress = () => {
    const total = project.tickets.length;
    const finished = project.tickets.filter(t => t.status === 'finished').length;
    const inProgress = project.tickets.filter(t => t.status === 'inprogress').length;
    const todo = project.tickets.filter(t => t.status === 'todo').length;

    return [
      { name: 'Terminé', population: finished, color: '#87CEFA', legendFontColor: '#7F7F7F' },
      { name: 'En cours', population: inProgress, color: '#98FB98', legendFontColor: '#7F7F7F' },
      { name: 'À faire', population: todo, color: '#FFA07A', legendFontColor: '#7F7F7F' },
    ];
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{project.title}</Text>
      <Text style={styles.description}>{project.description}</Text>
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>Début: {project.startDate}</Text>
        <Text style={styles.dateText}>Fin: {project.endDate}</Text>
      </View>

      <Text style={styles.sectionTitle}>Participants</Text>
      <FlatList
        data={project.participants}
        renderItem={renderParticipant}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <Text style={styles.sectionTitle}>Tickets</Text>
      <FlatList
        data={project.tickets}
        renderItem={renderTicket}
        keyExtractor={(item) => item.id.toString()}
        style={styles.ticketList}
      />

      <Text style={styles.sectionTitle}>Avancement du projet</Text>
      <PieChart
        data={calculateProgress()}
        width={300}
        height={200}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  participantItem: {
    marginRight: 15,
    alignItems: 'center',
  },
  participantPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  participantName: {
    textAlign: 'center',
    fontSize: 12,
  },
  ticketList: {
    marginBottom: 20,
  },
  ticketItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ticketStatus: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default ProjectDetailsPage;