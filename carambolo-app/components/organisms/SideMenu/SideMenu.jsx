import { Pressable, View, Text, Image } from "react-native"
import styles from "./SideMenu.styles"
import ButtonSideMenuItem from "../../atoms/ButtonSideMenuItem/ButtonSideMenuItem"
import { useState } from "react"
import ButtonSideMenu from "../../atoms/ButtonSideMenu/ButtonSideMenu"

const SideMenu = ({onClose}) => {

    const [selected, setSelected] = useState("Dashboard")

    return (

        <View style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            flexDirection: "row"
        }}>

            <Pressable
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%"
                }}
                onPress={onClose}
            />

            <View style={styles.container}>

                <View style={{ gap: 30 }}>
                    <Image source={require("../../../assets/LogoComFundoDash.png")} style={{ width: "100%", height: 100 }} />

                    <View>
                        <ButtonSideMenuItem text="Dashboard" setSelected={setSelected} selected={(selected == "Dashboard")} route="Dashboard" />
                        <ButtonSideMenuItem text="Pedidos" setSelected={setSelected} selected={(selected == "Pedidos")} route="OrderKanban" />
                        <ButtonSideMenuItem text="Produtos" setSelected={setSelected} selected={(selected == "Produtos")} route="#" />
                        <ButtonSideMenuItem text="Produção" setSelected={setSelected} selected={(selected == "Produção")} route="#" />
                    </View>

                </View>

                <ButtonSideMenuItem text="Sair" setSelected={setSelected} exit={true} />

            </View>

            <View
                style={{
                    position: "absolute",
                    alignSelf: "center",
                    left: 90,
                    right: 0,
                    alignItems: "center",
                    zIndex: 10
                }}
            >
                <ButtonSideMenu onPress={onClose} />
            </View>

        </View>
    )
}

export default SideMenu