import React, {useState, useEffect, useRef} from 'react';
import db from "../api/firebase";
import {Alert, BackHandler, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import uuid from "uuid-random";
import Header from "./Header";
import TextBubble from "./TextBubble";
import InputBox from "./InputBox";
import {StatusBar} from "expo-status-bar";
import Modal from "react-native-modal";

export default function Home({navigation, name, setName, setNameLoading, chatNum}) {
    const chatbaseNum = `chat${chatNum}`;
    const [code,setCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [isClosed, setIsClosed] = useState(true);
    const [passwordInput, setPasswordInput] = useState(null);
    const [show, setShow] = useState(false);

    const flatListRef = useRef();
    const textInputRef = useRef();

    //DB connection
    useEffect(() => {
        db.collection('chatting').get()
            .then((snapshot) => {
                snapshot.forEach(doc => {
                    setCode(doc.data().chatpw[chatNum-1]);
                    setItems(doc.data()[chatbaseNum]);
                })
            })
        setLoading(false);
        const subscriber = db.collection('chatting')
            .onSnapshot((snapshot) => {
                snapshot.forEach(doc => {
                    setCode(doc.data().chatpw[chatNum-1]);
                    setItems(doc.data()[chatbaseNum]);
                })
            })
        return () => subscriber();

    }, []);

    //Back Action
    useEffect(() => {
        const backAction = () => {
            Alert.alert(`Do you want to re-enter your name?`, '', [
                {
                    text: 'Ok',
                    onPress: () => {
                        setName('');
                        setNameLoading(true)
                    },
                },
                {
                    text: 'Cancel',
                    onPress: () => null,
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
    }, []);

    const reverse = (arr) => {
        let data = arr;
        return data.reverse()
    }

    const onClickEvent = (text) => () => {
        if (text) {
            let edit = {id: uuid(), name: name, message: text}
            // setItems([edit,...items]);
            const upload = async () => {
                await db.collection('chatting').doc('chatting').update({[chatbaseNum]: [edit, ...items]})
            }
            upload()
            textInputRef.current.clear();
        }
    }

    const checkPassword = password => () => {
        if (password === code) {
            setShow(true);
            setIsClosed(false);

        } else {
            Alert.alert('Your password is wrong');
            setIsClosed(false);
        }
    }

    const recode = () => {
        setIsClosed(true);
    }

    return (
        <View style={styles.container}>
            <Modal
                isVisible={isClosed}
            >
                <View style={{backgroundColor: 'white', justifyContent: 'center', paddingVertical: 20,}}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 40}}>Enter code</Text>
                    </View>
                    <TextInput onChangeText={setPasswordInput} style={{margin: 10, ...styles.textInput}}/>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={checkPassword(passwordInput)}
                                          style={{
                                              flex: 1,
                                              alignItems: 'center',
                                              borderWidth: 1,
                                              margin: 10,
                                              padding: 20
                                          }}>
                            <Text style={{fontSize: 20,}}>
                                Enter
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={{flex: 1, justifyContent: 'space-between'}}>
                <Header loading={loading} name={name} chatNum={chatNum} navigation={navigation}/>
                {show ? (
                    <View>
                        <FlatList ref={flatListRef} inverted data={items} extraData={refresh} renderItem={({item}) => {
                            return (<TextBubble item={item} myname={name}/>);
                        }}/>
                        <InputBox textInputRef={textInputRef} onClickEvent={onClickEvent}/>
                    </View>
                ) : (
                    <View style={{flex: 1, justifyContent: 'center',}}>
                        <TouchableOpacity onPress={recode}
                                          style={{alignItems: 'center', borderWidth: 1, margin: 10, padding: 20}}>
                            <Text style={{fontSize: 20,}}>
                                Code
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

            </View>
            <StatusBar style="auto"/>
        </View>
    );
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