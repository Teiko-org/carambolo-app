import { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from "react-native";
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from "../components/molecules/Map/Map";
import { useQuery } from "@tanstack/react-query";
import { getDeliveriesMap } from "../services/deliveryMapService";
import { getOrders } from "../services/orderKanbanService";
import OrderSummary from "../components/organisms/OrderSummary/OrderSummary";

async function geocodeDelivery(delivery) {
  if (delivery.latitude && delivery.longitude) {
    return { lat: delivery.latitude, lng: delivery.longitude };
  }

  const headers = { 'User-Agent': 'CarambolosApp/1.0' };
  const queries = [];

  if (delivery.logradouro && delivery.numero && delivery.cidade && delivery.estado) {
    queries.push(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1` +
      `&street=${encodeURIComponent(delivery.logradouro + ', ' + delivery.numero)}` +
      `&city=${encodeURIComponent(delivery.cidade)}` +
      `&state=${encodeURIComponent(delivery.estado)}` +
      `&country=Brazil`
    );
    queries.push(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=` +
      encodeURIComponent(`${delivery.logradouro}, ${delivery.numero}, ${delivery.cidade}, ${delivery.estado}, Brasil`)
    );
  } else if (delivery.enderecoCompleto) {
    const cleaned = delivery.enderecoCompleto
      .replace(/\.\s*.+$/, '')
      .replace(/\s*-\s*[A-Z]{2}$/, '')
      .trim();
    queries.push(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=` +
      encodeURIComponent(cleaned + ', Brasil')
    );
  }

  for (const url of queries) {
    try {
      const res = await fetch(url, { headers });
      const results = await res.json();
      if (results && results.length > 0) {
        return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
      }
    } catch (e) {
      console.warn('Geocoding request failed:', e);
    }
  }
  return null;
}

export default function DeliveriesMap() {
  const [date, setDate] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderSummaryOpen, setIsOrderSummaryOpen] = useState(false);
  const [focusedMarker, setFocusedMarker] = useState(null);
  const [resolvedCoords, setResolvedCoords] = useState({});
  const mapRef = useRef(null);
  const scrollRef = useRef(null);
  const focusedMarkerRef = useRef(null);

  const formattedDate = date.toISOString().split("T")[0];

  const { data: deliveries, isLoading, isError, refetch } = useQuery({
    queryKey: ["deliveriesMap", formattedDate],
    queryFn: () => getDeliveriesMap(formattedDate),
  });

  const { data: allOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  useEffect(() => {
    if (!deliveries || deliveries.length === 0) return;

    setResolvedCoords({});
    setFocusedMarker(null);

    let cancelled = false;
    (async () => {
      for (const delivery of deliveries) {
        if (cancelled) break;
        const key = delivery.resumoPedidoId ?? delivery.enderecoCompleto;
        const coords = await geocodeDelivery(delivery);
        if (!cancelled && coords) {
          setResolvedCoords(prev => ({ ...prev, [key]: coords }));
        }
        await new Promise(r => setTimeout(r, 1100));
      }
    })();

    return () => { cancelled = true; };
  }, [deliveries]);

  const handlePrevDay = () => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    setDate(prev);
    setFocusedMarker(null);
  };

  const handleNextDay = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    setDate(next);
    setFocusedMarker(null);
  };

  const handleFocusDelivery = async (delivery) => {
    if (!delivery.enderecoCompleto) return;

    const key = delivery.resumoPedidoId ?? delivery.enderecoCompleto;

    let lat = resolvedCoords[key]?.lat ?? delivery.latitude;
    let lng = resolvedCoords[key]?.lng ?? delivery.longitude;

    if (!lat || !lng) {
      const coords = await geocodeDelivery(delivery);
      if (coords) {
        lat = coords.lat;
        lng = coords.lng;
        setResolvedCoords(prev => ({ ...prev, [key]: coords }));
      }
    }

    if (!lat || !lng) return;

    if (mapRef.current?.animateToRegion) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setFocusedMarker({ lat, lng, delivery });
      mapRef.current.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
      setTimeout(() => {
        focusedMarkerRef.current?.showCallout();
      }, 1100);
      return;
    }

    if (mapRef.current?.focusMarker) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setTimeout(() => {
        mapRef.current?.focusMarker(lat, lng, delivery.nomeCliente, delivery.enderecoCompleto, delivery.status);
      }, 600);
    }
  };

  const handleViewOrder = (item) => {
    const matchingOrder = allOrders?.find(o => o.resumoPedidoId === item.resumoPedidoId);

    if (matchingOrder) {
      setSelectedOrder(matchingOrder);
    } else {
      setSelectedOrder({
        id: item.resumoPedidoId,
        nomeCliente: item.nomeCliente,
        telefoneCliente: item.telefoneCliente,
        observacao: item.observacoes || "Sem observações",
        tipoEntrega: "ENTREGA",
        dataPrevisaoEntrega: formattedDate,
        endereco: {
          logradouro: item.enderecoCompleto,
          cep: "",
          estado: "",
          cidade: "",
          bairro: "",
          numero: "",
          complemento: ""
        },
        bolo: item.tipoPedido === "BOLO" ? {
          tamanho: "N/A",
          formato: "N/A",
          massa: { sabor: "N/A" },
          recheioPedido: { sabor1: "N/A", sabor2: "N/A" }
        } : null
      });
    }
    setIsOrderSummaryOpen(true);
  };

  const initialRegion = {
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "CONCLUIDO": return { bg: "#D1FAE5", text: "#059669" };
      case "PAGO":      return { bg: "#DBEAFE", text: "#2563EB" };
      case "CANCELADO": return { bg: "#FEE2E2", text: "#DC2626" };
      default:          return { bg: "#FEF3C7", text: "#D97706" };
    }
  };

  const renderDeliveryItem = (item) => {
    const statusColors = getStatusColor(item.status);
    return (
      <View style={styles.card} key={item.resumoPedidoId?.toString() || item.enderecoCompleto}>
        <View style={styles.cardHeader}>
          <Text style={styles.clientName} numberOfLines={1} ellipsizeMode="tail">
            {item.nomeCliente}
          </Text>
          <View style={styles.badgesRow}>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{item.tipoPedido}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusText, { color: statusColors.text }]}>{item.status}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.phoneText}>📞 {item.telefoneCliente}</Text>
        <Text style={styles.addressText}>📍 {item.enderecoCompleto}</Text>

        <View style={styles.cardFooter}>
          <TouchableOpacity style={styles.detailsButton} onPress={() => handleViewOrder(item)}>
            <Text style={styles.detailsButtonText}>Visualizar Pedido</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.focusButton} onPress={() => handleFocusDelivery(item)}>
            <Text style={styles.focusButtonText}>Focar no Mapa</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView ref={scrollRef} style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevDay} style={styles.button}>
          <Text style={styles.buttonText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
        </Text>
        <TouchableOpacity onPress={handleNextDay} style={styles.button}>
          <Text style={styles.buttonText}>&gt;</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#A47032" />
          <Text style={styles.loadingText}>Carregando entregas...</Text>
        </View>
      )}

      {isError && (
        <View style={styles.center}>
          <Text style={styles.errorText}>Erro ao carregar entregas.</Text>
          <TouchableOpacity onPress={refetch} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !isError && (
        <View style={styles.contentContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={initialRegion}
            deliveries={deliveries}
            resolvedCoords={resolvedCoords}
          >
            {deliveries && deliveries.map((delivery) => {
              const key = delivery.resumoPedidoId ?? delivery.enderecoCompleto;
              const coords = resolvedCoords[key];
              if (!coords) return null;
              const isFocused = focusedMarker?.delivery.resumoPedidoId === delivery.resumoPedidoId;
              return (
                <Marker
                  key={key}
                  ref={isFocused ? focusedMarkerRef : null}
                  coordinate={{ latitude: coords.lat, longitude: coords.lng }}
                  pinColor={isFocused ? "#A47032" : "#103464"}
                >
                  <Callout>
                    <View style={styles.calloutContainer}>
                      <Text style={styles.calloutTitle}>{delivery.nomeCliente}</Text>
                      <Text style={styles.calloutText}>{delivery.enderecoCompleto}</Text>
                      <Text style={styles.calloutText}>📞 {delivery.telefoneCliente}</Text>
                      <Text style={styles.calloutText}>Tipo: {delivery.tipoPedido}</Text>
                      <Text style={styles.calloutText}>Status: {delivery.status}</Text>
                    </View>
                  </Callout>
                </Marker>
              );
            })}
          </MapView>

          <View style={styles.listSection}>
            <Text style={styles.listTitle}>
              Entregas Agendadas ({deliveries ? deliveries.length : 0})
            </Text>
            {deliveries && deliveries.length > 0 ? (
              deliveries.map((item) => renderDeliveryItem(item))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma entrega agendada para este dia.</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <Modal
        visible={isOrderSummaryOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOrderSummaryOpen(false)}
      >
        {selectedOrder && (
          <OrderSummary
            onClose={() => {
              setIsOrderSummaryOpen(false);
              setSelectedOrder(null);
            }}
            order={selectedOrder}
          />
        )}
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#103464",
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    borderColor: "#A47032",
    borderWidth: 2,
    marginTop: 10,
  },
  dateText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#A47032",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  contentContainer: {
    flexDirection: "column",
  },
  map: {
    width: "100%",
    height: 380,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#A47032",
  },
  listSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#A47032",
    marginBottom: 15,
  },
  listTitle: {
    color: "#103464",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#FFEEE7",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#A47032",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 5,
  },
  clientName: {
    color: "#103464",
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    minWidth: 120,
  },
  badgesRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  phoneText: {
    color: "#555",
    fontSize: 13,
    marginBottom: 4,
  },
  addressText: {
    color: "#333",
    fontSize: 13,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  typeBadge: {
    backgroundColor: "#103464",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  detailsButton: {
    backgroundColor: "#103464",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    minWidth: 110,
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  focusButton: {
    backgroundColor: "#A47032",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    minWidth: 110,
    alignItems: "center",
  },
  focusButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  center: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#A47032",
    fontWeight: "bold",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "bold",
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: "#A47032",
    padding: 10,
    borderRadius: 5,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  calloutContainer: {
    width: 250,
    padding: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 14,
    marginBottom: 2,
  },
});
