import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Star,
  Bed,
  Bath,
  Wifi,
  Coffee,
  Tv,
  Wind,
  Heart,
  Share2,
  Calendar,
  Users,
  X,
  Check,
  Home,
  Building2,
} from 'lucide-react-native';
import { useProperty } from '@/contexts/PropertyContext';

const { width } = Dimensions.get('window');

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { properties } = useProperty();
  
  // Find property by ID or use mock data
  const property = properties.find(p => p.id === id) || {
    id: id || '1',
    name: 'Luxury Beachfront Villa',
    type: 'hotel',
    city: 'Miami',
    state: 'Florida',
    address: '123 Ocean Drive, Miami Beach, FL 33139',
    rating: 4.8,
    reviews: 128,
    bedrooms: 4,
    bathrooms: 3,
    price: 450,
    description: 'Experience luxury living in this stunning beachfront villa. With panoramic ocean views, modern amenities, and direct beach access, this property offers the perfect getaway. The spacious interior features high-end finishes, a gourmet kitchen, and floor-to-ceiling windows that flood the space with natural light.',
    amenities: ['WiFi', 'Air Conditioning', 'TV', 'Coffee Maker'],
    host: 'Sarah Johnson',
    hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    ],
  };

  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [activeTab, setActiveTab] = useState<'details' | 'amenities' | 'host'>('details');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Air Conditioning': Wind,
    'TV': Tv,
    'Coffee Maker': Coffee,
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      Alert.alert('Validation Error', 'Please fill in check-in and check-out dates');
      return;
    }
    setShowBookingModal(false);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      router.back();
    }, 3000);
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return property.price * 3;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return property.price * (nights || 3);
  };

  const nights = checkIn && checkOut 
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
    : 3;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: property.images[currentImageIndex] || property.images[0] }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            
            {/* Image Navigation Dots */}
            <View style={styles.imageIndicator}>
              {property.images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  style={[
                    styles.indicator,
                    currentImageIndex === index && styles.indicatorActive,
                  ]}
                />
              ))}
            </View>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#1e293b" />
            </TouchableOpacity>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  isFavorite && { backgroundColor: '#fee2e2' },
                ]}
                onPress={() => setIsFavorite(!isFavorite)}>
                <Heart
                  size={22}
                  color={isFavorite ? '#ef4444' : '#1e293b'}
                  fill={isFavorite ? '#ef4444' : 'none'}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={22} color="#1e293b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Thumbnail Gallery */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailGallery}
            contentContainerStyle={styles.thumbnailGalleryContent}
          >
            {property.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setCurrentImageIndex(index)}
                style={[
                  styles.thumbnail,
                  currentImageIndex === index && styles.thumbnailActive,
                ]}>
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Section */}
        <View style={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.propertyName}>{property.name}</Text>
              <View style={styles.locationRow}>
                <MapPin size={18} color="#64748b" />
                <Text style={styles.locationText}>{property.city}, {property.state}</Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={20} color="#fbbf24" fill="#fbbf24" />
              <Text style={styles.ratingText}>{property.rating}</Text>
              <Text style={styles.reviewsText}>({property.reviews})</Text>
            </View>
          </View>

          {/* Property Type Tag */}
          <View style={styles.typeTag}>
            {property.type === 'hotel' ? (
              <Building2 size={16} color="#1e40af" />
            ) : (
              <Home size={16} color="#1e40af" />
            )}
            <Text style={styles.typeTagText}>{property.type === 'hotel' ? 'Hotel' : 'House'}</Text>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Bed size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{property.bedrooms}</Text>
              <Text style={styles.statLabel}>Bedrooms</Text>
            </View>
            <View style={styles.statCard}>
              <Bath size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{property.bathrooms}</Text>
              <Text style={styles.statLabel}>Bathrooms</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{property.bedrooms * 2}</Text>
              <Text style={styles.statLabel}>Guests</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'details' && styles.tabActive]}
              onPress={() => setActiveTab('details')}>
              <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'amenities' && styles.tabActive]}
              onPress={() => setActiveTab('amenities')}>
              <Text style={[styles.tabText, activeTab === 'amenities' && styles.tabTextActive]}>
                Amenities
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'host' && styles.tabActive]}
              onPress={() => setActiveTab('host')}>
              <Text style={[styles.tabText, activeTab === 'host' && styles.tabTextActive]}>
                Host
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View style={styles.tabContent}>
            {activeTab === 'details' && (
              <View style={styles.tabContentInner}>
                <Text style={styles.sectionTitle}>About this property</Text>
                <Text style={styles.description}>{property.description}</Text>
                <View style={styles.addressCard}>
                  <MapPin size={20} color="#3b82f6" />
                  <Text style={styles.address}>{property.address}</Text>
                </View>
              </View>
            )}

            {activeTab === 'amenities' && (
              <View style={styles.tabContentInner}>
                <Text style={styles.sectionTitle}>Available amenities</Text>
                <View style={styles.amenitiesGrid}>
                  {property.amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || Wifi;
                    return (
                      <View key={index} style={styles.amenityCard}>
                        <View style={styles.amenityIcon}>
                          <IconComponent size={24} color="#3b82f6" />
                        </View>
                        <Text style={styles.amenityText}>{amenity}</Text>
                        <Check size={18} color="#10b981" />
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {activeTab === 'host' && (
              <View style={styles.tabContentInner}>
                <Text style={styles.sectionTitle}>Meet your host</Text>
                <View style={styles.hostCard}>
                  <Image source={{ uri: property.hostImage }} style={styles.hostImage} />
                  <View style={styles.hostInfo}>
                    <Text style={styles.hostName}>{property.host}</Text>
                    <Text style={styles.hostLabel}>Property Owner</Text>
                    <View style={styles.hostStats}>
                      <View style={styles.hostStat}>
                        <Star size={16} color="#fbbf24" fill="#fbbf24" />
                        <Text style={styles.hostStatText}>4.9 rating</Text>
                      </View>
                      <View style={styles.hostStat}>
                        <Home size={16} color="#3b82f6" />
                        <Text style={styles.hostStatText}>12 properties</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>From</Text>
          <Text style={styles.price}>
            ₹{property.price}
            <Text style={styles.priceNight}>/night</Text>
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={() => setShowBookingModal(true)}
          activeOpacity={0.8}>
          <Calendar size={20} color="#ffffff" />
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBookingModal(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.modalOverlayTouch}
            activeOpacity={1}
            onPress={() => setShowBookingModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Your Booking</Text>
              <TouchableOpacity 
                style={styles.modalClose}
                onPress={() => setShowBookingModal(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Check-in Date</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#64748b" />
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={checkIn}
                    onChangeText={setCheckIn}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Check-out Date</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#64748b" />
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={checkOut}
                    onChangeText={setCheckOut}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Number of Guests</Text>
                <View style={styles.inputContainer}>
                  <Users size={20} color="#64748b" />
                  <TextInput
                    style={styles.input}
                    value={guests}
                    onChangeText={setGuests}
                    keyboardType="number-pad"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.priceBreakdown}>
                <Text style={styles.breakdownTitle}>Price Breakdown</Text>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>₹{property.price} × {nights} nights</Text>
                  <Text style={styles.breakdownValue}>₹{calculateTotal()}</Text>
                </View>
                <View style={styles.breakdownRow}>
                  <Text style={styles.breakdownLabel}>Service fee</Text>
                  <Text style={styles.breakdownValue}>₹50</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.breakdownRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>₹{calculateTotal() + 50}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.confirmButton} onPress={handleBooking}>
                <Check size={20} color="#ffffff" />
                <Text style={styles.confirmButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.successOverlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Check size={48} color="#ffffff" />
            </View>
            <Text style={styles.successTitle}>Booking Confirmed!</Text>
            <Text style={styles.successText}>
              Your reservation at {property.name} has been confirmed.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    backgroundColor: '#ffffff',
    paddingBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 400,
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    transform: [{ translateX: -50 }],
    flexDirection: 'row',
    gap: 8,
    zIndex: 2,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  indicatorActive: {
    width: 32,
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    zIndex: 3,
  },
  actionButtons: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    zIndex: 3,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  thumbnailGallery: {
    marginTop: 12,
  },
  thumbnailGalleryContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  thumbnail: {
    width: 100,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#3b82f6',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 16,
  },
  headerLeft: {
    flex: 1,
  },
  propertyName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    color: '#64748b',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#92400e',
  },
  reviewsText: {
    fontSize: 14,
    color: '#92400e',
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#dbeafe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  typeTagText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    minHeight: 300,
  },
  tabContentInner: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#475569',
    marginBottom: 20,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  address: {
    fontSize: 14,
    color: '#1e40af',
    fontWeight: '500',
    flex: 1,
  },
  amenitiesGrid: {
    gap: 12,
  },
  amenityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  amenityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  hostImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  hostInfo: {
    flex: 1,
    gap: 8,
  },
  hostName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  hostLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  hostStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  hostStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hostStatText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 10,
  },
  priceContainer: {
    gap: 4,
  },
  priceLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10b981',
  },
  priceNight: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlayTouch: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalClose: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1e293b',
  },
  priceBreakdown: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    maxWidth: 400,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});
