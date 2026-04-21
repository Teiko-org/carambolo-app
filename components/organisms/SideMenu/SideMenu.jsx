import PropTypes from "prop-types"
import { Pressable, View, Image } from "react-native"
import styles from "./SideMenu.styles"
import ButtonSideMenuItem from "../../atoms/ButtonSideMenuItem/ButtonSideMenuItem"
import ButtonSideMenu from "../../atoms/ButtonSideMenu/ButtonSideMenu"
import logoDash from "../../../assets/LogoComFundoDash.png"

const SideMenu = ({ onClose, selected, setSelected }) => {
    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.6)",
                flexDirection: "row",
            }}
        >
            <Pressable
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
                onPress={onClose}
            />

            <View style={styles.container}>
                <View style={{ gap: 30 }}>
                    <Image
                        source={logoDash}
                        style={{ width: "100%", height: 100 }}
                    />

                    <View>
                        <ButtonSideMenuItem
                            text="Dashboard"
                            setSelected={setSelected}
                            selected={selected == "Dashboard"}
                            route="Dashboard"
                        />
                        <ButtonSideMenuItem
                            text="Pedidos"
                            setSelected={setSelected}
                            selected={selected == "Pedidos"}
                            route="OrderKanban"
                        />
                        <ButtonSideMenuItem
                            text="Produtos"
                            setSelected={setSelected}
                            selected={selected == "Produtos"}
                            route="#"
                        />
                        <ButtonSideMenuItem
                            text="Produção"
                            setSelected={setSelected}
                            selected={selected == "Produção"}
                            route="#"
                        />
                        <ButtonSideMenuItem
                            text="Assistente"
                            setSelected={setSelected}
                            selected={selected == "Assistente"}
                            route="Assistant"
                        />
                    </View>
                </View>

                <ButtonSideMenuItem
                    text="Sair"
                    setSelected={setSelected}
                    exit={true}
                />
            </View>

            <View
                style={{
                    position: "absolute",
                    alignSelf: "center",
                    left: 90,
                    right: 0,
                    alignItems: "center",
                    zIndex: 10,
                }}
            >
                <ButtonSideMenu onPress={onClose} />
            </View>
        </View>
    )
}

SideMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    selected: PropTypes.string,
    setSelected: PropTypes.func.isRequired,
}

export default SideMenu
