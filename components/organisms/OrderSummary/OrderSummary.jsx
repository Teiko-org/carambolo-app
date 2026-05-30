import PropTypes from "prop-types"
import { Pressable, ScrollView, Text, View, Animated, PanResponder, Image, ActivityIndicator } from "react-native"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react"
import styles from "./OrderSummary.styles"

const SHEET_DISMISS_DRAG_Y = 100;
const SHEET_DISMISS_VELOCITY_Y = 0.45;

const formatDate = (dateString) => {
    if (!dateString) return "";
    const raw = String(dateString).split("T")[0];
    const [year, month, day] = raw.split("-");
    if (!year || !month || !day) return String(dateString);
    return `${day}/${month}/${year}`;
};

const formatToken = (value) => {
    if (!value) return "";
    return String(value)
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatTamanho = (tamanho) => {
    if (!tamanho) return "";
    const match = String(tamanho).match(/(\d+)/);
    return match ? `${match[1]} cm` : formatToken(tamanho);
};

const formatFormato = (formato) => formatToken(formato);

const formatRecheio = (recheio) => {
    if (!recheio) return "—";
    const s1 = formatToken(recheio.sabor1);
    const s2 = formatToken(recheio.sabor2);
    if (s1 && s2) return `${s1} e ${s2}`;
    return s1 || s2 || "—";
};

const uniqueBy = (items, getKey) => {
    if (!Array.isArray(items)) return [];
    const seen = new Set();
    return items.filter((item) => {
        const key = getKey(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

const formatTipoEntrega = (tipo) => {
    if (tipo === "ENTREGA") return "Entrega";
    if (tipo === "RETIRADA") return "Retirada";
    return "—";
};

const OrderSummary = ({
    onClose,
    order,
    isLoading = false,
    loadError = null,
    enableGestureCloseTargets = false,
    onGestureScrollReady,
}) => {
    const isFornada = order?.tipoProduto === "FORNADA";
    const displayId = order?.resumoPedidoId ?? order?.id;
    const headerSubtitle = isLoading
        ? "Carregando detalhes…"
        : loadError
            ? "Não foi possível carregar"
            : isFornada
                ? `Fornada — ${order?.fornadaDetalhe?.produtoFornada ?? "Produto"}`
                : order?.bolo?.decoracao?.nome
                    ? `Decoração ${order.bolo.decoracao.nome}`
                    : "Pedido de bolo personalizado";

    const backdropCloseProps = enableGestureCloseTargets
        ? { dataSet: { modalCloseTrigger: "true" } }
        : {};
    const handleCloseProps = enableGestureCloseTargets
        ? { dataSet: { modalCloseTrigger: "true" } }
        : {};
    const sheetSurfaceProps = enableGestureCloseTargets
        ? { dataSet: { modalSheet: "true" } }
        : {};
    const scrollSurfaceProps = enableGestureCloseTargets
        ? { dataSet: { modalScroll: "true" } }
        : {};

    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const slideY = useRef(new Animated.Value(600)).current;
    const dragY = useRef(new Animated.Value(0)).current;
    const scrollRef = useRef(null);
    const scrollOffsetRef = useRef(0);
    const isClosingRef = useRef(false);

    const sheetTranslateY = useMemo(
        () => Animated.add(slideY, dragY),
        [slideY, dragY]
    );

    const animateClose = useCallback((onDone) => {
        if (isClosingRef.current) return;
        isClosingRef.current = true;
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(dragY, {
                toValue: 520,
                duration: 240,
                useNativeDriver: true,
            }),
        ]).start(({ finished }) => {
            if (finished) onDone?.();
        });
    }, [backdropOpacity, dragY]);

    const handleClose = useCallback(() => {
        animateClose(() => onClose());
    }, [animateClose, onClose]);

    useEffect(() => {
        isClosingRef.current = false;
        dragY.setValue(0);
        slideY.setValue(600);
        backdropOpacity.setValue(0);
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 220,
                useNativeDriver: true,
            }),
            Animated.timing(slideY, {
                toValue: 0,
                duration: 320,
                useNativeDriver: true,
            }),
        ]).start();
    }, [backdropOpacity, slideY, dragY, displayId, isLoading]);

    const sheetPanResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gesture) =>
                    gesture.dy > 6 && gesture.dy > Math.abs(gesture.dx),
                onPanResponderMove: (_, gesture) => {
                    if (gesture.dy > 0) {
                        dragY.setValue(gesture.dy);
                    }
                },
                onPanResponderRelease: (_, gesture) => {
                    const shouldDismiss =
                        gesture.dy > SHEET_DISMISS_DRAG_Y ||
                        gesture.vy > SHEET_DISMISS_VELOCITY_Y;
                    if (shouldDismiss) {
                        handleClose();
                        return;
                    }
                    Animated.spring(dragY, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 20,
                    }).start();
                },
                onPanResponderTerminate: () => {
                    Animated.spring(dragY, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 0,
                        speed: 20,
                    }).start();
                },
            }),
        [dragY, handleClose]
    );

    useLayoutEffect(() => {
        if (!enableGestureCloseTargets || !onGestureScrollReady) return;

        const resolveScrollElement = () => {
            if (typeof document !== "undefined") {
                const byData = document.querySelector('[data-modal-scroll="true"]');
                if (byData) return byData;
            }
            const scrollable = scrollRef.current?.getScrollableNode?.();
            if (scrollable) return scrollable;
            return scrollRef.current;
        };

        const scrollBy = (deltaY) => {
            if (!deltaY) return;
            const el = resolveScrollElement();
            const current =
                (el && typeof el.scrollTop === "number" ? el.scrollTop : null) ??
                scrollOffsetRef.current;
            const scrollHeight = el?.scrollHeight ?? 0;
            const clientHeight = el?.clientHeight ?? 0;
            const maxScroll = Math.max(0, scrollHeight - clientHeight);
            const next = Math.min(maxScroll, Math.max(0, current + deltaY));

            if (el && typeof el.scrollTop === "number") {
                el.scrollTop = next;
            }
            scrollRef.current?.scrollTo?.({ y: next, animated: false });
            scrollOffsetRef.current = next;
        };

        onGestureScrollReady({
            scrollBy,
            reset: () => {
                scrollOffsetRef.current = 0;
                const el = resolveScrollElement();
                if (el && typeof el.scrollTop === "number") {
                    el.scrollTop = 0;
                }
                scrollRef.current?.scrollTo?.({ y: 0, animated: false });
            },
        });
    }, [enableGestureCloseTargets, onGestureScrollReady, order?.id]);

    return (
        <View style={{ flex: 1, justifyContent: "flex-end" }}>

            {enableGestureCloseTargets ? (
                <Pressable
                    onPress={handleClose}
                    style={styles.gestureCloseRail}
                    accessibilityRole="button"
                    accessibilityLabel="Fechar com gesto"
                    dataSet={{ modalCloseTrigger: "true" }}
                >
                    <Text style={styles.gestureCloseRailText}>
                        Aponte aqui ~0,5s ou toque para fechar
                    </Text>
                </Pressable>
            ) : null}

            <Animated.View
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    opacity: backdropOpacity,
                }}
            >
                <Pressable
                    style={{ width: "100%", height: "100%" }}
                    onPress={handleClose}
                    {...backdropCloseProps}
                />
            </Animated.View>

            <Animated.View
                style={{
                    transform: [{ translateY: sheetTranslateY }],
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    height: "82%",
                    maxHeight: "82%",
                }}
            >
                <View style={styles.sheetSurface} {...sheetSurfaceProps}>

                    <View style={styles.header} {...sheetPanResponder.panHandlers}>

                        <Pressable
                            onPress={handleClose}
                            style={[
                                styles.closeHandle,
                                enableGestureCloseTargets && styles.closeHandleGesture,
                            ]}
                            accessibilityRole="button"
                            accessibilityLabel="Fechar detalhes"
                            {...handleCloseProps}
                        />

                        <Pressable
                            onPress={handleClose}
                            style={styles.closeBtn}
                            accessibilityRole="button"
                            accessibilityLabel="Fechar"
                            {...handleCloseProps}
                        >
                            <Text style={styles.closeBtnText}>Fechar</Text>
                        </Pressable>

                        <Text style={styles.gestureSheetHint}>
                            {enableGestureCloseTargets
                                ? "Arraste para baixo ou pinça para rolar o conteúdo"
                                : "Arraste para baixo para fechar"}
                        </Text>

                        <Text style={styles.headerTitle}>
                            Número do Pedido: {displayId ?? "—"}
                        </Text>

                        <Text style={styles.headerText}>{headerSubtitle}</Text>

                    </View>

                    <ScrollView
                        ref={scrollRef}
                        style={styles.body}
                        contentContainerStyle={styles.scrollContent}
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator
                        {...scrollSurfaceProps}
                        onScroll={(event) => {
                            scrollOffsetRef.current =
                                event.nativeEvent.contentOffset.y;
                        }}
                    >

                        {isLoading ? (
                            <View style={{ paddingVertical: 48, alignItems: "center" }}>
                                <ActivityIndicator size="large" color="#A47032" />
                                <Text style={[styles.data, { marginTop: 16 }]}>
                                    Carregando detalhes do pedido…
                                </Text>
                            </View>
                        ) : loadError || !order ? (
                            <View style={{ paddingVertical: 24 }}>
                                <Text style={styles.data}>
                                    {loadError
                                        ?? "Não foi possível carregar este pedido. Feche e abra de novo, ou reinicie a API."}
                                </Text>
                            </View>
                        ) : isFornada ? (
                            <>
                                <View>
                                    <Text style={styles.title}>Produto da fornada</Text>
                                    <View style={{ gap: 8 }}>
                                        <Text style={styles.label}>
                                            Item:{" "}
                                            <Text style={styles.data}>
                                                {order?.fornadaDetalhe?.produtoFornada ?? "—"}
                                            </Text>
                                        </Text>
                                        <Text style={styles.label}>
                                            Quantidade:{" "}
                                            <Text style={styles.data}>
                                                {order?.fornadaDetalhe?.quantidade ?? "—"}
                                            </Text>
                                        </Text>
                                        <Text style={[styles.label, { paddingTop: 12 }]}>
                                            Observações do pedido
                                        </Text>
                                        <Text style={styles.data}>{order?.observacao || "—"}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.title}>Dados da Entrega</Text>
                                    <View style={{ flexDirection: "row", gap: 20, flexWrap: "wrap" }}>
                                        <Text style={styles.label}>
                                            O pedido será:{" "}
                                            <Text style={styles.data}>
                                                {formatTipoEntrega(order?.tipoEntrega)}
                                            </Text>
                                        </Text>
                                        <Text style={styles.label}>
                                            Data:{" "}
                                            <Text style={styles.data}>
                                                {formatDate(order?.dataPrevisaoEntrega) || "—"}
                                            </Text>
                                        </Text>
                                    </View>
                                    <View>
                                        <Text style={styles.subtitle}>Dados do Solicitante</Text>
                                        <View style={{ gap: 10 }}>
                                            <Text style={styles.label}>
                                                Nome:{" "}
                                                <Text style={styles.data}>{order?.nomeCliente || "—"}</Text>
                                            </Text>
                                            <Text style={styles.label}>
                                                Telefone:{" "}
                                                <Text style={styles.data}>
                                                    {order?.telefoneCliente || "—"}
                                                </Text>
                                            </Text>
                                        </View>
                                    </View>
                                    {order?.tipoEntrega === "ENTREGA" && order?.endereco ? (
                                        <View>
                                            <Text style={styles.subtitle}>Endereço</Text>
                                            <View style={{ flexDirection: "row", gap: 30, flexWrap: "wrap" }}>
                                                <View>
                                                    <Text style={styles.label}>CEP</Text>
                                                    <Text style={styles.data}>{order.endereco.cep}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.label}>Cidade</Text>
                                                    <Text style={styles.data}>{order.endereco.cidade}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.label}>Bairro</Text>
                                                    <Text style={styles.data}>{order.endereco.bairro}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.label}>Rua</Text>
                                                    <Text style={styles.data}>{order.endereco.logradouro}</Text>
                                                </View>
                                                <View>
                                                    <Text style={styles.label}>Número</Text>
                                                    <Text style={styles.data}>{order.endereco.numero}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    ) : null}
                                </View>
                            </>
                        ) : (
                        <>
                        <View>

                            <Text style={styles.title}>Montagem</Text>

                            {!order?.bolo ? (
                                <Text style={[styles.data, { marginBottom: 12 }]}>
                                    Dados do bolo não vieram da API. Reinicie o backend (carambolos-api) com o código atualizado.
                                </Text>
                            ) : null}

                            <View style={{ flexDirection: "row", gap: 20, width: "90%", flexWrap: "wrap" }}>
                                <Text style={styles.label}>Tamanho: <Text style={styles.data}>{formatTamanho(order?.bolo?.tamanho) || "—"}</Text></Text>

                                <Text style={styles.label}>Formato: <Text style={styles.data}>{formatFormato(order?.bolo?.formato) || "—"}</Text></Text>

                                <Text style={styles.label}>Massa: <Text style={styles.data}>{formatToken(order?.bolo?.massa?.sabor) || "—"}</Text></Text>

                                <Text style={[styles.label, { width: "40%" }]}>Recheio: <Text style={styles.data}>{formatRecheio(order?.bolo?.recheioPedido)}</Text></Text>

                                {order?.bolo?.cobertura ? (
                                    <Text style={styles.label}>Cobertura: <Text style={styles.data}>{order.bolo.cobertura.cor || formatToken(order.bolo.cobertura.descricao)}</Text></Text>
                                ) : null}
                            </View>

                        </View>

                        <View>

                            <Text style={styles.title}>Decoração</Text>

                            <View>
                                {Array.isArray(order?.bolo?.decoracao?.imagens) && order.bolo.decoracao.imagens.length > 0 ? (
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                                        {order.bolo.decoracao.imagens.map((url, index) => (
                                            <Image
                                                key={`decoracao-img-${index}-${url}`}
                                                source={{ uri: url }}
                                                style={{ width: 96, height: 96, borderRadius: 8 }}
                                                resizeMode="cover"
                                            />
                                        ))}
                                    </View>
                                ) : (
                                    <Text style={styles.data}>Nenhuma imagem de referência adicionada</Text>
                                )}

                                {order?.bolo?.decoracao?.categoria ? (
                                    <Text style={styles.label}>Categoria: <Text style={styles.data}>{order.bolo.decoracao.categoria}</Text></Text>
                                ) : null}

                                <Text style={[styles.label, { paddingTop: 20 }]}>Observações do pedido</Text>

                                <Text style={styles.data}>{order?.observacao || "—"}</Text>

                                {order?.bolo?.decoracao?.observacao ? (
                                    <>
                                        <Text style={[styles.label, { paddingTop: 12 }]}>Observações da decoração</Text>
                                        <Text style={styles.data}>{order.bolo.decoracao.observacao}</Text>
                                    </>
                                ) : null}

                            </View>

                        </View>

                        <View>

                            <Text style={styles.title}>Adicionais</Text>

                            <View>
                                {Array.isArray(order?.adicionaisDecoracao) && order.adicionaisDecoracao.length > 0 ? (
                                    uniqueBy(
                                        order.adicionaisDecoracao,
                                        (item) => `${item.id ?? ""}-${item.descricao ?? ""}`
                                    ).map((item, index) => (
                                        <Text
                                            key={`adicional-${item.id ?? "x"}-${index}`}
                                            style={styles.data}
                                        >
                                            • {item.descricao}
                                        </Text>
                                    ))
                                ) : (
                                    <Text style={styles.data}>Nenhum adicional cadastrado para esta decoração</Text>
                                )}
                            </View>

                        </View>

                        <View>

                            <Text style={styles.title}>Dados da Entrega</Text>

                            <View style={{ flexDirection: "row", gap: 20, flexWrap: "wrap" }}>

                                <Text style={styles.label}>O pedido será: <Text style={styles.data}>{formatTipoEntrega(order?.tipoEntrega)}</Text></Text>

                                <Text style={styles.label}>Data: <Text style={styles.data}>{formatDate(order?.dataPrevisaoEntrega) || "—"}</Text></Text>

                                {order?.tipoEntrega === "RETIRADA" && order?.horarioRetirada ? (
                                    <Text style={styles.label}>Horário de retirada: <Text style={styles.data}>{order.horarioRetirada}</Text></Text>
                                ) : null}

                            </View>

                            <View>

                                <Text style={styles.subtitle}>Dados do Solicitante</Text>

                                <View style={{ gap: 10 }}>

                                    <Text style={styles.label}>Nome do solicitante: <Text style={styles.data}>{order?.nomeCliente || "—"}</Text></Text>

                                    <Text style={styles.label}>Telefone: <Text style={styles.data}>{order?.telefoneCliente || "—"}</Text></Text>

                                </View>

                            </View>

                            <View>

                                <Text style={styles.subtitle}>Endereço</Text>

                                <View style={{ flexDirection: "row", gap: 30, flexWrap: "wrap", width: "80%" }}>

                                    <View>
                                        <Text style={styles.label}>CEP</Text>
                                        <Text style={styles.data}>{order?.endereco?.cep}</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Estado</Text>
                                        <Text style={styles.data}>{order?.endereco?.estado}</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Cidade</Text>
                                        <Text style={styles.data}>{order?.endereco?.cidade}</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Bairro</Text>
                                        <Text style={styles.data}>{order?.endereco?.bairro}</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Rua</Text>
                                        <Text style={[styles.data, { width: "70%" }]}>{order?.endereco?.logradouro}</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Número</Text>
                                        <Text style={styles.data}>{order?.endereco?.numero}</Text>
                                    </View>

                                    <View>
                                        <Text style={styles.label}>Complemento</Text>
                                        <Text style={styles.data}>{order?.endereco?.complemento || "N/A"}</Text>
                                    </View>

                                </View>

                            </View>

                        </View>
                        </>
                        )}

                    </ScrollView>

                </View>

            </Animated.View>

        </View>

    )
}

OrderSummary.propTypes = {
    onClose: PropTypes.func.isRequired,
    order: PropTypes.object,
    isLoading: PropTypes.bool,
    loadError: PropTypes.string,
    enableGestureCloseTargets: PropTypes.bool,
    onGestureScrollReady: PropTypes.func,
}

export default OrderSummary
