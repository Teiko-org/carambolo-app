import { useMemo, useRef, useState } from "react";
import { View, ScrollView, ActivityIndicator, Text, Animated, PanResponder } from "react-native";
import PropTypes from "prop-types";
import { useQueryClient } from "@tanstack/react-query";
import KanbanColumn from "../components/organisms/KanbanColumn/KanbanColumn";
import OrderCard from "../components/molecules/OrderCard/OrderCard";
import { useOrders } from "../hooks/useOrderKanban";
import { updateOrderStatus } from "../services/orderKanbanService";
import { useOrderFilter } from "../contexts/orderFilterContext";

const COLUMNS = [
  { key: "CANCELADO", title: "Pedidos Cancelados" },
  { key: "PENDENTE", title: "Pedidos Pendentes" },
  { key: "PAGO", title: "Pedidos Pagos" },
  { key: "CONCLUIDO", title: "Pedidos Concluídos" },
];

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
          Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4,
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4,
        onPanResponderGrant: () => {
          setIsDragging(true);
          dragStartScrollXRef.current = getCurrentScrollX();
          onDragStateChange(true, order.id);
          onDragPreviewStart(order);
        },
        onPanResponderMove: (_, gestureState) => {
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
          onDragPreviewEnd();
          finishDrag(gestureState);
        },
        onPanResponderTerminate: (_, gestureState) => {
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
    ]
  );

  return (
    <Animated.View
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
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const [draggingOrderId, setDraggingOrderId] = useState(null);
  const scrollRef = useRef(null);
  const scrollXRef = useRef(0);
  const viewportWidthRef = useRef(0);
  const columnLayoutsRef = useRef({});
  const [dragPreview, setDragPreview] = useState(null);

  // Derive orders directly from React Query cache — no separate useState
  const orders = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map(normalizeOrder);
  }, [data]);

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

  const handleDragMove = (moveX) => {
    if (!isDraggingCard || !scrollRef.current) return;

    const EDGE_THRESHOLD = 110;
    const MIN_SCROLL_STEP = 2;
    const MAX_SCROLL_STEP = 7;

    const leftDistance = moveX;
    const rightDistance = (viewportWidthRef.current > 0 ? viewportWidthRef.current : 400) - moveX;
    const isNearLeft = leftDistance < EDGE_THRESHOLD;
    const isNearRight = rightDistance < EDGE_THRESHOLD;

    if (!isNearLeft && !isNearRight) return;

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
      // Use getScrollableNode to bypass the responder system and avoid
      // the "ScrollView doesn't take rejection well" warning
      const node = scrollRef.current.getScrollableNode?.();
      if (node && node.scrollTo) {
        node.scrollTo({ x: nextScroll, animated: false });
      } else {
        scrollRef.current.scrollTo({ x: nextScroll, animated: false });
      }
      scrollXRef.current = nextScroll;
    }
  };

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

    return closest?.key ?? "PENDENTE";
  };

  const handleDragPreviewStart = (order) => {
    setDragPreview({
      order,
      x: 0,
      y: 0,
    });
  };

  const handleDragPreviewMove = ({ x, y }) => {
    setDragPreview((prev) => {
      if (!prev) return prev;
      return { ...prev, x, y };
    });
  };

  const handleDragPreviewEnd = () => {
    setDragPreview(null);
  };

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

  return (
    <View style={{ height: "80%", backgroundColor: "#FFEEE7" }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        style={{ flex: 1 }}
        scrollEnabled={!isDraggingCard}
        onLayout={(event) => {
          viewportWidthRef.current = event.nativeEvent.layout.width;
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
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 9999,
            elevation: 9999,
            transform: [
              { translateX: dragPreview.x - 120 },
              { translateY: dragPreview.y - 40 },
            ],
          }}
        >
          <OrderCard
            order={dragPreview.order}
            deliveryDate={dragPreview.order.dataPrevisaoEntrega}
            orderId={dragPreview.order.id}
          />
        </View>
      )}
    </View>
  );
};

export default OrderKanban;

DraggableOrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    dataPrevisaoEntrega: PropTypes.string,
  }).isRequired,
  columnIndex: PropTypes.number.isRequired,
  columnsLength: PropTypes.number.isRequired,
  onDrop: PropTypes.func.isRequired,
  onDragStateChange: PropTypes.func.isRequired,
  onDragMove: PropTypes.func.isRequired,
  getCurrentScrollX: PropTypes.func.isRequired,
  resolveTargetStatusFromMoveX: PropTypes.func.isRequired,
  onDragPreviewStart: PropTypes.func.isRequired,
  onDragPreviewMove: PropTypes.func.isRequired,
  onDragPreviewEnd: PropTypes.func.isRequired,
};

