import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckBox } from 'react-native-elements'; 

const HomeTaskList = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem('tasks');
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    };
    const unsubscribe = navigation.addListener('focus', load); 
    return unsubscribe;

  }, [navigation]);

  const toggleTaskCompletion = async (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks); 
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
  };

  const renderTask = ({ item }) => (
    <View 
      style={[styles.taskContainer, item.completed && styles.completedTaskContainer]}
    >
      <CheckBox
        checked={item.completed}
        onPress={() => toggleTaskCompletion(item.id)}
        containerStyle={styles.checkbox}
      />

      <Text 
        style={[styles.taskText, item.completed && styles.completedTaskText]}
      >
        <Text style={styles.boldText}>{item.name}</Text>
        {"\n"}
        {item.description}
      </Text>

      <View style={styles.buttons}>
        <View style={styles.buttonContainer}>
          <Button title="Edit" onPress={() => navigation.navigate('AddTask', { task: item })} />
        </View>
        <View style={[styles.buttonContainer, styles.deleteButton]}>
          <Button title="Delete" onPress={() => confirmDelete(item.id)} color='#FF0000' />
        </View>
      </View>
    </View>
  );

  const confirmDelete = (id) => {
    Alert.alert('Delete Task', 'you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => deleteTask(id) },
    ]);
  };

  const deleteTask = async (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id); 
    setTasks(updatedTasks); 
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks)); 
  };

  return (
    <View>
    <TouchableOpacity
        style={styles.addTaskButton}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.addTaskButtonText}>Add Task</Text>
      </TouchableOpacity>
      
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.text}>No tasks available.</Text>
      )}
      
     
      
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
  },
  checkbox: {
    color: 'purple',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#6C3082', 
  },
  buttons: {
    flexDirection: 'row',
  },
  buttonContainer: {
    marginRight: 10,
  },
  deleteButton: {
    marginRight: 0,
  },
  completedTaskContainer: {
    backgroundColor: '#E0B0FF', 
  },
  completedTaskText: {
    color: '#888',
  },
  boldText: {
    fontWeight: 'bold',
  },
  text: {
    fontWeight: 'bold',
    margin: 10,
    fontSize: 25,
  },
  
  addTaskButton: {
    backgroundColor: 'purple', 
    paddingVertical: 12,
    paddingHorizontal: 20, 
    borderRadius: 5, 
    marginLeft:50,
    width:300,
    marginTop: 10, 
    alignItems: 'center', 
  },
  addTaskButtonText: {
    color: '#fff',
    fontSize: 18,  
    textAlign: 'center', 
  },
});

export default HomeTaskList;
