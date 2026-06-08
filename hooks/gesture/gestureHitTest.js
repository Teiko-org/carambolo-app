export function pointInRect(x, y, rect) {
  if (!rect) return false;
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
}

export function createGestureHitTest() {
  const orders = new Map();
  const detailsTriggers = new Map();
  const columnScrollAreas = new Map();
  const columnBounds = new Map();
  const modalCloseAreas = [];
  let modalSheetRect = null;

  return {
    setOrderBounds(orderId, bounds) {
      if (bounds) orders.set(String(orderId), bounds);
      else orders.delete(String(orderId));
    },
    setDetailsTriggerBounds(orderId, bounds) {
      if (bounds) detailsTriggers.set(String(orderId), bounds);
      else detailsTriggers.delete(String(orderId));
    },
    setColumnBounds(columnKey, bounds) {
      if (bounds) columnBounds.set(columnKey, bounds);
      else columnBounds.delete(columnKey);
    },
    setColumnScrollBounds(columnKey, bounds) {
      if (bounds) columnScrollAreas.set(columnKey, bounds);
      else columnScrollAreas.delete(columnKey);
    },
    setModalSheetBounds(bounds) {
      modalSheetRect = bounds;
    },
    setModalCloseBounds(bounds) {
      modalCloseAreas.length = 0;
      if (bounds) modalCloseAreas.push(bounds);
    },
    findOrderIdAtPoint(x, y) {
      let bestId = null;
      let smallestArea = Infinity;
      for (const [id, rect] of orders.entries()) {
        if (!pointInRect(x, y, rect)) continue;
        const area = rect.width * rect.height;
        if (area < smallestArea) {
          smallestArea = area;
          bestId = Number(id);
        }
      }
      return bestId;
    },
    findDetailsTriggerOrderId(x, y) {
      let bestId = null;
      let smallestArea = Infinity;
      for (const [id, rect] of detailsTriggers.entries()) {
        if (!pointInRect(x, y, rect)) continue;
        const area = rect.width * rect.height;
        if (area < smallestArea) {
          smallestArea = area;
          bestId = Number(id);
        }
      }
      return bestId;
    },
    findColumnKeyAtPoint(x, y) {
      for (const [key, rect] of columnBounds.entries()) {
        if (pointInRect(x, y, rect)) return key;
      }
      let closestKey = null;
      let closestDist = Infinity;
      for (const [key, rect] of columnBounds.entries()) {
        const cx = rect.x + rect.width / 2;
        const cy = rect.y + rect.height / 2;
        const dist = Math.hypot(x - cx, y - cy);
        if (dist < closestDist) {
          closestDist = dist;
          closestKey = key;
        }
      }
      return closestKey;
    },
    isColumnScrollTarget(x, y) {
      for (const rect of columnScrollAreas.values()) {
        if (pointInRect(x, y, rect)) return true;
      }
      return false;
    },
    getColumnScrollKeyAtPoint(x, y) {
      for (const [key, rect] of columnScrollAreas.entries()) {
        if (pointInRect(x, y, rect)) return key;
      }
      return null;
    },
    isModalSheetTarget(x, y) {
      return pointInRect(x, y, modalSheetRect);
    },
    isModalCloseTarget(x, y) {
      return modalCloseAreas.some((rect) => pointInRect(x, y, rect));
    },
    clear() {
      orders.clear();
      detailsTriggers.clear();
      columnScrollAreas.clear();
      columnBounds.clear();
      modalCloseAreas.length = 0;
      modalSheetRect = null;
    },
  };
}

export function measureViewInWindow(viewRef, callback) {
  if (!viewRef?.measureInWindow) return;
  viewRef.measureInWindow((x, y, width, height) => {
    callback({ x, y, width, height });
  });
}
