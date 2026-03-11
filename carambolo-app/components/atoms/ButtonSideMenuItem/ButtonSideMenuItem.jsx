import { Pressable, View, Text } from "react-native"
import styles from "./ButtonSideMenuItem.styles"
import { Link } from "expo-router"
// import { MdOutlineSpaceDashboard } from "react-icons/md";

const ButtonSideMenuItem = ({ icon, text, selected, setSelected, exit, route }) => {

    const handleSelect = () => {
        setSelected(text)

    }

    return (
        <Link style={exit ? styles(selected, exit).buttonExit : styles(selected, exit).buttonSelected} onPress={handleSelect}
        href={`/${route}`}>

                {/* <MdOutlineSpaceDashboard /> */}

                <Text style={exit ? styles(selected, exit).textExit : styles(selected, exit).textSelected}>
                    {text}
                </Text>

        </Link>
    )
}

export default ButtonSideMenuItem