import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, Dimensions, Modal, TextInput, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MapPin, Star, Bed, Bath, Wifi, Coffee, Tv, Wind, Heart, Share2, Calendar, Users, X } from 'lucide-react-native';
import { useState } from 'react';
import { useProperty } from '@/contexts/PropertyContext';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { properties, addBooking } = useProperty();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  const property = properties.find(p => p.id === id) || properties[0];

  if (!property) {
    return (
      <View style={styles.container}>
        <Text>Property not found</Text>
      </View>
    );
  }

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Air Conditioning': Wind,
    'TV': Tv,
    'Coffee Maker': Coffee,
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut || !guests) {
      Alert.alert('Missing Information', 'Please fill in all booking details.');
      return;
    }

    const guestsNum = parseInt(guests);
    const totalPrice = property.price * 3;

    addBooking({
      propertyId: property.id,
      propertyName: property.name,
      checkIn,
      checkOut,
      guests: guestsNum,
      totalPrice,
    });

    Alert.alert(
      'Booking Confirmed!',
      `Your booking at ${property.name} has been confirmed.\n\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guestsNum}\nTotal: $${totalPrice}`,
      [{ text: 'OK', onPress: () => setShowBookingModal(false) }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            scrollEventThrottle={16}>
            {property.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.propertyImage} />
            ))}
          </ScrollView>

          <View style={styles.imageIndicator}>
            {property.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentImageIndex === index && styles.indicatorActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}>
            <ArrowLeft color="#1e293b" size={24} />
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setIsFavorite(!isFavorite)}
              activeOpacity={0.8}>
              <Heart
                color={isFavorite ? '#ef4444' : '#1e293b'}
                size={22}
                fill={isFavorite ? '#ef4444' : 'none'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <Share2 color="#1e293b" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <View style={styles.locationRow}>
                <MapPin color="#64748b" size={16} />
                <Text style={styles.locationText}>{property.city}, {property.state}</Text>
              </View>
            </View>
            {property.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Star color="#fbbf24" size={20} fill="#fbbf24" />
                <Text style={styles.ratingText}>{property.rating}</Text>
                <Text style={styles.reviewsText}>({property.reviews})</Text>
              </View>
            )}
          </View>

          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{property.type === 'hotel' ? 'Hotel' : 'House'}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Bed color="#475569" size={24} />
                </View>
                <Text style={styles.detailValue}>{property.bedrooms}</Text>
                <Text style={styles.detailLabel}>Bedrooms</Text>
              </View>
              <View style={styles.detailItem}>
                <View style={styles.detailIconContainer}>
                  <Bath color="#475569" size={24} />
                </View>
                <Text style={styles.detailValue}>{property.bathrooms}</Text>
                <Text style={styles.detailLabel}>Bathrooms</Text>
              </View>
            </View>
          </View>

          {property.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>{property.description}</Text>
              <Text style={styles.address}>{property.address}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity, index) => {
                const IconComponent = amenityIcons[amenity] || Wifi;
                return (
                  <View key={index} style={styles.amenityItem}>
                    <View style={styles.amenityIcon}>
                      <IconComponent color="#475569" size={20} />
                    </View>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hosted by</Text>
            <View style={styles.hostCard}>
              <Image source={{ uri: property.hostImage }} style={styles.hostImage} />
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>{property.host}</Text>
                <Text style={styles.hostLabel}>Property Owner</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price per night</Text>
          <Text style={styles.price}>${property.price}</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => setShowBookingModal(true)}
          activeOpacity={0.8}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowBookingModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book {property.name}</Text>
              <TouchableOpacity
                onPress={() => setShowBookingModal(false)}
                activeOpacity={0.7}>
                <X color="#1e293b" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.modalInputContainer}>
                <Calendar color="#475569" size={20} style={styles.modalInputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Check-in (MM/DD/YYYY)"
                  placeholderTextColor="#999"
                  value={checkIn}
                  onChangeText={setCheckIn}
                />
              </View>

              <View style={styles.modalInputContainer}>
                <Calendar color="#475569" size={20} style={styles.modalInputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Check-out (MM/DD/YYYY)"
                  placeholderTextColor="#999"
                  value={checkOut}
                  onChangeText={setCheckOut}
                />
              </View>

              <View style={styles.modalInputContainer}>
                <Users color="#475569" size={20} style={styles.modalInputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Number of guests"
                  placeholderTextColor="#999"
                  value={guests}
                  onChangeText={setGuests}
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.priceBreakdown}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceRowLabel}>${property.price} x 3 nights</Text>
                  <Text style={styles.priceRowValue}>${property.price * 3}</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={styles.priceTotalLabel}>Total</Text>
                  <Text style={styles.priceTotalValue}>${property.price * 3}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalBookButton}
                onPress={handleBooking}
                activeOpacity={0.8}>
                <Text style={styles.modalBookButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: width,
    height: 360,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  propertyName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 16,
    color: '#64748b',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  reviewsText: {
    fontSize: 14,
    color: '#92400e',
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 24,
  },
  typeTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  detailValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 12,
  },
  address: {
    fontSize: 14,
    color: '#64748b',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  amenityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  hostImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  hostLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  bottomPadding: {
    height: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  bookButton: {
    backgroundColor: '#4a7ba7',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#4a7ba7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalBody: {
    padding: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalInputIcon: {
    marginRight: 12,
  },
  modalInput: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#333',
  },
  priceBreakdown: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceRowLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  priceRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  priceTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  priceTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  modalBookButton: {
    backgroundColor: '#4a7ba7',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4a7ba7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalBookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
