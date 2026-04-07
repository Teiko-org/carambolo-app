import PropTypes from "prop-types"
import { ScrollView, Text, View } from "react-native"
import styles from "./DashMostOrderedContainer.styles"
import MostOrderedCard from "../../molecules/MostOrderedCard/MostOrderedCard"
import ChipFilter from "../../atoms/ChipFilter/ChipFilter"
import { useState } from "react"


const DashMostOrderedContainer = ({
    title,
    subtitle,
    orders,
}) => {
    const [selectedChip, setSelectedChip] = useState('ALL')

    const handleSelectChip = (selectedChipTitle) => {
        setSelectedChip(selectedChipTitle)
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>
                    {title}
                </Text>
                <Text style={styles.headerSubtitle}>
                    {subtitle}
                </Text>
                <View style={styles.filtersContainer}>
                    <ChipFilter
                        text='Todos'
                        selected={selectedChip === 'ALL'}
                        onPress={() => handleSelectChip('ALL')}
                    />
                    <ChipFilter
                        text='Carambolos'
                        selected={selectedChip === 'CARAMBOLOS'}
                        onPress={() => handleSelectChip('CARAMBOLOS')}
                    />
                    <ChipFilter
                        text='Fornadas'
                        selected={selectedChip === 'FORNADAS'}
                        onPress={() => handleSelectChip('FORNADAS')}
                    />
                </View>
            </View>
            <ScrollView style={styles.cardsContainer}>
                {orders.map((order) => (
                    <MostOrderedCard
                        key={order.id ?? order.title}
                        cardTitle={order.title}
                        quantity={order.quantity}
                        amount={order.amount}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const selectOption = PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
})

const orderItem = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
})

DashMostOrderedContainer.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    filterOptions: PropTypes.arrayOf(selectOption),
    orders: PropTypes.arrayOf(orderItem).isRequired,
}

export default DashMostOrderedContainer
