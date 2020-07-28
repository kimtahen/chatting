import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import {
    YellowBox,
    Alert,
    StyleSheet,
    Text,
    View,
    FlatList,
    Modal,
    TextInput,
    TouchableOpacity,
    BackHandler
} from 'react-native';
import uuid from 'uuid-random';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from "@react-navigation/drawer";

import Home from "./components/Home.js"
import Configure from "./components/Configure";

const Drawer = createDrawerNavigator();

YellowBox.ignoreWarnings(['Setting a timer']);

import db from './api/firebase'
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import TextBubble from "./components/TextBubble";

export default function App() {

    const [name, setName] = useState(null);
    const [nameLoading, setNameLoading] = useState(true);
    const [currentCode, setCurrentCode] = useState([]);


    const nameOnClickEvent = () => {
        if ((name === '') || (name === null) || (name === undefined)) {
            Alert.alert(`Enter your name`);
        } else {
            setNameLoading(false);
        }
    }
    return (
        <View style={{flex: 1}}>
            {nameLoading ? (<View style={styles.modal}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{padding: 5, fontSize: 100, borderWidth: 1}}>Chatting</Text>
                    </View>
                    <View style={{padding: 20}}>
                        <TextInput style={styles.textInput} onChangeText={setName}/>
                        <View style={{alignItems: 'center', paddingTop: 20}}>
                            <TouchableOpacity onPress={nameOnClickEvent}><Text
                                style={{padding: 5, fontSize: 20, borderWidth: 1}}>Enter</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>) :
                (<NavigationContainer>
                    <Drawer.Navigator>
                        <Drawer.Screen name={`Chat 1`} children={({navigation})=><Home name={name} setName={setName} setNameLoading={setNameLoading} navigation={navigation} chatNum={1} />}/>
                        <Drawer.Screen name={`Chat 2`} children={({navigation})=><Home name={name} setName={setName} setNameLoading={setNameLoading} navigation={navigation} chatNum={2} />} />
                        <Drawer.Screen name={`Chat 3`} children={({navigation})=><Home name={name} setName={setName} setNameLoading={setNameLoading} navigation={navigation} chatNum={3} />}/>
                        <Drawer.Screen name={`Chat 4`} children={({navigation})=><Home name={name} setName={setName} setNameLoading={setNameLoading} navigation={navigation} chatNum={4} />}t/>
                        <Drawer.Screen name={`Configure`} component={Configure}/>
                    </Drawer.Navigator>
                </NavigationContainer>)}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
        backgroundColor: '#fff',
    },
    modal: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',

        margin: 0,

    },
    textInput: {
        fontSize: 20,
        borderWidth: 1,
        borderColor: 'black'
    }
});
