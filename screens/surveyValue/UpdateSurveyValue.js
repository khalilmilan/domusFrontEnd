import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDispatch } from 'react-redux';
import { addSurveyValue, editSurveyValue } from '../../redux/actions/actionSurveyValue';

const UpdateSurveyValue = ({ navigation, route }) => {
  let surveyValue = route.params.surveyValue;
  let loadSurvey = route.params.load;
  const [title, setTitle] = useState(surveyValue.title);
  const [description, setDescription] = useState(surveyValue.description);
  console.log("color: " + surveyValue.codeColor);
  const [colorCode, setColorCode] = useState(surveyValue.colorCode ? surveyValue.colorCode : '#000000');
  const [token, setToken] = useState();
  const [idUser, setIdUser] = useState();
  const dispatch = useDispatch();

  const load = async () => {
    try {
      let userDetails = await AsyncStorage.getItem("userDetails");
      if (userDetails != null) {
        let user = JSON.parse(userDetails);
        let tokens = user.token;
        setToken(tokens);
        setIdUser(user.userId)
      } else {
        console.log("No user details found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error in load function:", error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [token])
  const handleSubmit = async () => {
    // Ici, vous pouvez ajouter la logique pour sauvegarder l'entité
    try {
      let updatedValue = {
        ...surveyValue,
        title,
        description,
        colorCode
      }
      const result = await dispatch(editSurveyValue(token, updatedValue));
      loadSurvey();
      navigation.navigate('UpdateSurvey', { idSurvey: surveyValue.idSurvey })
    } catch (error) {
      console.log("error" + error)
    }
  };
const isFormValid = title && description && colorCode;
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.pageTitle}>Update Value</Text>
      <View style={styles.fieldset}>
        <Text style={styles.legend}>Value Details </Text>
        <View style={styles.field}>
          <Text style={styles.labelText}>Label</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez un label"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.labelText}>Description</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Entrez une description"
            value={description}
            onChangeText={setDescription}
            multiline={true}
            numberOfLines={4}
            placeholderTextColor="#888"
          />
        </View>
        <Text style={styles.label}>choose color :</Text>
        <View style={styles.colorPickerContainer}>
          <ColorPicker
            color={colorCode}
            onColorChange={(color) => setColorCode(color)}
            thumbSize={30}
            sliderSize={30}
            noSnap={true}
            row={true}
          />
        </View>

        <View style={[styles.colorPreview, { backgroundColor: colorCode }]}>
          <Text style={styles.colorPreviewText}>Selected color: {colorCode}</Text>
        </View>
        <TouchableOpacity style={styles.submitButton}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>Update Value</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
        margin: 20,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#f4f6f9', // Couleur douce pour le fond
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    fieldset: {
        padding: 15,
        borderColor: '#007bff', // Bordure bleue
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    legend: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#007bff',
    },
    field: {
        marginBottom: 20,
    },
    labelText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#e9ecef', // Légèrement coloré pour les champs
        color: '#333', // Texte dans les champs
    },
    textarea: {
        height: 100,
        textAlignVertical: 'top',
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dateText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333', // Couleur du texte de la date
    },
    datePicker: {
        marginTop: 20, // Corrige la position du DatePicker
    },
    submitButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
 
  
 
  colorPickerContainer: {
    height: 220,
    marginBottom: 20,
  },
  colorPreview: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 5,
  },
  colorPreviewText: {
    color: '#fff',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  
});

export default UpdateSurveyValue

