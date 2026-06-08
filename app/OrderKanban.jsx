import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  Animated,
  PanResponder,
  Pressable,
  TouchableOpacity,
  Platform,
  Modal,
  Dimensions,
  Alert,
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
import { useGestureCursor } from "../hooks/useGestureCursor";
import {
  createGestureHitTest,
  measureViewInWindow,
} from "../hooks/gesture/gestureHitTest";
import { useOrderFilter } from "../contexts/orderFilterContext";
import { useGestureSettings } from "../hooks/useGestureSettings";
import GestureSettingsPanel from "../components/molecules/GestureSettingsPanel/GestureSettingsPanel";
import GestureCameraPermissionModal from "../components/molecules/GestureCameraPermissionModal/GestureCameraPermissionModal";
import GestureErrorBoundary from "../components/molecules/GestureErrorBoundary/GestureErrorBoundary";
import {
  canPickOrderForKanban,
  getKanbanTransitionErrorMessage,
  normalizeKanbanStatus,
} from "../utils/kanbanStatusRules";

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
const MODAL_SCROLL_START_Y = 2;
const MODAL_SCROLL_VERTICAL_RATIO = 0.28;
const MODAL_SCROLL_GAIN = 3.2;
const COLUMN_SCROLL_START_Y = 22;
const COLUMN_SCROLL_VERTICAL_RATIO = 1.15;
const KANBAN_COLUMN_GAP = 20;
const KANBAN_BOARD_PADDING_X = 20;
const KANBAN_CONTENT_MIN_WIDTH =
  COLUMNS.length * KANBAN_COLUMN_WIDTH +
  (COLUMNS.length - 1) * KANBAN_COLUMN_GAP +
  KANBAN_BOARD_PADDING_X * 2;
const isWeb = Platform.OS === "web";

const findOrderIdAtPointWeb = (x, y) => {
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

const isColumnScrollTargetWeb = (x, y) => {
  if (!isWeb || typeof document === "undefined") return false;
  let node = document.elementFromPoint(x, y);
  while (node) {
    if (node.dataset?.columnScroll === "true") return true;
    node = node.parentElement;
  }
  return false;
};

const resolveColumnScrollTargetWeb = (x, y) => {
  if (!isWeb || typeof document === "undefined") return null;
  let node = document.elementFromPoint(x, y);
  while (node) {
    if (node.dataset?.columnScroll === "true") return node;
    node = node.parentElement;
  }
  return null;
};

const scrollColumnContentByWeb = (deltaY, el) => {
  if (!deltaY || !el || typeof el.scrollTop !== "number") return;
  const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
  el.scrollTop = Math.min(maxScroll, Math.max(0, el.scrollTop + deltaY));
};

const scrollColumnContentByNative = (deltaY, columnKey, columnScrollRefsRef, columnScrollYRef) => {
  if (!deltaY || !columnKey) return;
  const scrollView = columnScrollRefsRef.current[columnKey];
  if (!scrollView) return;
  const current = columnScrollYRef.current[columnKey] ?? 0;
  const next = Math.max(0, current + deltaY);
  columnScrollYRef.current[columnKey] = next;
  scrollView.scrollTo?.({ y: next, animated: false });
};

const findDetailsTriggerOrderIdWeb = (x, y) => {
  if (!isWeb || typeof document === "undefined") return null;
  let node = document.elementFromPoint(x, y);
  while (node) {
    const raw = node.dataset?.orderDetailsTrigger;
    if (raw) return Number(raw);
    node = node.parentElement;
  }
  return null;
};

const isModalCloseTargetWeb = (x, y) => {
  if (!isWeb || typeof document === "undefined") return false;
  let node = document.elementFromPoint(x, y);
  while (node) {
    if (node.dataset?.modalCloseTrigger === "true") return true;
    node = node.parentElement;
  }
  return false;
};

const isModalCloseRailStart = (y) => {
  const h = isWeb
    ? typeof window !== "undefined"
      ? window.innerHeight || 0
      : 0
    : Dimensions.get("window").height;
  return h > 0 && y <= h * 0.18;
};

const isModalSheetTargetWeb = (x, y) => {
  if (!isWeb || typeof document === "undefined") return false;
  let node = document.elementFromPoint(x, y);
  while (node) {
    if (node.dataset?.modalSheet === "true") return true;
    if (node.dataset?.modalScroll === "true") return true;
    node = node.parentElement;
  }
  return false;
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
    status: normalizeKanbanStatus(raw?.status),
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
  gestureDragActiveId,
  onOpenDetails,
  onGestureCardLayout,
  onGestureDetailsLayout,
  onGestureCardRef,
}) => {
  const position = useRef(new Animated.ValueXY()).current;
  const [isDragging, setIsDragging] = useState(false);
  const dragStartScrollXRef = useRef(0);
  const cardWrapperRef = useRef(null);

  const measureCardBounds = useCallback(() => {
    if (!isGestureMode || isWeb || !onGestureCardLayout) return;
    measureViewInWindow(cardWrapperRef.current, (bounds) => {
      onGestureCardLayout(order.id, bounds);
    });
  }, [isGestureMode, onGestureCardLayout, order.id]);

  useEffect(() => {
    if (!isGestureMode || isWeb) return undefined;
    onGestureCardRef?.(order.id, cardWrapperRef.current);
    return () => onGestureCardRef?.(order.id, null);
  }, [isGestureMode, onGestureCardRef, order.id]);

  const handleDetailsButtonLayout = useCallback(
    (bounds) => {
      if (!isGestureMode || isWeb || !onGestureDetailsLayout) return;
      onGestureDetailsLayout(order.id, bounds);
    },
    [isGestureMode, onGestureDetailsLayout, order.id]
  );

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
      ref={cardWrapperRef}
      onLayout={measureCardBounds}
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
        opacity:
          isDragging || (isGestureMode && gestureDragActiveId === order.id)
            ? 0
            : canPickOrderForKanban(order.status)
              ? 1
              : 0.88,
        ...(isWeb && !canPickOrderForKanban(order.status) ? { cursor: "default" } : {}),
      }}
      {...panResponder.panHandlers}
    >
      <OrderCard
        order={order}
        deliveryDate={order.dataPrevisaoEntrega}
        orderId={order.id}
        isGestureMode={isGestureMode}
        onOpenDetails={onOpenDetails}
        onDetailsButtonLayout={handleDetailsButtonLayout}
      />
    </Animated.View>
  );
};

