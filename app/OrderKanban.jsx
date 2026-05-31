import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Animated,
  PanResponder,
  Pressable,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import KanbanColumn from "../components/organisms/KanbanColumn/KanbanColumn";
import OrderCard from "../components/molecules/OrderCard/OrderCard";
import { useOrders } from "../hooks/useOrderKanban";
import { updateOrderStatus } from "../services/orderKanbanService";
import { useWebGestureCursor } from "../hooks/useWebGestureCursor";
import { useOrderFilter } from "../contexts/orderFilterContext";

const COLUMNS = [
  { key: "CANCELADO", title: "Pedidos Cancelados" },
  { key: "PENDENTE", title: "Pedidos Pendentes" },
  { key: "PAGO", title: "Pedidos Pagos" },
  { key: "CONCLUIDO", title: "Pedidos Concluídos" },
];

const INTERACTION_MODES = {
  TOUCH: "touch",
  GESTURE: "gesture",
};

const EDGE_THRESHOLD = 120;
const EDGE_HOVER_MS = 380;
const MIN_SCROLL_STEP = 2;
const MAX_SCROLL_STEP = 7;
const GESTURE_SCROLL_MIN_PX = 1.5;
const GESTURE_SCROLL_MAX_PX = 5;
const isWeb = Platform.OS === "web";

const findOrderIdAtPoint = (x, y) => {
  if (!isWeb || typeof document === "undefined") return null;
  let node = document.elementFromPoint(x, y);
  while (node) {
    const raw = node.dataset?.orderId;
    if (raw) return Number(raw);
    node = node.parentElement;
  }
  return null;
};

const findColumnKeyAtPoint = (x, y) => {
  if (!isWeb || typeof document === "undefined") return null;
  let node = document.elementFromPoint(x, y);
  while (node) {
    const key = node.dataset?.columnKey;
    if (key) return key;
    node = node.parentElement;
  }
  return null;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const normalizeOrder = (raw) => {
  const id = raw?.id ?? String(Math.random());

  return {
    id,
    resumoPedidoId: raw?.resumoPedidoId ?? null,
    status: raw?.status ?? "PENDENTE",
    name: raw?.nomeCliente ?? "Cliente",
    phone: raw?.telefoneCliente ?? "",
    type: raw?.tipoEntrega ?? "",
    price: raw?.valorTotal ?? raw?.bolo?.preco ?? "",
    dataPrevisaoEntrega: formatDate(raw?.dataPrevisaoEntrega ?? ""),
    raw,
  };
};

const DraggableOrderCard = ({
  order,
  columnIndex,
  columnsLength,
  dragEnabled,
  onDrop,
  onDragStateChange,
  onDragMove,
  getCurrentScrollX,
  resolveTargetStatusFromMoveX,
  onDragPreviewStart,
  onDragPreviewMove,
  onDragPreviewEnd,
}) => {
  const position = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  const dragStartScrollXRef = useRef(0);

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const finishDrag = (gestureState) => {
    const targetStatus = resolveTargetStatusFromMoveX(gestureState.moveX);
    const targetIndex = COLUMNS.findIndex((column) => column.key === targetStatus);

    if (targetIndex !== -1 && targetIndex !== columnIndex) {
      onDrop(order.id, targetStatus);
    }

    setIsDragging(false);
    onDragStateChange(false, order.id);
    resetPosition();
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) =>
          dragEnabled &&
          (Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4),
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          dragEnabled &&
          (Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4),
        onPanResponderGrant: () => {
          if (!dragEnabled) return;
          setIsDragging(true);
          dragStartScrollXRef.current = getCurrentScrollX();
          onDragStateChange(true, order.id);
          onDragPreviewStart(order);
        },
        onPanResponderMove: (_, gestureState) => {
          if (!dragEnabled) return;
          const scrollDeltaDuringDrag = getCurrentScrollX() - dragStartScrollXRef.current;
          position.setValue({
            x: gestureState.dx + scrollDeltaDuringDrag,
            y: gestureState.dy,
          });
          onDragMove(gestureState.moveX);
          onDragPreviewMove({
            x: gestureState.moveX,
            y: gestureState.moveY,
          });
        },
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderRelease: (_, gestureState) => {
          if (!dragEnabled) return;
          onDragPreviewEnd();
          finishDrag(gestureState);
        },
        onPanResponderTerminate: (_, gestureState) => {
          if (!dragEnabled) return;
          onDragPreviewEnd();
          finishDrag(gestureState);
        },
      }),
    [
      columnIndex,
      columnsLength,
      getCurrentScrollX,
      onDragMove,
      onDragPreviewEnd,
      onDragPreviewMove,
      onDragPreviewStart,
      onDragStateChange,
      onDrop,
      order.id,
      resolveTargetStatusFromMoveX,
      position,
      dragEnabled,
    ]
  );

  return (
    <Animated.View
      dataSet={{
        orderId: String(order.id),
        orderStatus: String(order.status ?? ""),
      }}
      style={{
        transform: [{ translateX: position.x }, { translateY: position.y }],
        userSelect: "none",
        zIndex: isDragging ? 999 : 1,
        elevation: isDragging ? 999 : 1,
        position: "relative",
        opacity: isDragging ? 0 : 1,
      }}
      {...panResponder.panHandlers}
    >
      <OrderCard
        order={order}
        deliveryDate={order.dataPrevisaoEntrega}
        orderId={order.id}
      />
    </Animated.View>
  );
};

