import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  Animated,
  Keyboard
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const EventForm = () => {
  const [formData, setFormData] = useState({
    label: '',
    description: '',
    date: new Date()
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error'); // 'error' ou 'success'
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(-100))[0];

  const showNotification = () => {
    slideAnim.setValue(-100);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => setShowAlert(false));
    }, 3000);
  };

  const showAlertWithMessage = (message, type = 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    showNotification();
  };

  const handleDateChange = (event, selectedDate) => {
    
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    
    if (!formData.label.trim()) {
      showAlertWithMessage('Veuillez saisir un titre pour l\'événement');
      return;
    }
    if (!formData.description.trim()) {
      showAlertWithMessage('Veuillez ajouter une description');
      return;
    }

    showAlertWithMessage('Événement ajouté avec succès!', 'success');
    
    setFormData({
      label: '',
      description: '',
      date: new Date()
    });
  };

  const FieldSet = ({ title, children }) => (
    <View style={styles.fieldsetWrapper}>
    <View style={styles.fieldset}>
      <View style={styles.legendWrapper}>
        <View style={styles.legendLine} />
        <View style={styles.legendContainer}>
          <Ionicons 
            name={title.toLowerCase().includes('date') ? 'time-outline' : 'information-circle-outline'} 
            size={18} 
            color="#0984e3"
          />
          <Text style={styles.legend}>{title}</Text>
        </View>
        <View style={styles.legendLine} />
      </View>
      <View style={styles.fieldsetContent}>
        {children}
      </View>
    </View>
  </View>
  );

  return (
    <View style={styles.container}>
      {/* Alerte améliorée */}
      {showAlert && (
        <Animated.View
          style={[
            styles.alert,
            alertType === 'success' ? styles.alertSuccess : styles.alertError,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.alertContent}>
            <Ionicons
              name={alertType === 'success' ? 'checkmark-circle' : 'alert-circle'}
              size={24}
              color={alertType === 'success' ? '#fff' : '#fff'}
            />
            <Text style={styles.alertText}>{alertMessage} test</Text>
          </View>
        </Animated.View>
      )}

      <Text style={styles.formTitle}>New Event</Text>

      <FieldSet title="Informations générales">
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Titre de l'événement</Text>
          <TextInput
            style={styles.input}
            value={formData.label}
            onChangeText={(text) => setFormData({ ...formData, label: text })}
            placeholder="Saisissez le titre..."
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Décrivez votre événement..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </FieldSet>

      <FieldSet title="Date et heure">
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Date de l'événement</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#666" style={styles.dateIcon} />
            <Text style={styles.dateButtonText}>
              {formData.date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}
        </View>
      </FieldSet>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Ionicons name="add-circle-outline" size={20} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Ajouter l'événement</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 25,
    textAlign: 'center',
  },
  fieldset: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendContainer: {
    position: 'absolute',
    top: -12,
    left: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  legend: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  fieldsetContent: {
    padding: 20,
    paddingTop: 25,
  },
  alert: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    zIndex: 100,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  alertSuccess: {
    backgroundColor: '#00b894',
  },
  alertError: {
    backgroundColor: '#ff7675',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    color: 'white',
    fontSize: 16,
   // marginLeft: 10,
   // flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textArea: {
    height: 120,
    paddingTop: 15,
  },
  dateButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  submitButton: {
    backgroundColor: '#0984e3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fieldsetWrapper: {
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  fieldset: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendWrapper: {
    position: 'absolute',
    top: -14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  legendLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#e0e0e0',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  legend: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 6,
  },
  fieldsetContent: {
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 120,
    paddingTop: 15,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateIcon: {
    marginRight: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  submitButton: {
    backgroundColor: '#0984e3',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default EventForm;