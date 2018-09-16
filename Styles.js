import { StyleSheet, } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ticker: {
        width: '100%',
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
    },
    narrowSettings: {
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
        alignContent: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    tickerText: {
        fontSize: 22,
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
    button: {
        marginTop: 10,
        fontSize: 22,
    }
});

const dayTheme = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    text: {
        color: 'black',
    },
    ticker: {
        borderColor: 'grey',
    },
    narrowSettings: {
        borderColor: 'grey',
    },
});

const nightTheme = StyleSheet.create({
    container: {
        backgroundColor: 'black',
    },
    text: {
        color: 'white',
    },
    ticker: {
        borderColor: 'grey',
    },
    narrowSettings: {
        borderColor: 'grey',
    },
});

export let theme = dayTheme;
