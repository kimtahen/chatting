import React from 'react';
import {StyleSheet, Text, View,} from 'react-native';

export default function Header({loading, name}) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{loading? `Loading...` : `Hello '${name}'!`}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#102d40',
        height: 60,
        padding: 15,
    },
    text: {
        color: 'rgba(255,255,255,1)',
        fontSize: 23,
    }
});
