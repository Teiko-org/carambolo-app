import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Animated,
  PanResponder,
  Pressable,
  Platform,
  Modal,
} from "react-native";
import PropTypes from "prop-types";

const createPortal =
  Platform.OS === "web" ? require("react-dom").createPortal : null;
import { useQueryClient } from "@tanstack/react-query";
import KanbanColumn, {
  KANBAN_COLUMN_WIDTH,
} from "../components/organisms/KanbanColumn/KanbanColumn";
import OrderCard from "../components/molecules/OrderCard/OrderCard";
import OrderSummary from "../components/organisms/OrderSummary/OrderSummary";
import { useOrders } from "../hooks/useOrderKanban";
import { updateOrderStatus } from "../services/orderKanbanService";
import { useWebGestureCursor } from "../hooks/useWebGestureCursor";
import { useGestureSettings } from "../hooks/useGestureSettings";
import GestureSettingsPanel from "../components/molecules/GestureSettingsPanel/GestureSettingsPanel";

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

const EDGE_HOVER_MS = 380;
const MIN_SCROLL_STEP = 2;
const MAX_SCROLL_STEP = 7;
const GESTURE_DWELL_CLOSE_MS = 550;
const GESTURE_CLICK_MAX_MS = 650;
const GESTURE_CLICK_MAX_MOVE = 35;
const MODAL_SCROLL_START_Y = 4;
const COLUMN_SCROLL_START_Y = 22;
const COLUMN_SCROLL_VERTICAL_RATIO = 1.15;
const KANBAN_COLUMN_GAP = 20;
const KANBAN_BOARD_PADDING_X = 20;
const KANBAN_CONTENT_MIN_WIDTH =
  COLUMNS.length * KANBAN_COLUMN_WIDTH +
  (COLUMNS.length - 1) * KANBAN_COLUMN_GAP +
  KANBAN_BOARD_PADDING_X * 2;
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

const isColumnScrollTarget = (x, y) => {
  if (!isWeb || typeof document === "undefined") return false;
  let node = document.elementFromPoint(x, y);
  while (node) {
    if (node.dataset?.columnScroll === "true") return true;
    node = node.parentElement;
  }
  return false;
};

const resolveColumnScrollElement = (x, y) => {
  if (!isWeb || typeof document === "undefined") return null;
  let node = document.elementFromPoint(x, y);
  while (node) {
    if (node.dataset?.columnScroll === "true") return node;
    node = node.parentElement;
  }
  return null;
};

const scrollColumnContentBy = (deltaY, el) => {
  if (!deltaY || !el || typeof el.scrollTop !== "number") return;
  const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
  el.scrollTop = Math.min(maxScroll, Math.max(0, el.scrollTop + deltaY));
};

const findDetailsTriggerOrderId = (x, y) => {
  if (!isWeb || typeof document === "undefined") return null;
  let node = document.elementFromPoint(x, y);
  while (node) {
    const raw = node.dataset?.orderDetailsTrigger;
    if (raw) return Number(raw);
    node = node.parentElement;
  }
  return null;
};

const isModalCloseTarget = (x, y) => {
  if (!isWeb || typeof document === "undefined") return false;
  let node = document.elementFromPoint(x, y);
  while (node) {
    if (node.dataset?.modalCloseTrigger === "true") return true;
    node = node.parentElement;
  }
  return false;
};

const isModalCloseZone = (x, y, modalOpen) => {
  if (!modalOpen) return false;
  if (isModalCloseTarget(x, y)) return true;
  if (typeof window !== "undefined") {
    const h = window.innerHeight || 0;
    if (h > 0 && y <= h * 0.2) return true;
  }
  return false;
};

const isModalSheetTarget = (x, y) => {
  if (!isWeb || typeof document === "undefined") return false;
  let node = document.elementFromPoint(x, y);
  while (node) {
    if (node.dataset?.modalSheet === "true") return true;
    if (node.dataset?.modalScroll === "true") return true;
    node = node.parentElement;
  }
  return false;
};

