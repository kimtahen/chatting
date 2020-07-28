import React, {useState, useEffect, useRef} from 'react';
import db from "../api/firebase";
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import Header from "./Header";

export default function Configure({navigation}) {
    const [temp1, setTemp1] = useState("");
    const [temp2, setTemp2] = useState("");
    const [temp3, setTemp3] = useState("");
    const [temp4, setTemp4] = useState("");
    const [currentChatPassword, setCurrentChatPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState(null);
    const [passwordInput, setPasswordInput] = useState(null);
    const [isClosed, setIsClosed] = useState(true);
    const [show, setShow] = useState(false);

    const textInputRef1 = useRef();
    const textInputRef2 = useRef();
    const textInputRef3 = useRef();
    const textInputRef4 = useRef();

    useEffect(() => {
        db.collection('chatting').get()
            .then((snapshot) => {
                snapshot.forEach(doc => {
                    setCurrentPassword(doc.data().configpw);
                    setCurrentChatPassword(doc.data().chatpw);
                })
            })

    }, [])

    const checkPassword = password => () => {
        if (password === currentPassword) {
            setShow(true);
            setIsClosed(false);

        } else {
            Alert.alert('Your password is wrong');
            setIsClosed(false);
        }
    }
    const changeChatPassword = (chatNum) => password => () => {
        if (password === "" || password === null || password === undefined) {
            Alert.alert('Input new password');
        } else {
            let edited = currentChatPassword.slice();
            edited[chatNum - 1] = password;
            const upload = async () => {
                await db.collection('chatting').doc('chatting').update({chatpw: edited});
            }
            upload()
                .then(() => {
                    setCurrentChatPassword(edited);
                    Alert.alert('password change successed');
                    setTemp1("");
                    setTemp2("");
                    setTemp3("");
                    setTemp4("");
                    textInputRef1.current.clear();
                    textInputRef2.current.clear();
                    textInputRef3.current.clear();
                    textInputRef4.current.clear();
                })
                .catch(() => {
                    Alert.alert('password change failed');
                    setTemp1("");
                    setTemp2("");
                    setTemp3("");
                    setTemp4("");
                    textInputRef1.current.clear();
                    textInputRef2.current.clear();
                    textInputRef3.current.clear();
                    textInputRef4.current.clear();
                });

        }
    }

    const clearChats = (chatNum) => () => {
        const update = async () => {
            await db.collection('chatting').doc('chatting').update({[`chat${chatNum}`]: []});
        }
        update()
            .then(() => {
                Alert.alert('chats clear successed');
            })
            .catch(() => {
                Alert.alert('chats clear failed');
            });
    }

    const authentication = () => {
        setIsClosed(true)
    }
    return (
        <View style={styles.container}>
            <Modal
                isVisible={isClosed}
            >
                <View style={{backgroundColor: 'white', justifyContent: 'center', paddingVertical: 20,}}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 40}}>#</Text>
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
            <Header loading={null} name={null} navigation={navigation}/>

            {show ? (
                <View style={{flex: 1,}}>
                    <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{fontSize:40, color: '#102d40'}}>Change password</Text>
                        <ChangePwInput chatNum={1} temp={temp1} setTemp={setTemp1}
                                       changeChatPassword={changeChatPassword(1)} textInputRef={textInputRef1}
                                       currentChatPassword={currentChatPassword}/>
                        <ChangePwInput chatNum={2} temp={temp2} setTemp={setTemp2}
                                       changeChatPassword={changeChatPassword(2)} textInputRef={textInputRef2}
                                       currentChatPassword={currentChatPassword}/>
                        <ChangePwInput chatNum={3} temp={temp3} setTemp={setTemp3}
                                       changeChatPassword={changeChatPassword(3)} textInputRef={textInputRef3}
                                       currentChatPassword={currentChatPassword}/>
                        <ChangePwInput chatNum={4} temp={temp4} setTemp={setTemp4}
                                       changeChatPassword={changeChatPassword(4)} textInputRef={textInputRef4}
                                       currentChatPassword={currentChatPassword}/>

                    </View>

                    <View style={{flex: 1, justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{fontSize:40, color: '#102d40'}}>Chats clear</Text>
                        <ChatClear chatNum={1} clearChats={clearChats(1)}/>
                        <ChatClear chatNum={2} clearChats={clearChats(2)}/>
                        <ChatClear chatNum={3} clearChats={clearChats(3)}/>
                        <ChatClear chatNum={4} clearChats={clearChats(4)}/>

                    </View>
                </View>) : (
                <View style={{flex: 1,}}>
                    <View style={{flex: 1, justifyContent: 'center',}}>
                        <TouchableOpacity onPress={authentication}
                                          style={{alignItems: 'center', borderWidth: 1, margin: 10, padding: 20}}>
                            <Text style={{fontSize: 20,}}>
                                Authentication
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

        </View>
    )
}

function ChangePwInput({chatNum, temp, setTemp, changeChatPassword, textInputRef, currentChatPassword}) {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{fontSize: 20,}}>Chat {chatNum}:</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{fontSize: 20,}}>{currentChatPassword[chatNum - 1]}</Text>
            </View>

            <View style={{flex: 1,}}>
                <TextInput ref={textInputRef} style={styles.textInput} onChangeText={setTemp}/>
            </View>
            <View style={{flex: 1,}}>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={changeChatPassword(temp)}>
                    <Text style={{fontSize: 20}}>
                        Change
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function ChatClear({chatNum, clearChats}){
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', marginVertical: 5}}>
            <View style={{flex: 1,paddingHorizontal: 100, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={{fontSize: 20,}}>Chat {chatNum}:</Text>
                <TouchableOpacity style={{alignItems: 'center'}} onPress={clearChats}>
                    <Text style={{fontSize: 20}}>
                        Clear
                    </Text>
                </TouchableOpacity>
            </View>
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

        backgroundColor: '#fff',
        justifyContent: 'center',
        margin: 0,

    },
    textInput: {
        fontSize: 20,
        borderWidth: 1,
        paddingHorizontal: 5
    }
});
