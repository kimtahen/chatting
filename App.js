import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import {YellowBox,Alert, StyleSheet, Text, View, FlatList, Modal, TextInput, TouchableOpacity, BackHandler} from 'react-native';
import uuid from 'uuid-random';
import Firebase from "firebase";
import db from './api/firebase'

YellowBox.ignoreWarnings(['Setting a timer']);

import Header from "./components/Header";
import InputBox from "./components/InputBox";
import TextBubble from "./components/TextBubble";
import {datafetch, dataadd} from "./api/api";


export default function App() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [nameLoading, setNameLoading] = useState(true);
    const [name, setName] = useState(null);

    const flatListRef = useRef();
    const textInputRef = useRef();

    useEffect(() => {
        db.collection('chatting').get()
            .then((snapshot)=>{
                snapshot.forEach(doc => {
                    setItems(doc.data().chats);
                })
            })
        setLoading(false);
        const subscriber = db.collection('chatting')
            .onSnapshot((snapshot)=>{
                snapshot.forEach(doc => {
                    setItems(doc.data().chats);
                })
        })
        return ()=>subscriber();

    }, []);

    useEffect(()=>{
        const backAction = () => {
            Alert.alert(`Do you want to re-enter your name?`, '' ,[
                {
                    text: 'Ok',
                    onPress: ()=>{
                        setName('');
                        setNameLoading(true)
                    },
                },
                {
                    text: 'Cancel',
                    onPress: ()=>null,
                    style: 'cancel',
                }
            ]);
            return true;
        }
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        )
        return () => backHandler.remove();
    },[]);

    const reverse = (arr) => {
        let data = arr;
        return data.reverse()
    }
    const nameOnClickEvent = () => {
        if((name === '') || (name === null) || (name === undefined)){
            Alert.alert(`Enter your name`);
        } else {
            setNameLoading(false);
        }
    }

    const onClickEvent = (text) => () => {
        if (text) {
            let edit = {id: uuid(), name: name, message: text}
            // setItems([edit,...items]);
            const upload = async ()=>{
                await db.collection('chatting').doc('chatting').update({chats: [edit,...items]})}
            upload()
            textInputRef.current.clear();
        }
    }
    return (
        <View style={styles.container}>
            <Modal
                animationType={`slide`}
                visible={nameLoading}
                presentationStyle={`fullScreen`}
                style={styles.modal}
            >
                <View style={styles.modal}>
                    <View style={{alignItems: 'center'}}>
                        <Text style={{padding: 5, fontSize: 100, borderWidth: 1}}>Chatting</Text>
                    </View>
                    <View style={{padding: 20}}>
                        <TextInput style={styles.textInput} onChangeText={setName}/>
                        <View style={{alignItems:'center',paddingTop:20}}>
                            <TouchableOpacity onPress={nameOnClickEvent}><Text style={{padding: 5, fontSize:20, borderWidth: 1}}>Enter</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Header loading={loading} name={name}/>
            <FlatList ref={flatListRef} inverted data={items} extraData={refresh} renderItem={({item}) => {
                return (<TextBubble item={item} myname={name}/>);
            }}/>
            <InputBox textInputRef={textInputRef} onClickEvent={onClickEvent}/>
            <StatusBar style="auto"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
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
