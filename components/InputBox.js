import React, {useState} from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';

export default function InputBox({textInputRef, onClickEvent}) {
    const [text, setText] = useState('');
    const onPressEvent = ()=>{onClickEvent(text)();setText('')}
    return (
        <View style={styles.container}>
            <View style={{flex: 6, ...styles.item}}>
                <TextInput ref={textInputRef} onChangeText={setText} style={styles.input}/>
            </View>
            <View style={{...styles.item}}>
                <TouchableOpacity style={{height: 60, justifyContent:'center'}} onPress={()=>{onPressEvent()}}>
                    <Text style={{color: 'white', fontSize: 20,}}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        paddingHorizontal: 20,
        backgroundColor: '#102d40',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    item :{
        justifyContent: 'center',
        padding: 10,
    },
    input: {
        borderColor: 'rgba(0,0,0,0)',
        borderBottomColor: 'white',
        borderWidth: 1,
        color: 'white',
        fontSize: 20,
    }
});