const isModalCloseRailStart = (y) => {
  if (typeof window === "undefined") return false;
  const h = window.innerHeight || 0;
  return h > 0 && y <= h * 0.18;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const normalizeOrder = (raw) => {
  const pedidoBoloId = raw?.id;
  const resumoPedidoId = raw?.resumoPedidoId ?? null;
  const id = pedidoBoloId ?? resumoPedidoId ?? String(Math.random());

  return {
    id,
    resumoPedidoId,
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
  onResolveDropTarget,
  onDragPreviewStart,
  onDragPreviewMove,
  onDragPreviewEnd,
  isGestureMode,
  onOpenDetails,
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
    const targetStatus = onResolveDropTarget(
      gestureState.moveX,
      gestureState.moveY
    );
    const targetIndex = COLUMNS.findIndex((column) => column.key === targetStatus);

    if (targetStatus && targetIndex !== -1 && targetIndex !== columnIndex) {
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
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 6,
        onMoveShouldSetPanResponderCapture: (_, gestureState) =>
          dragEnabled &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 6,
        onPanResponderGrant: () => {
          if (!dragEnabled) return;
          setIsDragging(true);
          dragStartScrollXRef.current = getCurrentScrollX();
          onDragStateChange(true, order.id);
          onDragPreviewStart(order);
        },
        onPanResponderMove: (_, gestureState) => {
          if (!dragEnabled) return;
          if (!isWeb) {
            const scrollDeltaDuringDrag =
              getCurrentScrollX() - dragStartScrollXRef.current;
            position.setValue({
              x: gestureState.dx + scrollDeltaDuringDrag,
              y: gestureState.dy,
            });
          }
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
          finishDrag(gestureState);
          onDragPreviewEnd();
        },
        onPanResponderTerminate: (_, gestureState) => {
          if (!dragEnabled) return;
          finishDrag(gestureState);
          onDragPreviewEnd();
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
      onResolveDropTarget,
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
        isGestureMode={isGestureMode}
        onOpenDetails={onOpenDetails}
      />
    </Animated.View>
  );
};

const OrderKanban = () => {
  const { data, isLoading, isError, error } = useOrders();
  const queryClient = useQueryClient();
  const [interactionMode, setInteractionMode] = useState(INTERACTION_MODES.TOUCH);
  const [isDraggingCard, setIsDraggingCard] = useState(false);
  const isDraggingCardRef = useRef(false);
  const [draggingOrderId, setDraggingOrderId] = useState(null);
  const [gestureDraggedOrderId, setGestureDraggedOrderId] = useState(null);
  const scrollRef = useRef(null);
  const boardRef = useRef(null);
  const boardContentRef = useRef(null);
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
  const pinchSessionRef = useRef(null);
  const dwellRef = useRef({ target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 });
  const pointerStableRef = useRef({ x: 0, y: 0, sinceMs: 0 });
  const dwellCooldownUntilRef = useRef(0);
  const modalScrollRef = useRef(null);
  const detailsOrderIdRef = useRef(null);
  const handWasVisibleRef = useRef(false);
  const [gestureSettingsOpen, setGestureSettingsOpen] = useState(false);
  const [detailsOrderId, setDetailsOrderId] = useState(null);

  const gestureSettingsApi = useGestureSettings();
  const isGestureMode = interactionMode === INTERACTION_MODES.GESTURE;
  const gesture = useWebGestureCursor(isGestureMode, gestureSettingsApi.settingsRef);

  gestureDraggedOrderIdRef.current = gestureDraggedOrderId;
  detailsOrderIdRef.current = detailsOrderId;

  const orders = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map(normalizeOrder);
  }, [data]);

  ordersRef.current = orders;

  const findOrderForKanban = (orderId) =>
    ordersRef.current.find(
      (o) =>
        String(o.id) === String(orderId) ||
        (o.resumoPedidoId != null && String(o.resumoPedidoId) === String(orderId))
    );

  const resolveResumoPedidoId = (order) => {
    if (!order) return null;
    if (order.resumoPedidoId != null) return order.resumoPedidoId;
    if (order.raw?.resumoPedidoId != null) return order.raw.resumoPedidoId;
    return null;
  };

  const patchOrdersCacheStatus = (orderId, resumoPedidoId, newStatus) => {
    queryClient.setQueryData(["orders"], (prev) => {
      if (!Array.isArray(prev)) return prev;
      return prev.map((raw) => {
        const matchesPedido = String(raw?.id) === String(orderId);
        const matchesResumo =
          resumoPedidoId != null &&
          raw?.resumoPedidoId != null &&
          String(raw.resumoPedidoId) === String(resumoPedidoId);
        if (!matchesPedido && !matchesResumo) return raw;
        return { ...raw, status: newStatus };
      });
    });
  };

  const handleDrop = async (orderId, newStatus) => {
    const order = findOrderForKanban(orderId);
    let resumoPedidoId = resolveResumoPedidoId(order);

    if (!resumoPedidoId) {
      const rawFromCache = queryClient
        .getQueryData(["orders"])
        ?.find((raw) => String(raw?.id) === String(orderId));
      resumoPedidoId = rawFromCache?.resumoPedidoId ?? null;
    }

    patchOrdersCacheStatus(orderId, resumoPedidoId, newStatus);

    if (!resumoPedidoId) {
      console.warn(
        "resumoPedidoId ausente — card movido só na tela. Backend não atualizado:",
        orderId
      );
      return;
    }

    try {
      await updateOrderStatus(resumoPedidoId, newStatus);
    } catch (e) {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
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

  const setBoardTouchScrollLocked = (locked) => {
    if (!isWeb || isGestureMode) return;
    const dom = getBoardScrollDomNode();
    if (!dom?.style) return;
    dom.style.overflowX = locked ? "hidden" : "auto";
    dom.style.touchAction = locked ? "none" : "pan-x";
  };

  const handleDragStateChange = (isDragging, orderId) => {
    isDraggingCardRef.current = isDragging;
    setIsDraggingCard(isDragging);
    setDraggingOrderId(isDragging ? orderId : null);
    if (isWeb) {
      if (isDragging) {
        const dom = getBoardScrollDomNode();
        if (dom) scrollXRef.current = dom.scrollLeft;
      }
      setBoardTouchScrollLocked(isDragging);
    }
  };

  const boardScrollDomNodeRef = useRef(null);

  const getBoardScrollDomNode = () => {
    if (boardScrollDomNodeRef.current) return boardScrollDomNodeRef.current;
    if (isWeb && typeof document !== "undefined") {
      const byData = document.querySelector('[data-board-scroll-viewport="true"]');
      if (byData && typeof byData.scrollLeft === "number") {
        boardScrollDomNodeRef.current = byData;
        return byData;
      }
    }
    if (!scrollRef.current) return null;
    const node = scrollRef.current.getScrollableNode?.();
    if (node && typeof node.scrollLeft === "number") {
      boardScrollDomNodeRef.current = node;
      return node;
    }
    return null;
  };

  const handleBoardViewportLayout = (event) => {
    viewportWidthRef.current = event.nativeEvent.layout.width;
    invalidateBoardScrollDomNode();
    measureBoardBounds();
  };

  const handleBoardViewportScroll = (event) => {
    const offsetX = event?.nativeEvent?.contentOffset?.x;
    if (typeof offsetX === "number") {
      scrollXRef.current = offsetX;
    }
  };

  const invalidateBoardScrollDomNode = () => {
    boardScrollDomNodeRef.current = null;
  };

  const gestureEdgeEnteredAtRef = useRef({ edge: null, ts: 0 });

  const gestureScrollEdge = (viewportX) => {
    if (!isWeb) return;
    const cfg = gestureSettingsApi.settingsRef.current;
    const edgeThreshold = cfg.edgeThreshold;
    const edgeDelayMs = cfg.edgeDelayMs;
    const viewportW = viewportWidthRef.current > 0 ? viewportWidthRef.current : 400;
    const distLeft = viewportX;
    const distRight = viewportW - viewportX;
    const nearLeft = distLeft < edgeThreshold;
    const nearRight = distRight < edgeThreshold;

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

    if (now - prev.ts < edgeDelayMs) return;

    const dom = getBoardScrollDomNode();
    if (!dom) return;

    const dist = nearLeft ? distLeft : distRight;
    const proximity = 1 - dist / edgeThreshold;
    const step =
      cfg.scrollMinPx + (cfg.scrollMaxPx - cfg.scrollMinPx) * proximity;

    const delta = nearRight ? step : -step;
    dom.scrollLeft = Math.max(0, dom.scrollLeft + delta);
    scrollXRef.current = dom.scrollLeft;
  };

  const scrollBoardAtViewportX = (viewportX) => {
    const leftDistance = viewportX;
    const rightDistance =
      (viewportWidthRef.current > 0 ? viewportWidthRef.current : 400) - viewportX;
    const edgeThreshold = gestureSettingsApi.settingsRef.current.edgeThreshold;
    const isNearLeft = leftDistance < edgeThreshold;
    const isNearRight = rightDistance < edgeThreshold;

    if (!isNearLeft && !isNearRight) return;

    const currentEdge = isNearLeft ? "left" : "right";
    const now = Date.now();
    if (edgeHoverRef.current.edge !== currentEdge) {
      edgeHoverRef.current = { edge: currentEdge, sinceMs: now };
    }

    const distanceToEdge = isNearLeft ? leftDistance : rightDistance;
    const normalizedProximity = Math.max(
      0,
      Math.min(1, (edgeThreshold - distanceToEdge) / edgeThreshold)
    );
    const scrollStep =
      MIN_SCROLL_STEP + (MAX_SCROLL_STEP - MIN_SCROLL_STEP) * normalizedProximity;

    const nextScroll = isNearLeft
      ? Math.max(scrollXRef.current - scrollStep, 0)
      : scrollXRef.current + scrollStep;

    if (nextScroll === scrollXRef.current) return;

    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ x: nextScroll, animated: false });
    scrollXRef.current = nextScroll;
  };

  const handleDragMove = useCallback(
    (screenX) => {
      if (!isDraggingCardRef.current || isGestureMode) return;
      scrollBoardAtViewportX(screenX);
    },
    [isGestureMode]
  );

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

  const tryStartGestureDrag = (x, y, session) => {
    if (
      !session ||
      session.dragStarted ||
      session.modalScrollStarted ||
      session.columnScrollStarted ||
      detailsOrderIdRef.current != null ||
      gestureDraggedOrderIdRef.current != null
    ) {
      return false;
    }
    const picked = findOrderIdAtPoint(x, y);
    if (picked == null) return false;
    const pickedOrder = ordersRef.current.find((o) => o.id === picked);
    if (!pickedOrder) return false;

    session.dragStarted = true;
    pinchPickDoneRef.current = true;
    setGestureDraggedOrderId(pickedOrder.id);
    handleDragStateChange(true, pickedOrder.id);
    handleDragPreviewStart(pickedOrder);
    applyDragPreviewTransform(x, y);
    return true;
  };

  const dragEnabled = !isGestureMode || !isWeb || !gesture.tracking;

  const resolveTargetStatusFromContentX = (pointerContentX, { allowEdgeAssist } = {}) => {
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

    if (!allowEdgeAssist) return baseTarget;

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

  const syncBoardScrollXRef = () => {
    const dom = getBoardScrollDomNode();
    if (dom && typeof dom.scrollLeft === "number") {
      scrollXRef.current = dom.scrollLeft;
    }
  };

  const resolveDropTarget = useCallback(
    (screenX, screenY) => {
      syncBoardScrollXRef();

      if (isWeb) {
        const byPoint = findColumnKeyAtPoint(screenX, screenY);
        if (byPoint) return byPoint;
      }

      const bounds = boardBoundsRef.current;
      const boardLeft = bounds?.x ?? 0;
      const pointerContentX = scrollXRef.current + (screenX - boardLeft);

      return resolveTargetStatusFromContentX(pointerContentX, {
        allowEdgeAssist: isGestureMode,
      });
    },
    [isGestureMode, orders, draggingOrderId]
  );

  const handleDragPreviewStart = useCallback((order) => {
    measureBoardBounds();
    setDragPreview({
      order,
      x: 0,
      y: 0,
    });
  }, []);

  const handleDragPreviewMove = useCallback(({ x, y, localX, localY }) => {
    if (isWeb) {
      applyDragPreviewTransform(x, y);
      return;
    }
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
  }, []);

  const handleDragPreviewEnd = useCallback(() => {
    edgeHoverRef.current = { edge: null, sinceMs: 0 };
    if (isWeb && dragPreviewLayerRef.current?.style) {
      dragPreviewLayerRef.current.style.transform = "";
    }
    setDragPreview(null);
  }, []);

  const handleModalGestureScrollReady = useCallback((controls) => {
    modalScrollRef.current = controls;
  }, []);

  const closeDetailsModal = useCallback(() => {
    modalScrollRef.current?.reset?.();
    setDetailsOrderId(null);
  }, []);

  const scrollModalContentBy = useCallback((deltaY) => {
    if (!deltaY) return;
    if (modalScrollRef.current?.scrollBy) {
      modalScrollRef.current.scrollBy(deltaY);
      return;
    }
    if (!isWeb || typeof document === "undefined") return;
    const el = document.querySelector('[data-modal-scroll="true"]');
    if (!el || typeof el.scrollTop !== "number") return;
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    el.scrollTop = Math.min(maxScroll, Math.max(0, el.scrollTop + deltaY));
  }, []);

  const measureBoardBounds = () => {
    if (!isWeb || !boardRef.current?.measureInWindow) return;
    boardRef.current.measureInWindow((x, y, width, height) => {
      boardBoundsRef.current = { x, y, width, height };
    });
  };

  const processGesturePinch = (x, y) => {
    const pinching = gesture.pinchingRef.current;
    const wasPinching = pinchPrevRef.current;
    let session = pinchSessionRef.current;

    if (pinching && !wasPinching) {
      pinchPickDoneRef.current = false;
      const cfg = gestureSettingsApi.settingsRef.current;
      dwellCooldownUntilRef.current = Date.now() + cfg.dwellCooldownMs;
      dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
      const startOrderId = findOrderIdAtPoint(x, y);
      pinchSessionRef.current = {
        startX: x,
        startY: y,
        startMs: Date.now(),
        startOrderId,
        dragStarted: false,
        modalScrollStarted: false,
        columnScrollStarted: false,
        columnScrollEl: null,
        lastScrollFingerY: 0,
      };
      session = pinchSessionRef.current;
      if (detailsOrderIdRef.current == null && startOrderId != null) {
        tryStartGestureDrag(x, y, session);
      }
    }

    if (
      pinching &&
      session &&
      !session.dragStarted &&
      detailsOrderIdRef.current != null &&
      !session.modalScrollStarted
    ) {
      const dy = y - session.startY;
      const dx = Math.abs(x - session.startX);
      const startedOnCloseRail = isModalCloseRailStart(session.startY);
      const onModal =
        isModalSheetTarget(session.startX, session.startY) ||
        isModalSheetTarget(x, y) ||
        !startedOnCloseRail;
      if (
        onModal &&
        !startedOnCloseRail &&
        Math.abs(dy) > MODAL_SCROLL_START_Y &&
        Math.abs(dy) >= dx * 0.45
      ) {
        session.modalScrollStarted = true;
        session.lastScrollFingerY = y;
        dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
      }
    }

    if (pinching && session?.modalScrollStarted) {
      const delta = y - (session.lastScrollFingerY ?? y);
      session.lastScrollFingerY = y;
      if (Math.abs(delta) > 0.5) {
        scrollModalContentBy(delta);
      }
    }

    if (
      pinching &&
      session &&
      !session.dragStarted &&
      !session.modalScrollStarted &&
      !session.columnScrollStarted &&
      detailsOrderIdRef.current == null &&
      session.startOrderId == null &&
      isColumnScrollTarget(session.startX, session.startY)
    ) {
      const dy = y - session.startY;
      const dx = Math.abs(x - session.startX);
      if (
        Math.abs(dy) > COLUMN_SCROLL_START_Y &&
        Math.abs(dy) >= dx * COLUMN_SCROLL_VERTICAL_RATIO
      ) {
        session.columnScrollStarted = true;
        session.columnScrollEl = resolveColumnScrollElement(
          session.startX,
          session.startY
        );
        session.lastScrollFingerY = y;
        dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
      }
    }

    if (pinching && session?.columnScrollStarted) {
      const delta = y - (session.lastScrollFingerY ?? y);
      session.lastScrollFingerY = y;
      if (Math.abs(delta) > 0.5) {
        scrollColumnContentBy(delta, session.columnScrollEl);
      }
    }

    if (
      pinching &&
      session &&
      !session.dragStarted &&
      !session.modalScrollStarted &&
      !session.columnScrollStarted &&
      detailsOrderIdRef.current == null
    ) {
      const dx = Math.abs(x - session.startX);
      const dy = Math.abs(y - session.startY);
      const move = Math.hypot(dx, dy);
      const dragMinMove = gestureSettingsApi.settingsRef.current.pinchDragMinMove;
      const horizontalIntent = dx >= dy * 0.65;
      if (
        move >= dragMinMove &&
        horizontalIntent &&
        gestureDraggedOrderIdRef.current == null
      ) {
        tryStartGestureDrag(x, y, session) ||
          tryStartGestureDrag(session.startX, session.startY, session);
      }
    }

    if (!pinching && wasPinching) {
      if (session?.dragStarted && gestureDraggedOrderIdRef.current != null) {
        const draggedId = gestureDraggedOrderIdRef.current;
        const targetStatus = resolveDropTarget(x, y);
        const targetIndex = COLUMNS.findIndex((column) => column.key === targetStatus);
        const order = ordersRef.current.find((o) => o.id === draggedId);
        const currentIndex = COLUMNS.findIndex((column) => column.key === order?.status);

        if (targetIndex !== -1 && currentIndex !== -1 && targetIndex !== currentIndex) {
          handleDrop(draggedId, targetStatus);
        }
        setGestureDraggedOrderId(null);
        handleDragStateChange(false, null);
        handleDragPreviewEnd();
      } else if (session) {
        const move = Math.hypot(x - session.startX, y - session.startY);
        const elapsed = Date.now() - session.startMs;
        const isShortClick =
          move <= GESTURE_CLICK_MAX_MOVE && elapsed <= GESTURE_CLICK_MAX_MS;

        if (
          !session.dragStarted &&
          !session.modalScrollStarted &&
          !session.columnScrollStarted &&
          detailsOrderIdRef.current == null
        ) {
          dwellCooldownUntilRef.current =
            Date.now() + gestureSettingsApi.settingsRef.current.dwellCooldownMs;
        } else if (detailsOrderIdRef.current != null && isShortClick) {
          const startX = session.startX;
          const startY = session.startY;
          if (isModalCloseZone(x, y, true) || isModalCloseZone(startX, startY, true)) {
            closeDetailsModal();
          }
        }
      }

      pinchPickDoneRef.current = false;
      pinchSessionRef.current = null;
    }

    pinchPrevRef.current = pinching;
  };

  const processGestureDwell = (x, y) => {
    const pinching = gesture.pinchingRef.current;
    const now = Date.now();
    const cfg = gestureSettingsApi.settingsRef.current;

    if (pinching || gestureDraggedOrderIdRef.current != null) {
      dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
      return 0;
    }

    const ps = pointerStableRef.current;
    if (Math.hypot(x - ps.x, y - ps.y) > cfg.dwellMaxMovePx) {
      pointerStableRef.current = { x, y, sinceMs: now };
    }

    let dwellTarget = null;
    let dwellMs = GESTURE_DWELL_CLOSE_MS;
    let requiresArming = false;

    if (detailsOrderIdRef.current != null) {
      if (now < dwellCooldownUntilRef.current) {
        dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
        return 0;
      }
      if (isModalCloseZone(x, y, true)) {
        dwellTarget = "close";
      }
    } else if (cfg.openDetailsWithGesture) {
      if (now < dwellCooldownUntilRef.current) {
        dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
        return 0;
      }
      const orderId = findDetailsTriggerOrderId(x, y);
      if (orderId != null) {
        dwellTarget = orderId;
        dwellMs = cfg.dwellOpenMs;
        requiresArming = true;
      }
    }

    if (dwellTarget == null) {
      dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
      return 0;
    }

    const prev = dwellRef.current;
    const sameTarget = prev.target === dwellTarget;
    const moved = sameTarget
      ? Math.hypot(x - prev.anchorX, y - prev.anchorY)
      : cfg.dwellMaxMovePx + 1;

    if (!sameTarget || moved > cfg.dwellMaxMovePx) {
      dwellRef.current = {
        target: dwellTarget,
        sinceMs: now,
        anchorX: x,
        anchorY: y,
        armedAt: 0,
      };
      return 0;
    }

    if (requiresArming) {
      const stableMs = now - pointerStableRef.current.sinceMs;
      if (stableMs < cfg.dwellArmingMs) {
        return 0;
      }
      if (!prev.armedAt) {
        dwellRef.current = { ...prev, armedAt: now };
        return 0;
      }
    }

    const countFrom = requiresArming ? prev.armedAt : prev.sinceMs;
    const elapsed = now - countFrom;
    if (elapsed >= dwellMs) {
      if (dwellTarget === "close") {
        closeDetailsModal();
      } else {
        setDetailsOrderId(dwellTarget);
      }
      dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
      return 0;
    }

    return Math.min(1, elapsed / dwellMs);
  };

  useEffect(() => {
    if (!isGestureMode || !gesture.tracking) return undefined;

    let rafId = 0;
    const tick = () => {
      const handVisible = gesture.handVisibleRef?.current;

      if (!handVisible) {
        const dotHidden = cursorDotRef.current;
        if (dotHidden?.style) dotHidden.style.opacity = "0";
        handWasVisibleRef.current = false;
        rafId = requestAnimationFrame(tick);
        return;
      }

      handWasVisibleRef.current = true;

      const { x, y } = gesture.cursorRef.current;

      processGesturePinch(x, y);

      const dwellProgress = processGestureDwell(x, y);

      applyDragPreviewTransform(x, y);
      if (detailsOrderIdRef.current == null) {
        gestureScrollEdge(x);
      }

      const dot = cursorDotRef.current;
      if (dot && isWeb && dot.style) {
        const pinching = gesture.pinchingRef.current;
        const cfg = gestureSettingsApi.settingsRef.current;
        const overDetailsBtn =
          detailsOrderIdRef.current == null &&
          cfg.openDetailsWithGesture &&
          findDetailsTriggerOrderId(x, y);
        const overCard =
          detailsOrderIdRef.current == null && findOrderIdAtPoint(x, y);
        const overClose =
          detailsOrderIdRef.current != null && isModalCloseZone(x, y, true);
        const dwelling = !pinching && dwellProgress > 0;
        const size = pinching ? 24 : dwelling ? 26 : overDetailsBtn || overClose ? 22 : 20;
        const half = size / 2;

        dot.style.position = "fixed";
        dot.style.left = `${x - half}px`;
        dot.style.top = `${y - half}px`;
        dot.style.transform = "none";
        dot.style.zIndex = "2147483646";
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.borderWidth = dwelling || overDetailsBtn ? "3px" : "2px";
        dot.style.borderColor =
          pinching ? "#fff" : overClose ? "#FFEEE7" : overDetailsBtn ? "#25A066" : "#fff";
        dot.style.backgroundColor = pinching
          ? "rgba(196, 80, 40, 0.9)"
          : overClose
            ? "rgba(196, 80, 40, 0.9)"
            : overDetailsBtn
              ? "rgba(37, 160, 102, 0.85)"
              : overCard
                ? "rgba(164, 112, 50, 0.85)"
                : "rgba(164, 112, 50, 0.65)";
        dot.style.boxShadow = dwelling
          ? detailsOrderIdRef.current == null
            ? `0 0 0 ${4 + dwellProgress * 10}px rgba(37, 160, 102, ${0.25 + dwellProgress * 0.45})`
            : `0 0 0 ${4 + dwellProgress * 10}px rgba(196, 80, 40, ${0.25 + dwellProgress * 0.45})`
          : "none";
        dot.style.opacity = "1";
        dot.style.pointerEvents = "none";
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
      pinchSessionRef.current = null;
      dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
      setGestureDraggedOrderId(null);
      setDetailsOrderId(null);
      modalScrollRef.current = null;
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

  return (
    <View
      ref={boardRef}
      onLayout={measureBoardBounds}
      style={{ flex: 1, width: "100%", minHeight: 0, backgroundColor: "#FFEEE7" }}
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
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {isGestureMode && isWeb ? (
            <Pressable
              onPress={() => setGestureSettingsOpen(true)}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: "#A47032",
                backgroundColor: "#fff",
              }}
              accessibilityLabel="Configurações de gestos"
            >
              <Text style={{ color: "#4a2f14", fontWeight: "600", fontSize: 13 }}>⚙</Text>
            </Pressable>
          ) : null}
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
            {gestureSettingsApi.settings.openDetailsWithGesture
              ? "Pinça + arraste = move card. Detalhes: aponte parado em cima do botão Detalhes."
              : "Detalhes do pedido: toque em Detalhes. Pinça + arraste = move cards."}
            {" "}Na coluna: pinça e arraste para cima/baixo para ver mais pedidos. No modal: mesma pinça para rolar.
          </Text>
          <Text style={{ color: "#4a2f14", fontSize: 12, fontWeight: "600" }}>
            {gesture.error
              ? `Câmera indisponível: ${gesture.error}`
              : gesture.tracking
                ? detailsOrderId != null
                  ? "Modal aberto — pinça e arraste para rolar o conteúdo."
                  : gestureSettingsApi.settings.openDetailsWithGesture
                    ? "Aponte no card + pinça = arrastar na hora. Entre cards = pinça vertical. Borda = scroll."
                    : "Aponte no card + pinça = arrastar. Entre cards = pinça vertical na lista. Detalhes por toque."
                : "Inicializando tracking por câmera... (fallback toque ativo)"}
          </Text>
        </View>
      )}
      <ScrollView
        ref={scrollRef}
        horizontal
        dataSet={isWeb ? { boardScrollViewport: "true" } : undefined}
        style={{
          flex: 1,
          ...(isWeb && !isGestureMode
            ? { overflowX: isDraggingCard ? "hidden" : "auto", touchAction: "pan-x" }
            : {}),
        }}
        scrollEnabled={isGestureMode || !isDraggingCard}
        nestedScrollEnabled={false}
        onLayout={handleBoardViewportLayout}
        onScroll={handleBoardViewportScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 0 }}
      >
        <View
          ref={boardContentRef}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexGrow: 0,
            minWidth: KANBAN_CONTENT_MIN_WIDTH,
            gap: KANBAN_COLUMN_GAP,
            paddingHorizontal: KANBAN_BOARD_PADDING_X,
            paddingVertical: 8,
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
                width: KANBAN_COLUMN_WIDTH,
                flexShrink: 0,
                zIndex: groupedOrders[column.key]?.some(
                  (order) => order.id === draggingOrderId
                )
                  ? 500
                  : 1,
                elevation: groupedOrders[column.key]?.some(
                  (order) => order.id === draggingOrderId
                )
                  ? 500
                  : 1,
              }}
            >
              <KanbanColumn
                title={column.title}
                scrollEnabled={!isDraggingCard}
                enableGestureScrollTarget={isGestureMode && isWeb}
              >
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
                    onResolveDropTarget={resolveDropTarget}
                    onDragPreviewStart={handleDragPreviewStart}
                    onDragPreviewMove={handleDragPreviewMove}
                    onDragPreviewEnd={handleDragPreviewEnd}
                    isGestureMode={isGestureMode}
                    onOpenDetails={() => setDetailsOrderId(order.id)}
                  />
                ))}
              </KanbanColumn>
            </View>
          ))}
        </View>
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
            ...(isWeb
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
      <GestureSettingsPanel
        visible={gestureSettingsOpen}
        onClose={() => setGestureSettingsOpen(false)}
        settings={gestureSettingsApi.settings}
        onUpdateField={gestureSettingsApi.updateField}
        onApplyPreset={gestureSettingsApi.applyPreset}
        onResetDefaults={gestureSettingsApi.resetDefaults}
      />
      {isGestureMode && detailsOrderId != null ? (
        <Modal
          visible
          animationType="none"
          transparent
          onRequestClose={closeDetailsModal}
        >
          <OrderSummary
            onClose={closeDetailsModal}
            order={orders.find((o) => o.id === detailsOrderId)?.raw}
            enableGestureCloseTargets
            onGestureScrollReady={handleModalGestureScrollReady}
          />
        </Modal>
      ) : null}
      {createPortal && isGestureMode && gesture.tracking && typeof document !== "undefined"
        ? createPortal(
            <View
              ref={cursorDotRef}
              pointerEvents="none"
              style={{
                position: "fixed",
                left: 0,
                top: 0,
                width: 20,
                height: 20,
                borderRadius: 999,
                borderWidth: 2,
                borderColor: "#fff",
                backgroundColor: "rgba(164, 112, 50, 0.85)",
                zIndex: 2147483646,
              }}
            />,
            document.body
          )
        : null}
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
  onResolveDropTarget: PropTypes.func.isRequired,
  onDragPreviewStart: PropTypes.func.isRequired,
  onDragPreviewMove: PropTypes.func.isRequired,
  onDragPreviewEnd: PropTypes.func.isRequired,
  isGestureMode: PropTypes.bool,
  onOpenDetails: PropTypes.func,
};

DraggableOrderCard.defaultProps = {
  isGestureMode: false,
  onOpenDetails: undefined,
};

