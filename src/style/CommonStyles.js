import { StyleSheet } from "react-native";

export const CommonStyles = StyleSheet.create({

    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 2,
        paddingHorizontal: 8,
        paddingVertical: 6,
        margin: 6,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },

    cardHeader: {
        fontSize: 28,
        fontWeight: 'bold',
    },

    hbox: {
        width: '100%',
        flexDirection: 'row',
    },

    textInput: {
        backgroundColor: 'white',
        padding: 2,
        paddingHorizontal: 8,
        borderRadius: 4,
        margin: 2,
    },

    text: {
        fontSize: 13,
        color: 'black',
    },

    roundImage: {
        borderRadius: 24,
        alignSelf: 'center',
        justifyContent: 'center',
    },

    formBox: {
        flexDirection: 'row',
        marginVertical: 1,
    },

    formTextTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        textAlignVertical: 'center',

        flex: 1,
    },

    formTextDesc: {
        fontSize: 18,
        color: 'black',
        textAlignVertical: 'center',

        flex: 2,
    },

    button: {
        backgroundColor: '#87cefa',
        padding: 12,
        borderRadius: 6,
        margin: 8,
        marginTop: 16,
        alignSelf: 'center',
    },

    buttonText: {
      color: 'white',
    },

    prompt: {
        color: '#9e9e9e',
    },

    negative: {
        color: 'tomato',
    },

    neutral: {
        color: '#87cefa',
    },

    positive: {
        color: 'springgreen',
    },

    center: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});