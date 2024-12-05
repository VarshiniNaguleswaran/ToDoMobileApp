import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddTask({ navigation, route }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [initialName, setInitialName] = useState('');
  const [initialDescription, setInitialDescription] = useState('');
  const { task } = route.params || {};

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setInitialName(task.name);
      setInitialDescription(task.description);
    }
  }, [task]);

  const handleSave = async () => {
    if (!name || !description) {
      alert('Both task name and description cannot be empty');
      return;
    }

    if (task && (name !== initialName || description !== initialDescription)) {
      Alert.alert(
        'Save Changes',
        'Do you want to save the changes to this task?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Save',
            onPress: async () => {
              await saveTask();
              showSuccessNotification(); 
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      await saveTask();
      showSuccessNotification(); 
    }
  };

  const saveTask = async () => {
    const storedTasks = await AsyncStorage.getItem('tasks');
    const tasks = JSON.parse(storedTasks) || [];

    if (task) {
      const updatedTasks = tasks.map(t => (t.id === task.id ? { ...t, name, description } : t));
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } else {
      const newTask = { id: Date.now(), name, description, completed: false };
      tasks.push(newTask);
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    }

    navigation.goBack();
  };

  const showSuccessNotification = () => {
    Alert.alert('Success', 'Task has been successfully updated!', [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Task Name"
        style={styles.input}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Task Description"
        style={[styles.input, styles.descriptionInput]}
        multiline={true}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderBottomWidth: 2,
    marginBottom: 15,
    padding: 10,
  },
  descriptionInput: {
    height: 100,
  },
  saveButton: {
    backgroundColor: 'purple', 
    paddingVertical: 12, 
    paddingHorizontal: 20,
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 10, 
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18, 
    textAlign: 'center', 
  },
});
