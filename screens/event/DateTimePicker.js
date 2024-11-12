import React, { useState } from 'react';
import { View, Modal, Platform,StyleSheet } from 'react-native';
import { Icon } from '@rneui/themed';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const DatePickerComponent = () => {
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    onDateSelect(date.dateString);
    setCalendarVisible(false);
  };

  return (
    <View>
      <Icon
        name="calendar"
        type="feather"
        size={24}
        onPress={() => setCalendarVisible(true)}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isCalendarVisible}
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white',
            margin: 20,
            borderRadius: 10,
            padding: 10,
          }}>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#2089dc' }
              }}
              theme={{
                todayTextColor: '#2089dc',
                selectedDayBackgroundColor: '#2089dc',
                arrowColor: '#2089dc',
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        // Styles pour le conteneur
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    datePickerText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default DatePickerComponent;
