import React from 'react';
import {StyleSheet, Text, View,} from 'react-native';

export default function TextBubble({item, myname}) {
    if (item.name !== myname) {
        return (
            <View style={{...styles.container, justifyContent: 'flex-start'}}>
                <Text numberOfLines={1} style={styles.text}>{item.name}</Text>
                <Text style={{...styles.text, borderWidth: 1,}}>{item.message}</Text>
            </View>
        )
    } else {
        return (
            <View style={{...styles.container, justifyContent: 'flex-end'}}>
                <Text style={{...styles.text, borderWidth: 1,}}>{item.message}</Text>
                <Text numberOfLines={1} style={styles.text}>{item.name}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingBottom: 5,
        paddingRight: 5,
    },
    text: {
        paddingHorizontal: 10,
        fontSize: 20,
        maxWidth: 200,
    }
});
