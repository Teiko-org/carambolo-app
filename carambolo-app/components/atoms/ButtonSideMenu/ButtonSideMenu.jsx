import { Pressable, Text, View } from "react-native"
import styles from "./ButtonSideMenu.styles"
import { useState } from "react"
import SideMenu from "../../organisms/SideMenu/SideMenu"

const ButtonSideMenu = (onClick) => {

    const openSideMenu = () => setIsSideMenuOpen(true);
    const closeSideMenu = () => setIsSideMenuOpen(false);

    return (

        <View>

            <Pressable style={styles.sideMenuButton} onPress={onClick}>
                <Text style={styles.sideMenuButtonText}>|||</Text>
            </Pressable>

        </View>

    )
}

export default ButtonSideMenu