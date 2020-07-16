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
import Modalk from 'react-native-modal';

const Drawer = createDrawerNavigator();

YellowBox.ignoreWarnings(['Setting a timer']);

import db from './api/firebase'
import Header from "./components/Header";
import InputBox from "./components/InputBox";
import TextBubble from "./components/TextBubble";

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name={`Home`} component={Home}/>
                <Drawer.Screen name={`Configure`} component={Configure}/>
            </Drawer.Navigator>
        </NavigationContainer>
    )
}

function Home({navigation}) {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [nameLoading, setNameLoading] = useState(true);
    const [name, setName] = useState(null);

    const flatListRef = useRef();
    const textInputRef = useRef();

    useEffect(() => {
        db.collection('chatting').get()
            .then((snapshot) => {
                snapshot.forEach(doc => {
                    setItems(doc.data().chats);
                })
            })
        setLoading(false);
        const subscriber = db.collection('chatting')
            .onSnapshot((snapshot) => {
                snapshot.forEach(doc => {
                    setItems(doc.data().chats);
                })
            })
        return () => subscriber();

    }, []);

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
    const nameOnClickEvent = () => {
        if ((name === '') || (name === null) || (name === undefined)) {
            Alert.alert(`Enter your name`);
        } else {
            setNameLoading(false);
        }
    }

    const onClickEvent = (text) => () => {
        if (text) {
            let edit = {id: uuid(), name: name, message: text}
            // setItems([edit,...items]);
            const upload = async () => {
                await db.collection('chatting').doc('chatting').update({chats: [edit, ...items]})
            }
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
                        <View style={{alignItems: 'center', paddingTop: 20}}>
                            <TouchableOpacity onPress={nameOnClickEvent}><Text
                                style={{padding: 5, fontSize: 20, borderWidth: 1}}>Enter</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Header loading={loading} name={name} navigation={navigation}/>
            <FlatList ref={flatListRef} inverted data={items} extraData={refresh} renderItem={({item}) => {
                return (<TextBubble item={item} myname={name}/>);
            }}/>
            <InputBox textInputRef={textInputRef} onClickEvent={onClickEvent}/>
            <StatusBar style="auto"/>
        </View>
    );
}

function Configure({navigation}) {
    const [temp, setTemp] = useState(0);
    const [currentPassword, setCurrentPassword] = useState(null);
    const [passwordInput, setPasswordInput] = useState(null);
    const [isClosed, setIsClosed] = useState(true);
    const [show, setShow] = useState(false);
    useEffect(() => {
        db.collection('chatting').get()
            .then((snapshot) => {
                snapshot.forEach(doc => {
                    setCurrentPassword(doc.data().password);
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


    const changePassword = password => () => {
        if (password === 0) {
            Alert.alert('Input new password');
        } else {
            const upload = async () => {
                await db.collection('chatting').doc('chatting').update({password: password});
            }
            upload()
                .then(() => {
                    Alert.alert('password change successed');
                    setTemp(0);
                })
                .catch(() => {
                    Alert.alert('password change failed');
                    setTemp(0);
                });

        }
    }
    const clearChats = () => {
        const update = async () => {
            await db.collection('chatting').doc('chatting').update({chats: []});
        }
        update()
            .then(() => {
                Alert.alert('chats clear successed');
            })
            .catch(() => {
                Alert.alert('chats clear failed');
            });
    }
    const authentication = () => {setIsClosed(true)}
    return (
        <View style={styles.container}>
            <Modalk
                isVisible={isClosed}
            >
                <View style={{backgroundColor: 'white', justifyContent: 'center', paddingVertical: 20,}}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 40}}>Enter a password</Text>
                    </View>
                    <TextInput onChangeText={setPasswordInput} style={{margin: 10, ...styles.textInput}}/>
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={checkPassword(passwordInput)}
                                          style={{flex:1, alignItems: 'center', borderWidth: 1, margin: 10, padding: 20}}>
                            <Text style={{fontSize: 20,}}>
                                Enter
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modalk>
            <Header loading={null} name={null} navigation={navigation}/>

            {show ? (<View style={{flex: 1,}}>

                <View style={{flex: 1, justifyContent: 'center',}}>
                    <TextInput onChangeText={setTemp} style={{borderWidth: 1, fontSize: 20, margin: 10}}/>
                    <TouchableOpacity onPress={changePassword(temp)}
                                      style={{alignItems: 'center', borderWidth: 1, margin: 10, padding: 20}}>
                        <Text style={{fontSize: 20,}}>
                            Change!
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{flex: 1, justifyContent: 'center',}}>
                    <TouchableOpacity onPress={clearChats}
                                      style={{alignItems: 'center', borderWidth: 1, margin: 10, padding: 20}}>
                        <Text style={{fontSize: 20,}}>
                            Chats Clear!
                        </Text>
                    </TouchableOpacity>
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
