import PropTypes from "prop-types"
import { useCallback, useRef, useState } from "react"
import { View, Text, ScrollView, Platform } from "react-native"
import styles from "./KanbanColumn.styles"

export const KANBAN_COLUMN_WIDTH = 280;
export const KANBAN_COLUMN_HEIGHT = 560;

const KanbanColumn = ({
    title,
    children,
    scrollEnabled = true,
    enableGestureScrollTarget = false,
}) => {
    const viewportHeightRef = useRef(0);
    const [scrollHint, setScrollHint] = useState({ canScrollDown: false, canScrollUp: false });

    const updateScrollHint = useCallback((offsetY, contentHeight, layoutHeight) => {
        const viewport = layoutHeight || viewportHeightRef.current;
        if (!viewport || !contentHeight) return;
        const maxScroll = Math.max(0, contentHeight - viewport);
        const canScrollDown = maxScroll > 8 && offsetY < maxScroll - 8;
        const canScrollUp = offsetY > 8;
        setScrollHint((prev) =>
            prev.canScrollDown === canScrollDown && prev.canScrollUp === canScrollUp
                ? prev
                : { canScrollDown, canScrollUp }
        );
    }, []);

    const columnScrollProps = enableGestureScrollTarget
        ? { dataSet: { columnScroll: "true" } }
        : {};

    return (
        <View
            style={{
                width: KANBAN_COLUMN_WIDTH,
                height: KANBAN_COLUMN_HEIGHT,
                flexShrink: 0,
            }}
        >
            <View style={styles.category}>
                <Text style={styles.categoryText}>
                    {title}
                </Text>
            </View>

            <View style={styles.background}>
                <ScrollView
                    {...columnScrollProps}
                    style={styles.container}
                    contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
                    showsVerticalScrollIndicator
                    scrollEnabled={scrollEnabled}
                    scrollEventThrottle={32}
                    onLayout={(event) => {
                        const layoutHeight = event.nativeEvent.layout.height;
                        viewportHeightRef.current = layoutHeight;
                    }}
                    onContentSizeChange={(_, contentHeight) => {
                        updateScrollHint(0, contentHeight, viewportHeightRef.current);
                    }}
                    onScroll={(event) => {
                        const { contentOffset, contentSize, layoutMeasurement } =
                            event.nativeEvent;
                        updateScrollHint(
                            contentOffset.y,
                            contentSize.height,
                            layoutMeasurement.height
                        );
                    }}
                >
                    {children}
                </ScrollView>

                {scrollHint.canScrollDown ? (
                    <View pointerEvents="none" style={styles.scrollFadeBottom}>
                        <Text style={styles.scrollHintText}>↓ mais pedidos</Text>
                    </View>
                ) : null}

                {scrollHint.canScrollUp && Platform.OS === "web" ? (
                    <View pointerEvents="none" style={styles.scrollFadeTop} />
                ) : null}
            </View>
        </View>
    )
}

KanbanColumn.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
    scrollEnabled: PropTypes.bool,
    enableGestureScrollTarget: PropTypes.bool,
}

KanbanColumn.defaultProps = {
    scrollEnabled: true,
    enableGestureScrollTarget: false,
}

export default KanbanColumn
