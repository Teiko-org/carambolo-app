import PropTypes from "prop-types"
import { ScrollView, Text, View } from "react-native"
import styles from "./DashMostOrderedContainer.styles"
import MostOrderedCard from "../../molecules/MostOrderedCard/MostOrderedCard"
import ChipFilter from "../../atoms/ChipFilter/ChipFilter"
import { useMemo, useState } from "react"
import { useBolosMaisPedidos, useProdutosFornadasMaisPedidos } from "../../../hooks/useDashboard"


const DashMostOrderedContainer = ({
    title,
    subtitle,
}) => {
    const [selectedChip, setSelectedChip] = useState('ALL')
    const shouldLoadBolos = selectedChip === "ALL" || selectedChip === "CARAMBOLOS"
    const shouldLoadFornadas = selectedChip === "ALL" || selectedChip === "FORNADAS"

    const { data: bolosData, isLoading: isLoadingBolos } = useBolosMaisPedidos({
        enabled: shouldLoadBolos,
    })
    const { data: fornadasData, isLoading: isLoadingFornadas } = useProdutosFornadasMaisPedidos({
        enabled: shouldLoadFornadas,
    })

    const handleSelectChip = (selectedChipTitle) => {
        setSelectedChip(selectedChipTitle)
    }

    const normalizeBolos = (items = []) => {
        return items.map((item) => ({
            id: `bolo-${item?.boloId ?? item?.nome}`,
            title: item?.nome ?? "Bolo",
            quantity: Number(item?.quantidade ?? 0),
            amount: Number(item?.valorTotal ?? 0),
        }))
    }

    const normalizeFornadas = (items = []) => {
        return items.map((item) => ({
            id: `fornada-${item?.produtoId ?? item?.nomeProduto}`,
            title: item?.nomeProduto ?? "Produto",
            quantity: Number(item?.quantidadeTotal ?? 0),
            amount: Number(item?.valorTotal ?? 0),
        }))
    }

    const displayedOrders = useMemo(() => {
        if (selectedChip === "CARAMBOLOS") {
            return normalizeBolos(Array.isArray(bolosData) ? bolosData : [])
        }

        if (selectedChip === "FORNADAS") {
            return normalizeFornadas(Array.isArray(fornadasData) ? fornadasData : [])
        }

        return [
            ...normalizeBolos(Array.isArray(bolosData) ? bolosData : []),
            ...normalizeFornadas(Array.isArray(fornadasData) ? fornadasData : []),
        ].sort((a, b) => b.quantity - a.quantity)
    }, [selectedChip, bolosData, fornadasData])

    const isLoading = (selectedChip === "ALL" && (isLoadingBolos || isLoadingFornadas))
        || (selectedChip === "CARAMBOLOS" && isLoadingBolos)
        || (selectedChip === "FORNADAS" && isLoadingFornadas)

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
                {isLoading ? (
                    <Text>Carregando produtos mais pedidos...</Text>
                ) : displayedOrders.length === 0 ? (
                    <Text>Nenhum produto encontrado.</Text>
                ) : displayedOrders.map((order) => (
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
    orders: PropTypes.arrayOf(orderItem),
}

export default DashMostOrderedContainer
