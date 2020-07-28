import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {SimpleLineIcons} from '@expo/vector-icons';

export default function Header({loading, name, chatNum, navigation}) {
    return (
        <View style={styles.container}>
            {name ? (<TouchableOpacity style={{position: 'absolute', left: 20,}} onPress={navigation.toggleDrawer}>
                <Text style={{
                    fontSize: 20,
                    color: 'rgba(255,255,255,1)'
                }}>Chat {chatNum}</Text>
            </TouchableOpacity>) : null}
            {name ?
                <Text style={styles.text}>{loading ? `Loading...` : `Hello '${name}'!`}</Text> :
                <Text style={styles.text}>Configure</Text>
            }
            <TouchableOpacity style={{position: 'absolute', right: 20,}} onPress={navigation.toggleDrawer}>
                <SimpleLineIcons name={`drawer`} style={styles.icon}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#102d40',
        height: 60,
        padding: 15,
    },
    text: {
        color: 'rgba(255,255,255,1)',
        fontSize: 23,
    },
    icon: {
        color: 'rgba(255,255,255,1)',
        fontSize: 20,
    }
});
