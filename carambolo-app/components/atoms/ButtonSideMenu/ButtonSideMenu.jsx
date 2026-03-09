import { Pressable, View, Text } from "react-native"
import styles from "./ButtonSideMenu.styles"
// import { MdOutlineSpaceDashboard } from "react-icons/md";

const ButtonSideMenu = ({ icon, text, selected, setSelected, exit }) => {

    const handleSelect = () => {
        setSelected(text)

    }

    return (
        <Pressable style={exit ? styles(selected, exit).buttonExit : styles(selected, exit).buttonSelected} onPress={handleSelect}>

            <View>

                {/* <MdOutlineSpaceDashboard /> */}

                <Text style={exit ? styles(selected, exit).textExit : styles(selected, exit).textSelected}>
                    {text}
                </Text>
            </View>

        </Pressable>
    )
}

export default ButtonSideMenu