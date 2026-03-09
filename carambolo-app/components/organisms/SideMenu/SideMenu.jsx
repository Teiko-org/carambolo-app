import { Pressable, View, Text, Image } from "react-native"
import styles from "./SideMenu.styles"
import ButtonSideMenu from "../../atoms/ButtonSideMenu/ButtonSideMenu"
import { useState } from "react"

const SideMenu = () => {

    const [selected, setSelected] = useState("Dashboard")

    return (
        <View style={styles.container}>

            <View>
                <Image source={require("../../../assets/LogoComFundoDash.png")} style={{ width: "100%", height: 100 }} />

                <ButtonSideMenu text="Dashboard" setSelected={setSelected} selected={(selected == "Dashboard")} />
                <ButtonSideMenu text="Pedidos" setSelected={setSelected} selected={(selected == "Pedidos")} />
                <ButtonSideMenu text="Produtos" setSelected={setSelected} selected={(selected == "Produtos")} />
                <ButtonSideMenu text="Produção" setSelected={setSelected} selected={(selected == "Produção")} />

            </View>

            <ButtonSideMenu text="Sair" exit={true} />

        </View>
    )
}

export default SideMenu