const OrderKanban = () => {
  const { month, year } = useOrderFilter();
  const ordersQueryKey = ["orders", month || null, year || null];
  const { data, isLoading, isError, error } = useOrders({ month, year });
  const queryClient = useQueryClient();
  const [interactionMode, setInteractionMode] = useState(INTERACTION_MODES.TOUCH);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [draggingOrderId, setDraggingOrderId] = useState(null);
  const [gestureDraggedOrderId, setGestureDraggedOrderId] = useState(null);
  const scrollRef = useRef(null);
  const boardRef = useRef(null);
  const scrollXRef = useRef(0);
  const viewportWidthRef = useRef(0);
  const boardBoundsRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const columnLayoutsRef = useRef({});
  const edgeHoverRef = useRef({
    edge: null,
    sinceMs: 0,
  });
  const [dragPreview, setDragPreview] = useState(null);
  const pinchPrevRef = useRef(false);
  const gestureDraggedOrderIdRef = useRef(null);
  const cursorDotRef = useRef(null);
  const dragPreviewLayerRef = useRef(null);
  const ordersRef = useRef([]);
  const pinchPickDoneRef = useRef(false);
  const handWasVisibleRef = useRef(false);

  const isGestureMode = interactionMode === INTERACTION_MODES.GESTURE;
  const gesture = useWebGestureCursor(isGestureMode);

  gestureDraggedOrderIdRef.current = gestureDraggedOrderId;

  // Derive orders directly from React Query cache — no separate useState
  const orders = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map(normalizeOrder);
  }, [data]);

  const filterPeriodMessage = useMemo(() => {
    if (!month && !year) return null;

    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];

    const monthNumber = Number(month);
    const monthName = monthNumber >= 1 && monthNumber <= 12 ? monthNames[monthNumber - 1] : null;

    if (monthName && year) {
      return `Pedidos não encontrados no período de ${monthName}/${year}`;
    }
    if (year) {
      return `Pedidos não encontrados no ano de ${year}`;
    }
    return monthName
      ? `Pedidos não encontrados no período de ${monthName}`
      : `Pedidos não encontrados no período de ${month}`;
  }, [month, year]);

  const showFilteredEmptyState = !isLoading && !isError && orders.length === 0 && !!filterPeriodMessage;

  ordersRef.current = orders;

  const handleDrop = async (orderId, newStatus) => {
    // Find the resumoPedidoId for the API call
    const order = orders.find((o) => o.id === orderId);
    const resumoPedidoId = order?.resumoPedidoId;

    if (!resumoPedidoId) {
      console.warn("resumoPedidoId não encontrado para o pedido:", orderId);
      return;
    }

    // Optimistically update the React Query cache directly
    queryClient.setQueryData(ordersQueryKey, (prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((raw) => {
        const id = raw?.id;
        if (id !== orderId) return raw;
        return { ...raw, status: newStatus };
      });
    });

    try {
      await updateOrderStatus(resumoPedidoId, newStatus);
    } catch (e) {
      // On failure, refetch to restore correct server state
      queryClient.invalidateQueries({ queryKey: ordersQueryKey });
      console.warn("Falha ao atualizar status no backend:", e);
    }
  };

  const groupedOrders = useMemo(() => {
    const groups = {};
    COLUMNS.forEach((col) => {
      groups[col.key] = [];
    });

    orders.forEach((order) => {
      const key = order.status ?? "PENDENTE";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(order);
    });

    return groups;
  }, [orders]);

  const handleDragStateChange = (isDragging, orderId) => {
    setIsDraggingCard(isDragging);
    setDraggingOrderId(isDragging ? orderId : null);
  };

  const gestureScrollDomNodeRef = useRef(null);

  const getGestureScrollNode = () => {
    if (gestureScrollDomNodeRef.current) return gestureScrollDomNodeRef.current;
    if (!scrollRef.current) return null;
    const node = scrollRef.current.getScrollableNode?.();
    if (node && typeof node.scrollLeft === "number") {
      gestureScrollDomNodeRef.current = node;
      return node;
    }
    return null;
  };

  const gestureEdgeEnteredAtRef = useRef({ edge: null, ts: 0 });
  const GESTURE_EDGE_DELAY_MS = 200;

  const gestureScrollEdge = (viewportX) => {
    if (!isWeb) return;
    const viewportW = viewportWidthRef.current > 0 ? viewportWidthRef.current : 400;
    const distLeft = viewportX;
    const distRight = viewportW - viewportX;
    const nearLeft = distLeft < EDGE_THRESHOLD;
    const nearRight = distRight < EDGE_THRESHOLD;

    const currentEdge = nearLeft ? "left" : nearRight ? "right" : null;

    if (!currentEdge) {
      gestureEdgeEnteredAtRef.current = { edge: null, ts: 0 };
      return;
    }

    const now = Date.now();
    const prev = gestureEdgeEnteredAtRef.current;
    if (prev.edge !== currentEdge) {
      gestureEdgeEnteredAtRef.current = { edge: currentEdge, ts: now };
      return;
    }

    // Só começa a rolar após o cursor ficar na borda por GESTURE_EDGE_DELAY_MS.
    if (now - prev.ts < GESTURE_EDGE_DELAY_MS) return;

    const dom = getGestureScrollNode();
    if (!dom) return;

    const dist = nearLeft ? distLeft : distRight;
    const proximity = 1 - dist / EDGE_THRESHOLD;
    const step = GESTURE_SCROLL_MIN_PX + (GESTURE_SCROLL_MAX_PX - GESTURE_SCROLL_MIN_PX) * proximity;

    const delta = nearRight ? step : -step;
    dom.scrollLeft = Math.max(0, dom.scrollLeft + delta);
    scrollXRef.current = dom.scrollLeft;
  };

  const scrollBoardAtViewportX = (viewportX) => {
    if (!scrollRef.current) return;

    const leftDistance = viewportX;
    const rightDistance =
      (viewportWidthRef.current > 0 ? viewportWidthRef.current : 400) - viewportX;
    const isNearLeft = leftDistance < EDGE_THRESHOLD;
    const isNearRight = rightDistance < EDGE_THRESHOLD;

    if (!isNearLeft && !isNearRight) return;

    const currentEdge = isNearLeft ? "left" : "right";
    const now = Date.now();
    if (edgeHoverRef.current.edge !== currentEdge) {
      edgeHoverRef.current = { edge: currentEdge, sinceMs: now };
    }

    const distanceToEdge = isNearLeft ? leftDistance : rightDistance;
    const normalizedProximity = Math.max(
      0,
      Math.min(1, (EDGE_THRESHOLD - distanceToEdge) / EDGE_THRESHOLD)
    );
    const scrollStep =
      MIN_SCROLL_STEP + (MAX_SCROLL_STEP - MIN_SCROLL_STEP) * normalizedProximity;

    const nextScroll = isNearLeft
      ? Math.max(scrollXRef.current - scrollStep, 0)
      : scrollXRef.current + scrollStep;

    if (nextScroll !== scrollXRef.current) {
      const node = scrollRef.current.getScrollableNode?.();
      if (node && node.scrollTo) {
        node.scrollTo({ x: nextScroll, animated: false });
      } else {
        scrollRef.current.scrollTo({ x: nextScroll, animated: false });
      }
      scrollXRef.current = nextScroll;
    }
  };

  const handleDragMove = (moveX) => {
    if (!isDraggingCard) return;
    scrollBoardAtViewportX(moveX);
  };

  const applyDragPreviewTransform = (viewportX, viewportY) => {
    const layer = dragPreviewLayerRef.current;
    if (!layer) return;
    const bounds = boardBoundsRef.current;
    const localX = viewportX - bounds.x;
    const localY = viewportY - bounds.y;
    if (isWeb && layer.style) {
      layer.style.transform = `translate3d(${localX - 120}px, ${localY - 40}px, 0)`;
    }
  };

  const dragEnabled = !isGestureMode || !isWeb || !gesture.tracking;

  const resolveTargetStatusFromMoveX = (moveX) => {
    const pointerContentX = scrollXRef.current + moveX;
    const layouts = columnLayoutsRef.current;

    let closest = null;

    COLUMNS.forEach((column) => {
      const layout = layouts[column.key];
      if (!layout) return;

      const centerX = layout.x + layout.width / 2;
      const distance = Math.abs(pointerContentX - centerX);

      if (!closest || distance < closest.distance) {
        closest = { key: column.key, distance };
      }
    });

    const baseTarget = closest?.key ?? "PENDENTE";

    // Assistência para telas pequenas: ao manter o cursor na borda por alguns ms,
    // tenta avançar/recuar uma coluna além da mais próxima.
    const hover = edgeHoverRef.current;
    const hoverMs = hover.edge ? Date.now() - hover.sinceMs : 0;
    const shouldEdgeAssist = hover.edge && hoverMs >= EDGE_HOVER_MS;
    if (!shouldEdgeAssist) return baseTarget;

    const draggingOrder = orders.find((o) => o.id === draggingOrderId);
    const currentStatus = draggingOrder?.status;
    const currentIndex = COLUMNS.findIndex((column) => column.key === currentStatus);
    if (currentIndex === -1) return baseTarget;

    const step = hover.edge === "right" ? 1 : -1;
    const assistedIndex = Math.min(COLUMNS.length - 1, Math.max(0, currentIndex + step));
    return COLUMNS[assistedIndex]?.key ?? baseTarget;
  };

  const handleDragPreviewStart = (order) => {
    setDragPreview({
      order,
      x: 0,
      y: 0,
    });
  };

  const handleDragPreviewMove = ({ x, y, localX, localY }) => {
    setDragPreview((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        x,
        y,
        localX: localX ?? x - boardBoundsRef.current.x,
        localY: localY ?? y - boardBoundsRef.current.y,
      };
    });
  };

  const handleDragPreviewEnd = () => {
    edgeHoverRef.current = { edge: null, sinceMs: 0 };
    setDragPreview(null);
  };

  const measureBoardBounds = () => {
    if (!isWeb || !boardRef.current?.measureInWindow) return;
    boardRef.current.measureInWindow((x, y, width, height) => {
      boardBoundsRef.current = { x, y, width, height };
    });
  };

  const processGesturePinch = (x, y, moveX) => {
    const pinching = gesture.pinchingRef.current;
    const wasPinching = pinchPrevRef.current;

    if (pinching && !wasPinching) {
      pinchPickDoneRef.current = false;
    }

    if (!pinching && wasPinching && gestureDraggedOrderIdRef.current != null) {
      const draggedId = gestureDraggedOrderIdRef.current;
      const dropByPoint = findColumnKeyAtPoint(x, y);
      const fallbackByMove = resolveTargetStatusFromMoveX(moveX);
      const targetStatus = dropByPoint || fallbackByMove;
      const targetIndex = COLUMNS.findIndex((column) => column.key === targetStatus);
      const order = ordersRef.current.find((o) => o.id === draggedId);
      const currentIndex = COLUMNS.findIndex((column) => column.key === order?.status);

      if (targetIndex !== -1 && currentIndex !== -1 && targetIndex !== currentIndex) {
        handleDrop(draggedId, targetStatus);
      }
      setGestureDraggedOrderId(null);
      handleDragStateChange(false, null);
      handleDragPreviewEnd();
      pinchPickDoneRef.current = false;
    }

    if (pinching && !pinchPickDoneRef.current && gestureDraggedOrderIdRef.current == null) {
      const picked = findOrderIdAtPoint(x, y);
      if (picked != null) {
        const pickedOrder = ordersRef.current.find((o) => o.id === picked);
        if (pickedOrder) {
          pinchPickDoneRef.current = true;
          setGestureDraggedOrderId(pickedOrder.id);
          handleDragStateChange(true, pickedOrder.id);
          handleDragPreviewStart(pickedOrder);
          applyDragPreviewTransform(x, y);
        }
      }
    }

    pinchPrevRef.current = pinching;
  };

  useEffect(() => {
    if (!isGestureMode || !gesture.tracking) return undefined;

    let rafId = 0;
    const tick = () => {
      const handVisible = gesture.handVisibleRef?.current;

      if (!handVisible) {
        const dotHidden = cursorDotRef.current;
        if (dotHidden?.style) dotHidden.style.opacity = "0";
        // Não cancela drag quando mão some brevemente (câmera perdendo tracking).
        // O drag só cancela se a mão sumir por HAND_STABLE_OFF_FRAMES consecutivos
        // (já tratado pelo HandStabilityGate dentro do hook).
        handWasVisibleRef.current = false;
        rafId = requestAnimationFrame(tick);
        return;
      }

      handWasVisibleRef.current = true;

      const { x, y } = gesture.cursorRef.current;
      const bounds = boardBoundsRef.current;
      const moveX = x - bounds.x;

      processGesturePinch(x, y, moveX);

      applyDragPreviewTransform(x, y);
      gestureScrollEdge(x);

      const dot = cursorDotRef.current;
      if (dot && isWeb && dot.style) {
        const b = boardBoundsRef.current;
        const pinching = gesture.pinchingRef.current;
        const size = pinching ? 24 : 20;
        const half = size / 2;
        dot.style.transform = `translate3d(${x - b.x - half}px, ${y - b.y - half}px, 0)`;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.backgroundColor = pinching
          ? "rgba(196, 80, 40, 0.9)"
          : "rgba(164, 112, 50, 0.85)";
        dot.style.opacity = "1";
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isGestureMode, gesture.tracking, gesture.cursorRef, gesture.pinchingRef, gesture.handVisibleRef]);

  useEffect(() => {
    if (!isGestureMode) {
      pinchPrevRef.current = false;
      pinchPickDoneRef.current = false;
      setGestureDraggedOrderId(null);
    }
  }, [isGestureMode]);

  if (isLoading && orders.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFEEE7",
        }}
      >
        <ActivityIndicator size="large" color="#A47032" />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFEEE7",
          padding: 16,
        }}
      >
        <Text style={{ color: "#103464", textAlign: "center" }}>
          Erro ao carregar pedidos: {error?.message ?? "Tente novamente mais tarde."}
        </Text>
      </View>
    );
  }

  if (showFilteredEmptyState) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFEEE7",
          padding: 24,
        }}
      >
        <Text
          style={{
            color: "#4a2f14",
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {filterPeriodMessage}
        </Text>
      </View>
    );
  }

  return (
    <View
      ref={boardRef}
      onLayout={measureBoardBounds}
      style={{ height: "80%", backgroundColor: "#FFEEE7" }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
          gap: 8,
        }}
      >
        <Text style={{ color: "#4a2f14", fontWeight: "700" }}>Modo de interação</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => setInteractionMode(INTERACTION_MODES.TOUCH)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#A47032",
              backgroundColor: !isGestureMode ? "#A47032" : "#fff",
            }}
          >
            <Text style={{ color: !isGestureMode ? "#fff" : "#4a2f14", fontWeight: "600" }}>
              Toque
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setInteractionMode(INTERACTION_MODES.GESTURE)}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: "#A47032",
              backgroundColor: isGestureMode ? "#A47032" : "#fff",
            }}
          >
            <Text style={{ color: isGestureMode ? "#fff" : "#4a2f14", fontWeight: "600" }}>
              Gestos
            </Text>
          </Pressable>
        </View>
      </View>
      {isGestureMode && (
        <View style={{ paddingHorizontal: 20, paddingBottom: 6, gap: 4 }}>
          <Text style={{ color: "#6b3f1a", fontSize: 12 }}>
            Modo Gestos (beta): o detalhamento dos cards continua por clique/toque em{" "}
            {"\""}Detalhes{"\""}.
          </Text>
          <Text style={{ color: "#4a2f14", fontSize: 12, fontWeight: "600" }}>
            {gesture.error
              ? `Câmera indisponível: ${gesture.error}`
              : gesture.tracking
                ? "Aproxime o dedo das bordas da tela para rolar colunas. Pinça em um card para mover."
                : "Inicializando tracking por câmera... (fallback toque ativo)"}
          </Text>
        </View>
      )}
      <ScrollView
        ref={scrollRef}
        horizontal
        style={{ flex: 1 }}
        scrollEnabled={isGestureMode ? true : !isDraggingCard}
        onLayout={(event) => {
          viewportWidthRef.current = event.nativeEvent.layout.width;
          measureBoardBounds();
        }}
        onScroll={(event) => {
          scrollXRef.current = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          gap: 20,
          paddingHorizontal: 20,
        }}
      >
        {COLUMNS.map((column, index) => (
          <View
            key={column.key}
            dataSet={{ columnKey: column.key }}
            onLayout={(event) => {
              const { x, width } = event.nativeEvent.layout;
              columnLayoutsRef.current[column.key] = { x, width };
            }}
            style={{
              zIndex: groupedOrders[column.key]?.some((order) => order.id === draggingOrderId)
                ? 500
                : 1,
              elevation: groupedOrders[column.key]?.some((order) => order.id === draggingOrderId)
                ? 500
                : 1,
            }}
          >
            <KanbanColumn title={column.title}>
              {groupedOrders[column.key]?.map((order) => (
                <DraggableOrderCard
                  key={order.id}
                  order={order}
                  columnIndex={index}
                  columnsLength={COLUMNS.length}
                  dragEnabled={dragEnabled}
                  onDrop={handleDrop}
                  onDragStateChange={handleDragStateChange}
                  onDragMove={handleDragMove}
                  getCurrentScrollX={() => scrollXRef.current}
                  resolveTargetStatusFromMoveX={resolveTargetStatusFromMoveX}
                  onDragPreviewStart={handleDragPreviewStart}
                  onDragPreviewMove={handleDragPreviewMove}
                  onDragPreviewEnd={handleDragPreviewEnd}
                />
              ))}
            </KanbanColumn>
          </View>
        ))}
      </ScrollView>
      {dragPreview && (
        <View
          ref={dragPreviewLayerRef}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 9999,
            elevation: 9999,
            ...(isGestureMode && gesture.tracking
              ? {}
              : {
                  transform: [
                    { translateX: (dragPreview.localX ?? dragPreview.x) - 120 },
                    { translateY: (dragPreview.localY ?? dragPreview.y) - 40 },
                  ],
                }),
          }}
        >
          <OrderCard
            order={dragPreview.order}
            deliveryDate={dragPreview.order.dataPrevisaoEntrega}
            orderId={dragPreview.order.id}
          />
        </View>
      )}
      {isGestureMode && gesture.tracking && (
        <View
          ref={cursorDotRef}
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 20,
            height: 20,
            borderRadius: 999,
            borderWidth: 2,
            borderColor: "#fff",
            backgroundColor: "rgba(164, 112, 50, 0.85)",
            zIndex: 10000,
            elevation: 10000,
            willChange: "transform",
          }}
        />
      )}
    </View>
  );
};

export default OrderKanban;

DraggableOrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string,
    dataPrevisaoEntrega: PropTypes.string,
  }).isRequired,
  columnIndex: PropTypes.number.isRequired,
  columnsLength: PropTypes.number.isRequired,
  dragEnabled: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragStateChange: PropTypes.func.isRequired,
  onDragMove: PropTypes.func.isRequired,
  getCurrentScrollX: PropTypes.func.isRequired,
  resolveTargetStatusFromMoveX: PropTypes.func.isRequired,
  onDragPreviewStart: PropTypes.func.isRequired,
  onDragPreviewMove: PropTypes.func.isRequired,
  onDragPreviewEnd: PropTypes.func.isRequired,
};

