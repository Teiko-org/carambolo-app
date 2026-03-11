import { Pressable, View, Text, Image } from "react-native"
import styles from "./SideMenu.styles"
import ButtonSideMenuItem from "../../atoms/ButtonSideMenuItem/ButtonSideMenuItem"
import { useState } from "react"
import ButtonSideMenu from "../../atoms/ButtonSideMenu/ButtonSideMenu"

const SideMenu = (onClose) => {

    const [selected, setSelected] = useState("Dashboard")

    return (

        <View style={styles.sideMenuContainer}>
            <View style={styles.container}>

                <View style={{ gap: 30 }}>
                    <Image source={require("../../../assets/LogoComFundoDash.png")} style={{ width: "100%", height: 100 }} />

                    <View>
                        <ButtonSideMenuItem text="Dashboard" setSelected={setSelected} selected={(selected == "Dashboard")} />
                        <ButtonSideMenuItem text="Pedidos" setSelected={setSelected} selected={(selected == "Pedidos")} />
                        <ButtonSideMenuItem text="Produtos" setSelected={setSelected} selected={(selected == "Produtos")} />
                        <ButtonSideMenuItem text="Produção" setSelected={setSelected} selected={(selected == "Produção")} />
                    </View>

                </View>

                <ButtonSideMenuItem text="Sair" setSelected={setSelected} exit={true} />

            </View>

            <ButtonSideMenu onClick={onClose} />

        </View>
    )
}

export default SideMenu