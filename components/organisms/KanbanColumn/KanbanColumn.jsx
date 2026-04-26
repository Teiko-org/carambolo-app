import PropTypes from "prop-types"
import { View, Text, ScrollView } from "react-native"
import styles from "./KanbanColumn.styles"

const KANBAN_COLUMN_HEIGHT = 560

const KanbanColumn = ({ title, children }) => {
    return (
        <View style={{ width: 280, height: KANBAN_COLUMN_HEIGHT, flexShrink: 0 }}>
            <View style={styles.category}>
                <Text style={styles.categoryText}>
                    {title}
                </Text>
            </View>

            <View style={styles.background}>
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={{ gap: 10 }}
                    showsVerticalScrollIndicator={false}
                >
                    {children}
                </ScrollView>
            </View>
        </View>
    )
}

KanbanColumn.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
}

export default KanbanColumn