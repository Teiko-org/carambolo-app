import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        borderWidth: 2,
        borderColor: "#A47032",
        borderStyle: "solid",
        borderRadius: 12,
        overflow: 'hidden'
    },
    headerContainer: {
        backgroundColor: "#103464",
        padding: 15
    },
    headerTitle: {
        color: "#A47032",
        fontSize: 20,
        fontWeight: 'bold'
    },
    filtersContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20
    }
})

export default styles