const OrderKanban = () => {
  const { month, year } = useOrderFilter();
  const ordersQueryKey = useMemo(
    () => ["orders", month || null, year || null],
    [month, year]
  );
  const { data, isLoading, isError, error, isFetching } = useOrders({ month, year });
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
  const scrollViewportOriginRef = useRef({ x: 0, y: 0, width: 0 });
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
  const nativeCursorRef = useRef(null);
  const gestureHitTestRef = useRef(createGestureHitTest());
  const columnScrollRefsRef = useRef({});
  const columnScrollYRef = useRef({});
  const gestureCardRefsRef = useRef(new Map());
  const columnRefsRef = useRef(new Map());
  const lastGestureCursorRef = useRef({ x: 0, y: 0 });
  const lastDragPreviewPosRef = useRef({ x: 0, y: 0 });
  const gestureDropCommittingRef = useRef(false);
  const pinchOpenSinceRef = useRef(0);
  const gestureDragActiveRef = useRef(false);
  const gestureBoundsRefreshTimerRef = useRef(null);
  const gestureHeaderRef = useRef(null);
  const [gestureSettingsOpen, setGestureSettingsOpen] = useState(false);
  const [detailsOrderId, setDetailsOrderId] = useState(null);

  const gestureSettingsApi = useGestureSettings();
  const isGestureMode = interactionMode === INTERACTION_MODES.GESTURE;
  const gesture = useGestureCursor(
    isGestureMode,
    gestureSettingsApi.settingsRef,
    nativeCursorRef,
    gestureDragActiveRef
  );
  const GestureTracker = gesture.GestureTracker;

  const findOrderIdAtPoint = useCallback(
    (x, y) => {
      if (isWeb) return findOrderIdAtPointWeb(x, y);
      return gestureHitTestRef.current.findOrderIdAtPoint(x, y);
    },
    []
  );

  const findDetailsTriggerOrderId = useCallback(
    (x, y) => {
      if (isWeb) return findDetailsTriggerOrderIdWeb(x, y);
      return gestureHitTestRef.current.findDetailsTriggerOrderId(x, y);
    },
    []
  );

  const isColumnScrollTarget = useCallback(
    (x, y) => {
      if (isWeb) return isColumnScrollTargetWeb(x, y);
      return gestureHitTestRef.current.isColumnScrollTarget(x, y);
    },
    []
  );

  const resolveColumnScrollTarget = useCallback(
    (x, y) => {
      if (isWeb) return resolveColumnScrollTargetWeb(x, y);
      return gestureHitTestRef.current.getColumnScrollKeyAtPoint(x, y);
    },
    []
  );

  const isModalCloseTarget = useCallback(
    (x, y) => {
      if (isWeb) return isModalCloseTargetWeb(x, y);
      return gestureHitTestRef.current.isModalCloseTarget(x, y);
    },
    []
  );

  const isModalSheetTarget = useCallback(
    (x, y) => {
      if (isWeb) return isModalSheetTargetWeb(x, y);
      return gestureHitTestRef.current.isModalSheetTarget(x, y);
    },
    []
  );

  const isModalCloseZone = useCallback(
    (x, y, modalOpen) => {
      if (!modalOpen) return false;
      if (isModalCloseTarget(x, y)) return true;
      const h = isWeb
        ? typeof window !== "undefined"
          ? window.innerHeight || 0
          : 0
        : Dimensions.get("window").height;
      if (h > 0 && y <= h * 0.2) return true;
      return false;
    },
    [isModalCloseTarget]
  );

  const scrollColumnContentBy = useCallback(
    (deltaY, scrollTarget) => {
      if (isWeb) {
        scrollColumnContentByWeb(deltaY, scrollTarget);
        return;
      }
      scrollColumnContentByNative(
        deltaY,
        scrollTarget,
        columnScrollRefsRef,
        columnScrollYRef
      );
    },
    []
  );

  const registerGestureCardBounds = useCallback((orderId, bounds) => {
    gestureHitTestRef.current.setOrderBounds(orderId, bounds);
  }, []);

  const registerGestureDetailsBounds = useCallback((orderId, bounds) => {
    gestureHitTestRef.current.setDetailsTriggerBounds(orderId, bounds);
  }, []);

  const registerGestureCardRef = useCallback((orderId, ref) => {
    const key = String(orderId);
    if (ref) gestureCardRefsRef.current.set(key, ref);
    else gestureCardRefsRef.current.delete(key);
  }, []);

  const refreshGestureCardBounds = useCallback(() => {
    if (isWeb || !isGestureMode) return;
    gestureCardRefsRef.current.forEach((ref, orderId) => {
      measureViewInWindow(ref, (bounds) => {
        gestureHitTestRef.current.setOrderBounds(orderId, bounds);
      });
    });
    columnRefsRef.current.forEach((ref, columnKey) => {
      measureViewInWindow(ref, (bounds) => {
        gestureHitTestRef.current.setColumnBounds(columnKey, bounds);
      });
    });
  }, [isGestureMode]);

  const refreshGestureColumnBounds = useCallback(() => {
    if (isWeb || !isGestureMode) return;
    columnRefsRef.current.forEach((ref, columnKey) => {
      measureViewInWindow(ref, (bounds) => {
        gestureHitTestRef.current.setColumnBounds(columnKey, bounds);
      });
    });
  }, [isGestureMode]);

  const registerColumnRef = useCallback((columnKey, ref) => {
    if (ref) columnRefsRef.current.set(columnKey, ref);
    else columnRefsRef.current.delete(columnKey);
  }, []);

  const scheduleRefreshGestureCardBounds = useCallback(() => {
    if (isWeb || !isGestureMode || gestureDraggedOrderIdRef.current != null) return;
    if (gestureBoundsRefreshTimerRef.current) return;
    gestureBoundsRefreshTimerRef.current = setTimeout(() => {
      gestureBoundsRefreshTimerRef.current = null;
      refreshGestureCardBounds();
    }, 250);
  }, [isGestureMode, refreshGestureCardBounds]);

  const registerColumnScrollRef = useCallback((columnKey, ref) => {
    columnScrollRefsRef.current[columnKey] = ref;
  }, []);

  const registerColumnScrollArea = useCallback((columnKey, bounds) => {
    gestureHitTestRef.current.setColumnScrollBounds(columnKey, bounds);
  }, []);

  const handleColumnScrollOffset = useCallback((columnKey, offsetY) => {
    columnScrollYRef.current[columnKey] = offsetY;
    if (gestureDraggedOrderIdRef.current != null) return;
    scheduleRefreshGestureCardBounds();
  }, [scheduleRefreshGestureCardBounds]);

  const handleModalGestureAreasLayout = useCallback(({ closeRail, sheet }) => {
    if (closeRail) {
      gestureHitTestRef.current.setModalCloseBounds(closeRail);
    }
    if (sheet) {
      gestureHitTestRef.current.setModalSheetBounds(sheet);
    }
  }, []);

  gestureDraggedOrderIdRef.current = gestureDraggedOrderId;
  gestureDragActiveRef.current = gestureDraggedOrderId != null;
  detailsOrderIdRef.current = detailsOrderId;

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

  const findOrderForKanban = (orderId) => {
    if (orderId == null) return null;
    return ordersRef.current.find(
      (o) =>
        String(o.id) === String(orderId) ||
        (o.resumoPedidoId != null && String(o.resumoPedidoId) === String(orderId))
    );
  };

  const selectedOrderRaw = useMemo(() => {
    if (detailsOrderId == null) return null;
    return findOrderForKanban(detailsOrderId)?.raw ?? null;
  }, [detailsOrderId, orders]);

  useEffect(() => {
    if (detailsOrderId == null) return;
    if (isLoading || isFetching) return;
    if (isError) {
      setDetailsOrderId(null);
      return;
    }
    if (!selectedOrderRaw) {
      setDetailsOrderId(null);
    }
  }, [detailsOrderId, isLoading, isFetching, isError, selectedOrderRaw]);

  const resolveResumoPedidoId = (order) => {
    if (!order) return null;
    if (order.resumoPedidoId != null) return order.resumoPedidoId;
    if (order.raw?.resumoPedidoId != null) return order.raw.resumoPedidoId;
    return null;
  };

  const patchOrdersCacheStatus = useCallback(
    (orderId, resumoPedidoId, newStatus) => {
      queryClient.setQueryData(ordersQueryKey, (prev) => {
        if (!Array.isArray(prev)) return prev;
        return prev.map((raw) => {
          const matchesPedido = String(raw?.id) === String(orderId);
          const matchesResumo =
            resumoPedidoId != null &&
            raw?.resumoPedidoId != null &&
            String(raw.resumoPedidoId) === String(resumoPedidoId);
          if (!matchesPedido && !matchesResumo) return raw;
          return { ...raw, status: normalizeKanbanStatus(newStatus) };
        });
      });
    },
    [queryClient, ordersQueryKey]
  );

  const handleDrop = async (orderId, newStatus) => {
    const order = findOrderForKanban(orderId);
    const previousStatus = order?.status ?? null;

    const transitionError = getKanbanTransitionErrorMessage(previousStatus, newStatus);
    if (transitionError) {
      Alert.alert("Não foi possível mover", transitionError);
      return;
    }

    let resumoPedidoId = resolveResumoPedidoId(order);

    if (!resumoPedidoId) {
      const rawFromCache = queryClient
        .getQueryData(ordersQueryKey)
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
      if (previousStatus) {
        patchOrdersCacheStatus(orderId, resumoPedidoId, previousStatus);
      } else {
        queryClient.invalidateQueries({ queryKey: ordersQueryKey });
      }
      const apiMessage =
        e?.response?.data?.message ??
        e?.response?.data?.error ??
        e?.message ??
        "Erro desconhecido";
      Alert.alert(
        "Não foi possível mover",
        typeof apiMessage === "string" ? apiMessage : "O servidor recusou esta mudança de status."
      );
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
    scrollRef.current?.measureInWindow?.((x, y, width, height) => {
      scrollViewportOriginRef.current = { x, y, width, height };
    });
  };

  const handleBoardViewportScroll = (event) => {
    const offsetX = event?.nativeEvent?.contentOffset?.x;
    if (typeof offsetX === "number") {
      scrollXRef.current = offsetX;
    }
    if (gestureDraggedOrderIdRef.current != null) return;
    scheduleRefreshGestureCardBounds();
  };

  const invalidateBoardScrollDomNode = () => {
    boardScrollDomNodeRef.current = null;
  };

  const gestureEdgeStateRef = useRef({ active: false, edge: null, ts: 0 });
  const gestureEdgeEnteredAtRef = useRef({ edge: null, ts: 0 });

  const gestureScrollEdgeWeb = (viewportX) => {
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
    const step = cfg.scrollMinPx + (cfg.scrollMaxPx - cfg.scrollMinPx) * proximity;
    const delta = nearRight ? step : -step;
    dom.scrollLeft = Math.max(0, dom.scrollLeft + delta);
    scrollXRef.current = dom.scrollLeft;
  };

  const getBoardMaxScrollX = () => {
    const viewportW = viewportWidthRef.current > 0 ? viewportWidthRef.current : 400;
    if (isWeb) {
      const dom = getBoardScrollDomNode();
      if (dom) {
        return Math.max(0, dom.scrollWidth - dom.clientWidth);
      }
    }
    return Math.max(0, KANBAN_CONTENT_MIN_WIDTH - viewportW);
  };

  const getViewportLocalX = (screenX) => {
    const origin = scrollViewportOriginRef.current;
    const viewportLeft =
      origin.width > 0 ? origin.x : boardBoundsRef.current.x ?? 0;
    return screenX - viewportLeft;
  };

  const gestureScrollEdge = (screenX, { dragging = false } = {}) => {
    const cfg = gestureSettingsApi.settingsRef.current;
    const enterThreshold = dragging ? Math.min(cfg.edgeThreshold, 96) : cfg.edgeThreshold;
    const exitThreshold = enterThreshold + (dragging ? 48 : 36);
    const edgeDelayMs = dragging ? 0 : cfg.edgeDelayMs;
    const scrollMinPx = dragging ? 6 : cfg.scrollMinPx;
    const scrollMaxPx = dragging ? 16 : cfg.scrollMaxPx;
    const scrollIntervalMs = dragging ? 16 : Math.max(edgeDelayMs, 40);
    const viewportW = viewportWidthRef.current > 0 ? viewportWidthRef.current : 400;
    const viewportX = getViewportLocalX(screenX);
    const distLeft = viewportX;
    const distRight = viewportW - viewportX;
    const edgeState = gestureEdgeStateRef.current;
    let nearLeft = false;
    let nearRight = false;

    if (edgeState.active && edgeState.edge === "left") {
      nearLeft = distLeft < exitThreshold;
    } else if (edgeState.active && edgeState.edge === "right") {
      nearRight = distRight < exitThreshold;
    } else {
      nearLeft = distLeft < enterThreshold;
      nearRight = distRight < enterThreshold;
    }

    const currentEdge = nearLeft ? "left" : nearRight ? "right" : null;
    const maxScrollX = getBoardMaxScrollX();

    if (!currentEdge) {
      gestureEdgeStateRef.current = { active: false, edge: null, ts: 0 };
      if (!dragging) {
        edgeHoverRef.current = { edge: null, sinceMs: 0 };
      }
      return;
    }

    if (currentEdge === "left" && scrollXRef.current <= 0) return;
    if (currentEdge === "right" && scrollXRef.current >= maxScrollX - 1) return;

    const now = Date.now();
    if (dragging) {
      if (edgeHoverRef.current.edge !== currentEdge) {
        edgeHoverRef.current = { edge: currentEdge, sinceMs: now };
      }
    }

    const prev = gestureEdgeStateRef.current;
    if (!prev.active || prev.edge !== currentEdge) {
      gestureEdgeStateRef.current = { active: true, edge: currentEdge, ts: now };
      if (edgeDelayMs > 0) return;
    }

    if (now - prev.ts < scrollIntervalMs) return;

    gestureEdgeStateRef.current = { active: true, edge: currentEdge, ts: now };

    const dist = currentEdge === "left" ? distLeft : distRight;
    const proximity = Math.max(0, Math.min(1, 1 - dist / enterThreshold));
    const step = scrollMinPx + (scrollMaxPx - scrollMinPx) * proximity;
    const delta = currentEdge === "right" ? step : -step;

    if (isWeb) {
      const dom = getBoardScrollDomNode();
      if (!dom) return;
      const nextScroll = Math.min(maxScrollX, Math.max(0, dom.scrollLeft + delta));
      if (nextScroll === dom.scrollLeft) return;
      dom.scrollLeft = nextScroll;
      scrollXRef.current = nextScroll;
      return;
    }

    const nextScroll = Math.min(maxScrollX, Math.max(0, scrollXRef.current + delta));
    if (nextScroll === scrollXRef.current) return;
    scrollRef.current?.scrollTo?.({ x: nextScroll, animated: false });
    scrollXRef.current = nextScroll;
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

  const pendingPreviewPosRef = useRef(null);

  const applyDragPreviewTransform = (viewportX, viewportY, useScreenCoords = false) => {
    const layer = dragPreviewLayerRef.current;

    if (isWeb) {
      if (!layer?.style) return;
      const bounds = boardBoundsRef.current;
      const localX = viewportX - bounds.x;
      const localY = viewportY - bounds.y;
      layer.style.transform = `translate3d(${localX - 120}px, ${localY - 40}px, 0)`;
      return;
    }

    const screenCoords =
      useScreenCoords || (isGestureMode && gestureDraggedOrderIdRef.current != null);
    const offsetX = viewportX - 120;
    const offsetY = viewportY - 40;

    if (!layer) {
      pendingPreviewPosRef.current = { x: viewportX, y: viewportY, screenCoords };
      return;
    }
    pendingPreviewPosRef.current = null;

    if (screenCoords) {
      layer.setNativeProps?.({
        style: {
          position: "absolute",
          left: offsetX,
          top: offsetY,
          transform: [],
        },
      });
      return;
    }

    const bounds = boardBoundsRef.current;
    const localX = viewportX - bounds.x;
    const localY = viewportY - bounds.y;
    layer.setNativeProps?.({
      style: {
        transform: [
          { translateX: localX - 120 },
          { translateY: localY - 40 },
        ],
      },
    });
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
    let picked = findOrderIdAtPoint(x, y);
    if (picked == null && session?.startOrderId != null) {
      picked = session.startOrderId;
    }
    if (picked == null) return false;
    const pickedOrder = ordersRef.current.find((o) => o.id === picked);
    if (!pickedOrder) return false;
    if (!canPickOrderForKanban(pickedOrder.status)) return false;

    session.dragStarted = true;
    pinchPickDoneRef.current = true;
    setGestureDraggedOrderId(pickedOrder.id);
    handleDragStateChange(true, pickedOrder.id);
    handleDragPreviewStart(pickedOrder);
    if (isWeb) {
      applyDragPreviewTransform(x, y);
      return true;
    }
    gestureDragActiveRef.current = true;
    lastDragPreviewPosRef.current = { x, y };
    applyDragPreviewTransform(x, y, true);
    refreshGestureColumnBounds();
    return true;
  };

  const finishGestureDrop = (draggedId, targetStatus) => {
    const targetIndex = COLUMNS.findIndex((column) => column.key === targetStatus);
    const order = ordersRef.current.find((o) => o.id === draggedId);
    const currentIndex = COLUMNS.findIndex((column) => column.key === order?.status);

    if (targetIndex !== -1 && currentIndex !== -1 && targetIndex !== currentIndex) {
      handleDrop(draggedId, targetStatus);
    }
    handleDragPreviewEnd();
    setGestureDraggedOrderId(null);
    handleDragStateChange(false, null);
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

  const resolveNativeDropColumn = useCallback(
    (screenX, screenY) => {
      const baseTarget =
        gestureHitTestRef.current.findColumnKeyAtPoint(screenX, screenY) ?? null;
      if (!baseTarget || !isGestureMode) return baseTarget;

      const hover = edgeHoverRef.current;
      const hoverMs = hover.edge ? Date.now() - hover.sinceMs : 0;
      if (!hover.edge || hoverMs < EDGE_HOVER_MS) return baseTarget;

      const draggedId = gestureDraggedOrderIdRef.current ?? draggingOrderId;
      const order = ordersRef.current.find((o) => o.id === draggedId);
      const currentIndex = COLUMNS.findIndex((column) => column.key === order?.status);
      if (currentIndex === -1) return baseTarget;

      const step = hover.edge === "right" ? 1 : -1;
      const assistedIndex = Math.min(
        COLUMNS.length - 1,
        Math.max(0, currentIndex + step)
      );
      return COLUMNS[assistedIndex]?.key ?? baseTarget;
    },
    [isGestureMode, draggingOrderId]
  );

  const resolveDropTarget = useCallback(
    (screenX, screenY) => {
      syncBoardScrollXRef();

      if (isWeb) {
        const byPoint = findColumnKeyAtPoint(screenX, screenY);
        if (byPoint) return byPoint;
        const bounds = boardBoundsRef.current;
        const boardLeft = bounds?.x ?? 0;
        const pointerContentX = scrollXRef.current + (screenX - boardLeft);
        return resolveTargetStatusFromContentX(pointerContentX, {
          allowEdgeAssist: isGestureMode,
        });
      }

      const bounds = boardBoundsRef.current;
      const viewportOrigin = scrollViewportOriginRef.current;
      const viewportLeft =
        viewportOrigin.width > 0 ? viewportOrigin.x : bounds?.x ?? 0;
      const pointerContentX = scrollXRef.current + (screenX - viewportLeft);

      if (isGestureMode && gestureDraggedOrderIdRef.current != null) {
        const nativeTarget = resolveNativeDropColumn(screenX, screenY);
        if (nativeTarget) return nativeTarget;
        return resolveTargetStatusFromContentX(pointerContentX, {
          allowEdgeAssist: false,
        });
      }

      const nativeTarget = resolveNativeDropColumn(screenX, screenY);
      if (nativeTarget) return nativeTarget;

      return resolveTargetStatusFromContentX(pointerContentX, {
        allowEdgeAssist: isGestureMode,
      });
    },
    [isGestureMode, resolveNativeDropColumn]
  );

  const resolveDropTargetForRelease = useCallback(
    (screenX, screenY) => {
      syncBoardScrollXRef();

      if (isWeb) {
        const byPoint = findColumnKeyAtPoint(screenX, screenY);
        if (byPoint) return byPoint;
        const bounds = boardBoundsRef.current;
        const boardLeft = bounds?.x ?? 0;
        const pointerContentX = scrollXRef.current + (screenX - boardLeft);
        return resolveTargetStatusFromContentX(pointerContentX, {
          allowEdgeAssist: false,
        });
      }

      return resolveDropTarget(screenX, screenY);
    },
    [resolveDropTarget]
  );

  const hideDragPreviewLayer = () => {
    const layer = dragPreviewLayerRef.current;
    if (!layer) return;
    if (isWeb && layer.style) {
      layer.style.opacity = "0";
      layer.style.visibility = "hidden";
      return;
    }
    layer.setNativeProps?.({ style: { opacity: 0 } });
  };

  const commitGestureDrop = useCallback(() => {
    const draggedId = gestureDraggedOrderIdRef.current;
    if (draggedId == null || gestureDropCommittingRef.current) return false;

    const dropPos = lastDragPreviewPosRef.current;
    if (
      !Number.isFinite(dropPos.x) ||
      !Number.isFinite(dropPos.y) ||
      (dropPos.x < 8 && dropPos.y < 8)
    ) {
      return false;
    }

    gestureDropCommittingRef.current = true;
    pinchOpenSinceRef.current = 0;
    pinchPickDoneRef.current = false;
    gestureDragActiveRef.current = false;
    hideDragPreviewLayer();
    const targetStatus = resolveDropTarget(dropPos.x, dropPos.y);
    gestureDraggedOrderIdRef.current = null;
    finishGestureDrop(draggedId, targetStatus);
    pinchSessionRef.current = null;
    pinchPrevRef.current = false;
    gestureDropCommittingRef.current = false;
    return true;
  }, [resolveDropTarget]);

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
    if (isWeb) {
      gestureEdgeEnteredAtRef.current = { edge: null, ts: 0 };
      if (dragPreviewLayerRef.current?.style) {
        dragPreviewLayerRef.current.style.transform = "";
      }
      setDragPreview(null);
      return;
    }
    gestureEdgeStateRef.current = { active: false, edge: null, ts: 0 };
    pinchOpenSinceRef.current = 0;
    gestureDragActiveRef.current = false;
    hideDragPreviewLayer();
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
    const step = deltaY * MODAL_SCROLL_GAIN;
    if (modalScrollRef.current?.scrollBy) {
      modalScrollRef.current.scrollBy(step);
      return;
    }
    if (!isWeb || typeof document === "undefined") return;
    const el = document.querySelector('[data-modal-scroll="true"]');
    if (!el || typeof el.scrollTop !== "number") return;
    const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
    el.scrollTop = Math.min(maxScroll, Math.max(0, el.scrollTop + step));
  }, []);

  const tryActivateModalGestureScroll = useCallback((session, x, y) => {
    if (!session || session.modalScrollStarted || session.dragStarted) return;
    if (detailsOrderIdRef.current == null) return;
    if (isModalCloseRailStart(session.startY) || isModalCloseRailStart(y)) return;

    const onModal =
      isModalSheetTarget(session.startX, session.startY) ||
      isModalSheetTarget(x, y) ||
      !isModalCloseRailStart(session.startY);
    if (!onModal) return;

    const dy = y - session.startY;
    const dx = Math.abs(x - session.startX);
    if (
      Math.abs(dy) > MODAL_SCROLL_START_Y &&
      Math.abs(dy) >= dx * MODAL_SCROLL_VERTICAL_RATIO
    ) {
      session.modalScrollStarted = true;
      session.lastScrollFingerY = y;
      dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
    }
  }, [isModalSheetTarget, isModalCloseRailStart]);

  const armModalGestureScrollOnPinch = useCallback((session, x, y) => {
    if (!session || detailsOrderIdRef.current == null) return;
    if (session.modalScrollStarted || session.dragStarted) return;
    if (isModalCloseRailStart(y)) return;
    const onModal = isModalSheetTarget(x, y) || !isModalCloseRailStart(y);
    if (!onModal) return;
    session.modalScrollStarted = true;
    session.lastScrollFingerY = y;
    dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
  }, [isModalSheetTarget, isModalCloseRailStart]);

  const applyModalGestureScroll = useCallback(
    (session, y) => {
      if (!session?.modalScrollStarted) return;
      const delta = y - (session.lastScrollFingerY ?? y);
      session.lastScrollFingerY = y;
      if (Math.abs(delta) > 0.1) {
        scrollModalContentBy(delta);
      }
    },
    [scrollModalContentBy]
  );

  const measureBoardBounds = () => {
    if (!boardRef.current?.measureInWindow) return;
    boardRef.current.measureInWindow((x, y, width, height) => {
      boardBoundsRef.current = { x, y, width, height };
    });
  };

  const processGesturePinch = (x, y) => {
    const pinching = gesture.pinchingRef.current;

    if (isWeb) {
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
        armModalGestureScrollOnPinch(session, x, y);
        if (detailsOrderIdRef.current == null && startOrderId != null) {
          tryStartGestureDrag(x, y, session);
        }
      }

      if (pinching && session) {
        tryActivateModalGestureScroll(session, x, y);
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
          session.columnScrollEl = resolveColumnScrollTarget(session.startX, session.startY);
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
          const targetStatus = normalizeKanbanStatus(resolveDropTargetForRelease(x, y));
          const order = ordersRef.current.find((o) => o.id === draggedId);
          const currentStatus = normalizeKanbanStatus(order?.status);
          const targetIndex = COLUMNS.findIndex((column) => column.key === targetStatus);
          const currentIndex = COLUMNS.findIndex((column) => column.key === currentStatus);

          if (targetIndex !== -1 && currentIndex !== -1 && targetIndex !== currentIndex) {
            const transitionError = getKanbanTransitionErrorMessage(currentStatus, targetStatus);
            if (transitionError) {
              Alert.alert("Não foi possível mover", transitionError);
            } else {
              handleDrop(draggedId, targetStatus);
            }
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
      return;
    }

    if (gestureDraggedOrderIdRef.current != null) {
      pinchPrevRef.current = pinching;
      return;
    }
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
        pickAttempted: false,
        modalScrollStarted: false,
        columnScrollStarted: false,
        columnScrollTarget: null,
        lastScrollFingerY: 0,
      };
      session = pinchSessionRef.current;
      armModalGestureScrollOnPinch(session, x, y);
      if (detailsOrderIdRef.current == null && startOrderId != null) {
        tryStartGestureDrag(x, y, session);
      }
    }

    if (pinching && session) {
      tryActivateModalGestureScroll(session, x, y);
    }

    if (
      pinching &&
      session &&
      !session.dragStarted &&
      !session.pickAttempted &&
      !session.modalScrollStarted &&
      !session.columnScrollStarted &&
      detailsOrderIdRef.current == null
    ) {
      const orderUnderCursor = findOrderIdAtPoint(x, y);
      if (orderUnderCursor != null) {
        session.startOrderId = orderUnderCursor;
        session.pickAttempted = true;
        tryStartGestureDrag(x, y, session);
      }
    }

    if (
      pinching &&
      session &&
      !session.dragStarted &&
      !session.pickAttempted &&
      !session.modalScrollStarted &&
      !session.columnScrollStarted &&
      detailsOrderIdRef.current == null &&
      session.startOrderId != null &&
      gestureDraggedOrderIdRef.current == null
    ) {
      const pickHoldMs = gestureSettingsApi.settingsRef.current.pinchPickHoldMs ?? 0;
      if (pickHoldMs > 0 && Date.now() - session.startMs >= pickHoldMs) {
        session.pickAttempted = true;
        tryStartGestureDrag(session.startX, session.startY, session);
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
        session.columnScrollTarget = resolveColumnScrollTarget(
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
        scrollColumnContentBy(delta, session.columnScrollTarget);
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
      const dragMinMove = isWeb
        ? gestureSettingsApi.settingsRef.current.pinchDragMinMove
        : Math.max(
            14,
            gestureSettingsApi.settingsRef.current.pinchDragMinMove ?? 14
          );
      const horizontalIntent = dx >= dy * 0.65;
      if (
        move >= dragMinMove &&
        horizontalIntent &&
        gestureDraggedOrderIdRef.current == null
      ) {
        tryStartGestureDrag(session.startX, session.startY, session);
      }
    }

    if (!pinching && wasPinching) {
      if (
        session?.dragStarted &&
        gestureDraggedOrderIdRef.current != null
      ) {
        // Drop tratado no loop rápido (commitGestureDrop) ao soltar a pinça.
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
    if (!dragPreview || gestureDraggedOrderId == null || !isGestureMode || isWeb) return;
    const pos = pendingPreviewPosRef.current ?? lastDragPreviewPosRef.current;
    requestAnimationFrame(() => {
      applyDragPreviewTransform(pos.x, pos.y, true);
    });
  }, [dragPreview, gestureDraggedOrderId, isGestureMode]);

  useEffect(() => {
    if (!isGestureMode || !gesture.tracking) return undefined;

    if (isWeb) {
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
        const session = pinchSessionRef.current;
        if (gesture.pinchingRef.current && session?.modalScrollStarted) {
          applyModalGestureScroll(session, y);
        }
        const dwellProgress = processGestureDwell(x, y);
        if (gestureDraggedOrderIdRef.current != null) {
          applyDragPreviewTransform(x, y);
        }
        if (detailsOrderIdRef.current == null) {
          gestureScrollEdgeWeb(x);
        }

        const dot = cursorDotRef.current;
        if (dot?.style) {
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
    }

    let rafId = 0;
    let lastLogicMs = 0;
    let lastCursorPaintMs = 0;
    let lastEdgeScrollMs = 0;
    let lastHitX = -9999;
    let lastHitY = -9999;
    let cachedOverDetailsBtn = null;
    let cachedOverCard = null;
    let cachedOverClose = false;
    let cachedDwellProgress = 0;
    let dragHandLostFrames = 0;
    let pinchReleasedFrames = 0;

    const paintNativeCursor = (x, y, pinching, dwellProgress, cfg) => {
      const movedHit = Math.hypot(x - lastHitX, y - lastHitY);
      if (movedHit > 8) {
        lastHitX = x;
        lastHitY = y;
        cachedOverDetailsBtn =
          detailsOrderIdRef.current == null &&
          cfg.openDetailsWithGesture &&
          findDetailsTriggerOrderId(x, y);
        cachedOverCard =
          detailsOrderIdRef.current == null && findOrderIdAtPoint(x, y);
        cachedOverClose =
          detailsOrderIdRef.current != null && isModalCloseZone(x, y, true);
      }

      const overDetailsBtn = cachedOverDetailsBtn;
      const overCard = cachedOverCard;
      const overClose = cachedOverClose;
      const dwelling = !pinching && dwellProgress > 0;
      const size = pinching ? 24 : dwelling ? 26 : overDetailsBtn || overClose ? 22 : 20;
      const half = size / 2;
      const borderColor = pinching
        ? "#fff"
        : overClose
          ? "#FFEEE7"
          : overDetailsBtn
            ? "#25A066"
            : "#fff";
      const backgroundColor = pinching
        ? "rgba(196, 80, 40, 0.9)"
        : overClose
          ? "rgba(196, 80, 40, 0.9)"
          : overDetailsBtn
            ? "rgba(37, 160, 102, 0.85)"
            : overCard
              ? "rgba(164, 112, 50, 0.85)"
              : "rgba(164, 112, 50, 0.65)";

      const dot = cursorDotRef.current;
      if (dot && isWeb && dot.style) {
        dot.dataset.gestureOverlay = "true";
        dot.style.position = "fixed";
        dot.style.left = `${x - half}px`;
        dot.style.top = `${y - half}px`;
        dot.style.transform = "none";
        dot.style.zIndex = "2147483646";
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.borderWidth = dwelling || overDetailsBtn ? "3px" : "2px";
        dot.style.borderColor = borderColor;
        dot.style.backgroundColor = backgroundColor;
        dot.style.boxShadow = dwelling
          ? detailsOrderIdRef.current == null
            ? `0 0 0 ${4 + dwellProgress * 10}px rgba(37, 160, 102, ${0.25 + dwellProgress * 0.45})`
            : `0 0 0 ${4 + dwellProgress * 10}px rgba(196, 80, 40, ${0.25 + dwellProgress * 0.45})`
          : "none";
        dot.style.opacity = "1";
        dot.style.pointerEvents = "none";
      }

      if (!isWeb && nativeCursorRef.current?.setNativeProps) {
        nativeCursorRef.current.setNativeProps({
          style: {
            position: "absolute",
            left: x - half,
            top: y - half,
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: dwelling || overDetailsBtn ? 3 : 2,
            borderColor,
            backgroundColor,
            opacity: 1,
          },
        });
      }
    };

    const tick = (now) => {
      const ts = now ?? Date.now();
      rafId = requestAnimationFrame(tick);

      const handVisible = gesture.handVisibleRef?.current;
      const dragging = gestureDraggedOrderIdRef.current != null;
      const pinching = gesture.pinchingRef.current;
      const frozenPos = lastDragPreviewPosRef.current;
      let x;
      let y;
      if (dragging && (!handVisible || !pinching)) {
        x = frozenPos.x;
        y = frozenPos.y;
      } else {
        const cursor = gesture.cursorRef.current ?? lastGestureCursorRef.current;
        x = cursor?.x ?? 0;
        y = cursor?.y ?? 0;
        if (handVisible && (x > 0 || y > 0)) {
          lastGestureCursorRef.current = { x, y };
        }
      }

      if (dragging) {
        dragHandLostFrames = handVisible ? 0 : dragHandLostFrames + 1;
        const shouldDropOnPinchRelease =
          !pinching &&
          pinchReleasedFrames >= 2 &&
          (pinchPrevRef.current || pinchPickDoneRef.current);
        const shouldDropOnHandLost = !handVisible && dragHandLostFrames >= 4;

        if (pinching) {
          pinchReleasedFrames = 0;
          if (x > 8 || y > 8) {
            lastDragPreviewPosRef.current = { x, y };
            applyDragPreviewTransform(x, y, true);
          } else {
            applyDragPreviewTransform(frozenPos.x, frozenPos.y, true);
          }
          if (detailsOrderIdRef.current == null && ts - lastEdgeScrollMs >= 16) {
            lastEdgeScrollMs = ts;
            gestureScrollEdge(x, y, { dragging: true });
          }
          pinchPrevRef.current = true;
        } else {
          pinchReleasedFrames += 1;
          applyDragPreviewTransform(frozenPos.x, frozenPos.y, true);
          if (shouldDropOnPinchRelease || shouldDropOnHandLost) {
            commitGestureDrop();
          }
        }
      } else {
        dragHandLostFrames = 0;
        pinchReleasedFrames = 0;
      }

      if (!handVisible) {
        if (dragging) {
          // Drop já tratado acima; mantém preview congelado se ainda arrastando.
          if (gestureDraggedOrderIdRef.current != null) {
            const frozen = lastDragPreviewPosRef.current;
            applyDragPreviewTransform(frozen.x, frozen.y, true);
          }
        }
        if (ts - lastCursorPaintMs >= 100) {
          lastCursorPaintMs = ts;
          const dotHidden = cursorDotRef.current;
          if (dotHidden?.style) dotHidden.style.opacity = "0";
          nativeCursorRef.current?.setNativeProps?.({ style: { opacity: 0 } });
        }
        handWasVisibleRef.current = false;
        if (!dragging) return;
      }

      handWasVisibleRef.current = true;

      const modalSession = pinchSessionRef.current;
      if (pinching && modalSession?.modalScrollStarted) {
        applyModalGestureScroll(modalSession, y);
      }

      if (!dragging) {
        const vpX = getViewportLocalX(x);
        const edgeThreshold = gestureSettingsApi.settingsRef.current.edgeThreshold;
        const viewportW = viewportWidthRef.current > 0 ? viewportWidthRef.current : 400;
        const nearEdge = vpX < edgeThreshold || vpX > viewportW - edgeThreshold;
        if (
          detailsOrderIdRef.current == null &&
          nearEdge &&
          ts - lastEdgeScrollMs >= 32
        ) {
          lastEdgeScrollMs = ts;
          gestureScrollEdge(x, { dragging: false });
        }
      }

      if (ts - lastCursorPaintMs >= 16) {
        lastCursorPaintMs = ts;
        paintNativeCursor(
          x,
          y,
          pinching,
          cachedDwellProgress,
          gestureSettingsApi.settingsRef.current
        );
      }

      if (!pinching && !dragging) {
        if (ts - lastLogicMs < 50) return;
      } else {
        const pinchEdge = pinching !== pinchPrevRef.current;
        if (!pinchEdge && ts - lastLogicMs < 16) return;
      }
      lastLogicMs = ts;

      processGesturePinch(x, y);

      if (!dragging) {
        cachedDwellProgress = processGestureDwell(x, y);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isGestureMode, gesture.tracking, gesture.cursorRef, gesture.pinchingRef, gesture.handVisibleRef]);

  useEffect(() => {
    if (!isGestureMode) {
      if (gestureBoundsRefreshTimerRef.current) {
        clearTimeout(gestureBoundsRefreshTimerRef.current);
        gestureBoundsRefreshTimerRef.current = null;
      }
      pinchPrevRef.current = false;
      pinchPickDoneRef.current = false;
      pinchSessionRef.current = null;
      dwellRef.current = { target: null, sinceMs: 0, anchorX: 0, anchorY: 0, armedAt: 0 };
      setGestureDraggedOrderId(null);
      setDetailsOrderId(null);
      modalScrollRef.current = null;
      return;
    }
    if (!isWeb && gesture.tracking) {
      refreshGestureCardBounds();
    }
  }, [isGestureMode, isWeb, gesture.tracking, refreshGestureCardBounds]);

  if ((isLoading || isFetching) && orders.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFEEE7",
          padding: 24,
          gap: 16,
        }}
      >
        <ActivityIndicator size="large" color="#A47032" />
        <Text style={{ color: "#103464", textAlign: "center" }}>
          Carregando pedidos… A primeira vez pode levar até 1–2 minutos.
        </Text>
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
          gap: 12,
        }}
      >
        <Text style={{ color: "#103464", textAlign: "center" }}>
          Erro ao carregar pedidos: {error?.message ?? "Tente novamente mais tarde."}
        </Text>
        <Text style={{ color: "#103464", textAlign: "center", fontSize: 13 }}>
          Confira se a API Java está rodando em http://localhost:8080 e aguarde até 2 min na
          primeira carga (muitos pedidos no banco).
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
    <>
      {!isWeb && GestureTracker ? (
        <GestureErrorBoundary onError={() => setInteractionMode(INTERACTION_MODES.TOUCH)}>
          <GestureTracker />
        </GestureErrorBoundary>
      ) : null}
      <View
        ref={boardRef}
        onLayout={measureBoardBounds}
        style={{ flex: 1, width: "100%", minHeight: 0, backgroundColor: "#FFEEE7" }}
        collapsable={false}
      >
      <View
        ref={gestureHeaderRef}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 8,
          gap: 8,
          zIndex: 1000,
          elevation: 1000,
          backgroundColor: "#FFEEE7",
        }}
        collapsable={false}
      >
        <Text style={{ color: "#4a2f14", fontWeight: "700" }}>Modo de interação</Text>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {isGestureMode ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setGestureSettingsOpen(true)}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              style={{
                minWidth: 48,
                minHeight: 48,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: "#A47032",
                backgroundColor: "#fff",
              }}
              accessibilityLabel="Configurações de gestos"
              accessibilityRole="button"
            >
              <Text style={{ color: "#4a2f14", fontWeight: "600", fontSize: 20 }}>⚙</Text>
            </TouchableOpacity>
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
            onLongPress={() => setGestureSettingsOpen(true)}
            delayLongPress={450}
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
              ? gesture.error
              : gesture.showPermissionPrompt
                ? "Toque em Permitir câmera para ativar o rastreamento de gestos."
                : gesture.tracking
                  ? detailsOrderId != null
                    ? "Modal aberto — pinça e arraste para rolar o conteúdo."
                    : gestureSettingsApi.settings.openDetailsWithGesture
                      ? "Aponte no card + pinça firme = arrastar. Entre cards = pinça vertical. Borda = scroll."
                      : "Pinça no card = arrastar. Solte a pinça na coluna desejada. Mão na borda da tela = scroll."
                  : gesture.permissionLoading
                    ? "Solicitando permissão da câmera…"
                    : "Preparando câmera e tracking… (toque continua funcionando). Segure Gestos p/ ajustes."}
          </Text>
        </View>
      )}
      <GestureCameraPermissionModal
        visible={Boolean(isGestureMode && !isWeb && gesture.showPermissionPrompt)}
        loading={Boolean(gesture.permissionLoading)}
        onAllow={gesture.requestCameraPermission}
        onDeny={() => {
          gesture.dismissPermissionPrompt?.();
          setInteractionMode(INTERACTION_MODES.TOUCH);
        }}
      />
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
        scrollEnabled={
          isWeb ? isGestureMode || !isDraggingCard : !isGestureMode && !isDraggingCard
        }
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
              ref={(node) => registerColumnRef(column.key, node)}
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
                columnKey={column.key}
                enableGestureScrollTarget={isGestureMode}
                onColumnScrollRef={registerColumnScrollRef}
                onColumnScrollAreaLayout={registerColumnScrollArea}
                onColumnScrollOffset={handleColumnScrollOffset}
              >
                {groupedOrders[column.key]?.map((order) => (
                  <DraggableOrderCard
                    key={order.id}
                    order={order}
                    columnIndex={index}
                    columnsLength={COLUMNS.length}
                    dragEnabled={dragEnabled && canPickOrderForKanban(order.status)}
                    onDrop={handleDrop}
                    onDragStateChange={handleDragStateChange}
                    onDragMove={handleDragMove}
                    getCurrentScrollX={() => scrollXRef.current}
                    onResolveDropTarget={resolveDropTarget}
                    onDragPreviewStart={handleDragPreviewStart}
                    onDragPreviewMove={handleDragPreviewMove}
                    onDragPreviewEnd={handleDragPreviewEnd}
                    isGestureMode={isGestureMode}
                    gestureDragActiveId={gestureDraggedOrderId}
                    onOpenDetails={() => setDetailsOrderId(order.id)}
                    onGestureCardLayout={registerGestureCardBounds}
                    onGestureDetailsLayout={registerGestureDetailsBounds}
                    onGestureCardRef={registerGestureCardRef}
                  />
                ))}
              </KanbanColumn>
            </View>
          ))}
        </View>
      </ScrollView>
      {dragPreview && isGestureMode && gestureDraggedOrderId != null && !isWeb ? (
        <Modal
          visible
          transparent
          animationType="none"
          statusBarTranslucent
          onRequestClose={() => {}}
        >
          <View pointerEvents="none" style={{ flex: 1 }}>
            <View
              ref={dragPreviewLayerRef}
              pointerEvents="none"
              style={{ position: "absolute", left: 0, top: 0 }}
            >
              <OrderCard
                order={dragPreview.order}
                deliveryDate={dragPreview.order.dataPrevisaoEntrega}
                orderId={dragPreview.order.id}
              />
            </View>
          </View>
        </Modal>
      ) : null}
      {dragPreview && (isWeb || !isGestureMode) ? (
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
      ) : null}
      <GestureSettingsPanel
        visible={gestureSettingsOpen}
        onClose={() => setGestureSettingsOpen(false)}
        settings={gestureSettingsApi.settings}
        onUpdateField={gestureSettingsApi.updateField}
        onApplyPreset={gestureSettingsApi.applyPreset}
        onResetDefaults={gestureSettingsApi.resetDefaults}
      />
      {isGestureMode && detailsOrderId != null && selectedOrderRaw ? (
        <Modal
          visible
          animationType="none"
          transparent
          onRequestClose={closeDetailsModal}
        >
          <OrderSummary
            onClose={closeDetailsModal}
            order={selectedOrderRaw}
            enableGestureCloseTargets
            onGestureScrollReady={handleModalGestureScrollReady}
            onGestureAreasLayout={handleModalGestureAreasLayout}
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
    </>
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
  gestureDragActiveId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onOpenDetails: PropTypes.func,
  onGestureCardLayout: PropTypes.func,
  onGestureDetailsLayout: PropTypes.func,
  onGestureCardRef: PropTypes.func,
};

DraggableOrderCard.defaultProps = {
  isGestureMode: false,
  gestureDragActiveId: null,
  onOpenDetails: undefined,
  onGestureCardLayout: undefined,
  onGestureDetailsLayout: undefined,
  onGestureCardRef: undefined,
};

