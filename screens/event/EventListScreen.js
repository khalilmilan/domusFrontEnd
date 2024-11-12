import React, { useState, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Platform,
    StatusBar,
    Dimensions
} from 'react-native';
import { ScrollView, RefreshControl } from 'react-native';

import {
    Header,
    Text,
    Button,
    Icon,
    ListItem,
    BottomSheet,
    Input,
    Chip,
    Divider
} from '@rneui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME_COLOR } from '../../constants';

const { width } = Dimensions.get('window');

const SECONDARY_COLOR = '#FF6584';
const mockEvents = [
    {
        id: '1',
        label: 'Réunion d\'équipe',
        date: new Date('2024-11-10'),
        creator: 'Alice Martin',
        color: '#FFD700'
    },
    {
        id: '2',
        label: 'Conférence React',
        date: new Date('2024-11-15'),
        creator: 'Bob Dupont',
        color: '#98FB98'
    },
    {
        id: '3',
        label: 'Workshop Design',
        date: new Date('2024-11-20'),
        creator: 'Claire Thomas',
        color: '#87CEEB'
    },
    {
        id: '4',
        label: 'Réunion d\'équipe',
        date: new Date('2024-11-10'),
        creator: 'Alice Martin',
        color: '#FFD700'
    },
    {
        id: '5',
        label: 'Conférence React',
        date: new Date('2024-11-15'),
        creator: 'Bob Dupont',
        color: '#98FB98'
    },
    {
        id: '6',
        label: 'Workshop Design',
        date: new Date('2024-11-20'),
        creator: 'Claire Thomas',
        color: '#87CEEB'
    },
    {
        id: '7',
        label: 'Réunion d\'équipe',
        date: new Date('2024-11-10'),
        creator: 'Alice Martin',
        color: '#FFD700'
    },
    {
        id: '8',
        label: 'Conférence React',
        date: new Date('2024-11-15'),
        creator: 'Bob Dupont',
        color: '#98FB98'
    },
    {
        id: '9',
        label: 'Workshop Design',
        date: new Date('2024-11-20'),
        creator: 'Claire Thomas',
        color: '#87CEEB'
    },
];

