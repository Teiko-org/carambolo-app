import PropTypes from "prop-types";
import {
    Pressable,
    View,
    Image,
    Text,
    Animated,
    Dimensions,
    Platform,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./SideMenu.styles";
import ButtonSideMenuItem from "../../atoms/ButtonSideMenuItem/ButtonSideMenuItem";
import ButtonSideMenu from "../../atoms/ButtonSideMenu/ButtonSideMenu";
import iconUser from "../../../assets/iconUser.png";
import iconAssistent from "../../../assets/iconAssistent.png";

const { width: screenWidth } = Dimensions.get("window");
const PANEL_WIDTH = screenWidth * 0.72;
const useNativeDriver = Platform.OS !== "web";

const getNavItems = (t) => [
    { text: t("sideMenu.nav.home"), route: "/", selectedKey: "Home" },
    { text: t("sideMenu.nav.orders"), route: "/OrderKanban", selectedKey: "Pedidos" },
    { text: t("sideMenu.nav.products"), route: "/Products", selectedKey: "Produtos" },
    { text: t("sideMenu.nav.dashboard"), route: "/Dashboard", selectedKey: "Dashboard" },
    {
        text: t("sideMenu.nav.importHistory"),
        route: "/ImportarDados",
        selectedKey: "Importar histórico de pedidos",
    },
];

const SideMenu = ({ onClose, selected, setSelected }) => {
    const slideX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const [isClosing, setIsClosing] = useState(false);
    const { t } = useTranslation();
    const NAV_ITEMS = getNavItems(t);

    useEffect(() => {
        setIsClosing(false);
        Animated.parallel([
            Animated.timing(slideX, {
                toValue: 0,
                duration: 220,
                useNativeDriver,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver,
            }),
        ]).start();
    }, [slideX]);

    const handleClose = () => {
        if (isClosing) return;

        setIsClosing(true);
        Animated.parallel([
            Animated.timing(slideX, {
                toValue: -PANEL_WIDTH,
                duration: 320,
                useNativeDriver,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 320,
                useNativeDriver,
            }),
        ]).start(() => {
            onClose();
        });
    };

    return (
        <View style={styles.backdrop}>
            <Animated.View
                style={[styles.backdropOverlay, { opacity: backdropOpacity }]}
            >
                <Pressable style={styles.backdropPressable} onPress={handleClose} />
            </Animated.View>

            <Animated.View
                style={[
                    styles.panelWrap,
                    { transform: [{ translateX: slideX }] },
                ]}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.greetingRow}>
                            <Image source={iconUser} style={styles.userIcon} resizeMode="contain" />
                            <Text style={styles.greetingText}>{t("sideMenu.greeting")}</Text>
                        </View>

                        <View style={styles.menuList}>
                            {NAV_ITEMS.map((item) => (
                                <ButtonSideMenuItem
                                    key={item.text}
                                    text={item.text}
                                    setSelected={setSelected}
                                    selected={selected == item.selectedKey}
                                    route={item.route}
                                    compact={item.compact}
                                    onAfterPress={handleClose}
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.assistantBlock}>
                        {/* Texto ocupa largura total */}
                        <Text style={styles.assistantDescription}>
                            {t("sideMenu.assistantDescription")}
                        </Text>

                        {/* Botão + ícone lado a lado */}
                        <View style={styles.assistantRow}>
                            <View style={styles.assistantButtonWrap}>
                                <ButtonSideMenuItem
                                    text={t("sideMenu.assistantCta")}
                                    setSelected={setSelected}
                                    selected={selected == "Assistente"}
                                    route="/Assistant"
                                    isAssistantCta
                                    onAfterPress={handleClose}
                                />
                            </View>

                            <Image
                                source={iconAssistent}
                                style={styles.assistantIcon}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.closeButtonWrap}>
                    <ButtonSideMenu onPress={handleClose} />
                </View>
            </Animated.View>
        </View>
    );
};

SideMenu.propTypes = {
    onClose: PropTypes.func.isRequired,
    selected: PropTypes.string,
    setSelected: PropTypes.func.isRequired,
};

export default SideMenu;