const EventListScreen = () => {
    // ... États précédents ...
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(50)).current;
    const [events, setEvents] = useState(mockEvents);
    const [isFilterVisible, setFilterVisible] = useState(false);
    const [isActionVisible, setActionVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // États pour les filtres
    const [searchText, setSearchText] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showPastEvents, setShowPastEvents] = useState(true);
    const [sortType, setSortType] = useState('date'); // 'date' ou 'label'
    const [activeFilters, setActiveFilters] = useState([]); // État manquant

    // Animations


    // Fonction pour gérer les filtres
    const removeFilter = (filterToRemove) => {
        let testFilter = activeFilters.filter(filter => filter.type !== filterToRemove.type);
        setActiveFilters(testFilter);

        console.log("filtredToRemove" + JSON.stringify(filterToRemove))
        console.log(testFilter)
        switch (filterToRemove.type) {
            case 'search':
                setSearchText('');
                break;
            case 'date':
                setSelectedDate(null);
                break;
            case 'pastEvents':
                setShowPastEvents(true);
                break;
            case 'sort':
                setSortType(null); // Revenir au tri par défaut
                break;
        }

        // Réappliquer les filtres après suppression
        setTimeout(() => applyFilters(), 2);
        console.log("size: " + activeFilters.length)
    };
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // Simuler le chargement des données
        setTimeout(() => {
            setEvents(mockEvents);
            setRefreshing(false);
        }, 1000);
    }, []);
    const applyFilters = () => {
        let filtered = [...mockEvents];
        let newActiveFilters = [];

        // Filtre par texte
        if (searchText.trim()) {
            filtered = filtered.filter(event =>
                event.label.toLowerCase().includes(searchText.toLowerCase())
            );
            newActiveFilters.push({
                type: 'search',
                value: searchText,
                label: `Recherche: ${searchText}`
            });
        }

        // Filtre par date
        if (selectedDate) {
            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);
                const filterDate = new Date(selectedDate);
                return eventDate.toDateString() === filterDate.toDateString();
            });
            newActiveFilters.push({
                type: 'date',
                value: selectedDate.toLocaleDateString(),
                label: `Date: ${selectedDate.toLocaleDateString()}`
            });
        }

        // Filtre événements passés/futurs
        const now = new Date();
        if (!showPastEvents) {
            filtered = filtered.filter(event => new Date(event.date) > now);
            newActiveFilters.push({
                type: 'pastEvents',
                value: 'hidden',
                label: 'Événements futurs uniquement'
            });
        }

        // Tri
        if (sortType === 'date') {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            newActiveFilters.push({
                type: 'sort',
                value: 'date',
                label: 'Trié par date'
            });
        } else if (sortType === 'nom') {
            filtered.sort((a, b) => a.label.localeCompare(b.label));
            newActiveFilters.push({
                type: 'sort',
                value: 'label',
                label: 'Trié par nom'
            });
        }
        setEvents(filtered);
        setActiveFilters(newActiveFilters);
        setFilterVisible(false);
    };

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                tension: 20,
                friction: 7,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const renderHeader = () => (
        <LinearGradient
            colors={[THEME_COLOR, '#8A84FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
        >
            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Mes Événements</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => console.log('Nouvel événement')}
                >
                    <Icon name="add" color="#fff" size={28} />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );

    const renderEventItem = (event, index) => (
        <Animated.View
            style={[
                styles.eventContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: translateY }],
                }
            ]}
        >
            <TouchableOpacity
                style={[styles.eventCard, { borderLeftColor: event.color }]}

            >
                <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{event.label}</Text>
                    <TouchableOpacity onPress={() => {
                        setSelectedEvent(event);
                        setActionVisible(true);
                    }}>
                        <Icon name="more-vert" color={THEME_COLOR} />
                    </TouchableOpacity>
                </View>
                <View style={styles.eventDetails}>
                    <View style={styles.eventInfo}>
                        <Icon name="event" size={16} color="#666" style={styles.eventIcon} />
                        <Text style={styles.eventDate}>
                            {event.date.toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </Text>
                    </View>
                    <View style={styles.eventInfo}>
                        <Icon name="person" size={16} color="#666" style={styles.eventIcon} />
                        <Text style={styles.eventCreator}>{event.creator}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );

    const renderFilterButton = () => (
        <TouchableOpacity
            style={styles.floatingFilterButton}
            onPress={() => setFilterVisible(true)}
        >
            <LinearGradient
                colors={[SECONDARY_COLOR, '#FF8BA7']}
                style={styles.filterGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Icon name="filter-list" color="#fff" size={24} />
                <Text style={styles.filterButtonText}>Filtrer</Text>
            </LinearGradient>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {renderHeader()}
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Chips des filtres actifs */}
                <View style={styles.chipsContainer}>
                    {activeFilters.map((filter, index) => (
                        <Chip
                            key={index}
                            title={filter.label}
                            icon={{
                                name: 'close',
                                size: 16,
                                color: THEME_COLOR,
                                type: 'material'
                            }}
                            onPress={() => removeFilter(filter)}
                            buttonStyle={styles.chipButton}
                            titleStyle={styles.chipTitle}
                            containerStyle={styles.chip}
                        />
                    ))}
                </View>


                {/* Liste des événements */}
                {events.map(renderEventItem)}


                <View style={{ height: 80 }} />
            </ScrollView>
            {renderFilterButton()}
            {/* BottomSheet des filtres */}
            <BottomSheet
                isVisible={isFilterVisible}
                onBackdropPress={() => setFilterVisible(false)}
                backdropStyle={{ backgroundColor: 'transparent' }} // Enlève le fond sombre
                containerStyle={styles.bottomSheet}
            >
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.bottomSheetTitle}>Filtres</Text>
                        <Divider style={styles.bottomSheetDivider} />
                    </View>

                    <Input
                        placeholder="Rechercher un événement"
                        leftIcon={{
                            name: 'search',
                            color: THEME_COLOR,
                            size: 20
                        }}
                        inputContainerStyle={styles.searchInput}
                        inputStyle={styles.searchInputText}
                        value={searchText}
                        onChangeText={setSearchText}
                    />

                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Icon name="calendar-today" color={THEME_COLOR} size={20} />
                        <Text style={styles.datePickerText}>
                            {selectedDate ? selectedDate.toLocaleDateString() : 'Choisir une date'}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.filterOptions}>
                        <Button
                            title={showPastEvents ? "Masquer événements passés" : "Afficher événements passés"}
                            type="outline"
                            icon={{
                                name: showPastEvents ? 'visibility-off' : 'visibility',
                                color: THEME_COLOR,
                                size: 20
                            }}
                            buttonStyle={styles.filterOptionButton}
                            titleStyle={styles.filterOptionText}
                        />

                        <Button
                            title={sortType === 'date' ? "Trier par nom" : "Trier par date"}
                            type="outline"
                            icon={{
                                name: sortType === 'date' ? 'sort-by-alpha' : 'date-range',
                                color: THEME_COLOR,
                                size: 20
                            }}
                            buttonStyle={styles.filterOptionButton}
                            titleStyle={styles.filterOptionText}
                        />
                    </View>

                    <Button
                        title="Appliquer les filtres"
                        ViewComponent={LinearGradient}
                        linearGradientProps={{
                            colors: [THEME_COLOR, '#8A84FF'],
                            start: { x: 0, y: 0 },
                            end: { x: 1, y: 0 },
                        }}
                        onPress={applyFilters}
                        buttonStyle={styles.applyButton}
                        titleStyle={styles.applyButtonText}
                        icon={{
                            name: 'check',
                            color: '#fff',
                            size: 20
                        }}
                    />
                </View>
            </BottomSheet>

            {/* BottomSheet des actions */}
            <BottomSheet
                isVisible={isActionVisible}
                onBackdropPress={() => setActionVisible(false)}    
        modalProps={{
          animationType: 'slide',
          transparent: true,   // Assure que le fond est transparent
          presentationStyle: Platform.OS === 'ios' ? 'overFullScreen' : 'fullScreen',  // Important pour iOS
        }}
        containerStyle={styles.bottomSheetContainerMore} // Style personnalisé
        
            >
                <View style={styles.actionSheet}>
                    <Button
                        title="Modifier l'événement"
                        icon={{ name: 'edit', color: THEME_COLOR, size: 20 }}
                        type="clear"
                        titleStyle={[styles.actionButtonText, { color: THEME_COLOR }]}
                        buttonStyle={styles.actionButton}
                    />
                    <Divider />
                    <Button
                        title="Supprimer l'événement"
                        icon={{ name: 'delete', color: '#FF3B30', size: 20 }}
                        type="clear"
                        titleStyle={[styles.actionButtonText, { color: '#FF3B30' }]}
                        buttonStyle={styles.actionButton}
                    />
                </View>
            </BottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: '#F8F9FE',
    },
    headerGradient: {
        paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
    },
    addButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 15,
    },
    chip: {
        margin: 4,
        backgroundColor: '#F0F3FF',
        borderRadius: 20,
    },
    chipButton: {
        backgroundColor: 'transparent',
    },
    chipTitle: {
        color: THEME_COLOR,
        fontSize: 12,
    },
    eventContainer: {
        paddingHorizontal: 15,
        marginBottom: 12,
    },
    eventCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        borderLeftWidth: 4,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    eventHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    eventDetails: {
        marginTop: 8,
    },
    eventInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    eventIcon: {
        marginRight: 8,
    },
    eventDate: {
        color: '#666',
        fontSize: 14,
    },
    eventCreator: {
        color: '#666',
        fontSize: 14,
    },
    floatingFilterButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        borderRadius: 25,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    filterGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
    },
    filterButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '600',
    },
    bottomSheetContainer: {
         backgroundColor: 'white', // Couleur de fond
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomSheetContainerMore: {
         backgroundColor: 'transparent', // Couleur de fond
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    bottomSheetHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    bottomSheetDivider: {
        width: 40,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
    },
    searchInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 0,
    },
    searchInputText: {
        fontSize: 16,
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    datePickerText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#1A1A1A',
    },
    filterOptions: {
        marginVertical: 15,
    },
    filterOptionButton: {
        marginVertical: 5,
        borderColor: THEME_COLOR,
        borderRadius: 10,
        padding: 12,
    },
    filterOptionText: {
        color: THEME_COLOR,
        marginLeft: 8,
    },
    applyButton: {
        borderRadius: 10,
        padding: 15,
        marginTop: 10,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    actionSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 10,
    },
    actionButton: {
        paddingVertical: 15,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
   /* bottomSheetContainer: {
    backgroundColor: 'transparent', // Couleur de fond
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 10, // Ombre pour donner de la profondeur
  },*/
  backdropStyle: {
    backgroundColor: 'transparent', // Enlève le fond sombre
  },
});

export default EventListScreen;