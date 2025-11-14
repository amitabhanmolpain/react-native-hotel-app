import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/app/supabaseClient';
import { DatePickerModal } from '@/components/DatePickerModal';
import { Toast } from '@/components/Toast';

const { width } = Dimensions.get('window');

interface Property {
  id: string;
  name: string;
  type: 'hotel' | 'house';
  city: string;
  state: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  bedrooms: number;
  bathrooms: number;
  guests: number | null;
  description: string;
  images: string[];
  amenities: string;
  owner_name: string;
  status: string;
}

export default function PropertyDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [activeTab, setActiveTab] = useState<'details' | 'amenities' | 'host'>('details');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching property:', error);
        Alert.alert('Error', 'Failed to load property details');
        return;
      }

      if (data) {
        setProperty(data);
      } else {
        Alert.alert('Not Found', 'Property not found');
        router.back();
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const amenitiesList = property?.amenities ? property.amenities.split(',').map(a => a.trim()) : [];
  const maxGuests = property?.guests || (property?.bedrooms ? property.bedrooms * 2 : 2);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading property...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!property) {
    return null;
  }

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Air Conditioning': Wind,
    'TV': Tv,
    'Coffee Maker': Coffee,
  };

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      setToastMessage('Please fill in check-in and check-out dates');
      setToastType('error');
      setToastVisible(true);
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      setToastMessage('Check-out date must be after check-in date');
      setToastType('error');
      setToastVisible(true);
      return;
    }

    await saveBooking();
    setShowBookingModal(false);
    setToastMessage('Booking confirmed successfully!');
    setToastType('success');
    setToastVisible(true);

    setTimeout(() => {
      setCheckIn('');
      setCheckOut('');
      setGuests('2');
      router.back();
    }, 2000);
  };

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return property.price * 3;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    return property.price * (nights || 3);
  };

  const saveBooking = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to book');
        return;
      }

      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nightsCount = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

      const { error } = await supabase
        .from('bookings')
        .insert([{
          property_id: property.id,
          user_id: user.id,
          check_in: checkIn,
          check_out: checkOut,
          guests: parseInt(guests),
          total_cost: calculateTotal() + 50,
          nights: nightsCount,
          status: 'confirmed'
        }]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving booking:', error);
    }
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
              source={{ uri: property.images && property.images.length > 0 ? property.images[currentImageIndex] || property.images[0] : 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800' }}
              style={styles.mainImage}
              resizeMode="cover"
            />
            
            {/* Image Navigation Dots */}
            {property.images && property.images.length > 1 && (
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
            )}

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
          {property.images && property.images.length > 1 && (
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
          )}
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
            {property.rating > 0 && (
              <View style={styles.ratingContainer}>
                <Star size={20} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.ratingText}>{property.rating}</Text>
                <Text style={styles.reviewsText}>({property.reviews})</Text>
              </View>
            )}
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
              <Text style={styles.statValue}>{maxGuests}</Text>
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
                <Text style={styles.description}>{property.description || 'No description available.'}</Text>
                <View style={styles.addressCard}>
                  <MapPin size={20} color="#3b82f6" />
                  <Text style={styles.address}>{property.location}</Text>
                </View>
              </View>
            )}

            {activeTab === 'amenities' && (
              <View style={styles.tabContentInner}>
                <Text style={styles.sectionTitle}>Available amenities</Text>
                {amenitiesList.length > 0 ? (
                  <View style={styles.amenitiesGrid}>
                    {amenitiesList.map((amenity, index) => {
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
                ) : (
                  <Text style={styles.description}>No amenities listed</Text>
                )}
              </View>
            )}

            {activeTab === 'host' && (
              <View style={styles.tabContentInner}>
                <Text style={styles.sectionTitle}>Meet your host</Text>
                <View style={styles.hostCard}>
                  <Image source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' }} style={styles.hostImage} />
                  <View style={styles.hostInfo}>
                    <Text style={styles.hostName}>{property.owner_name || 'Property Owner'}</Text>
                    <Text style={styles.hostLabel}>Property Owner</Text>
                    <View style={styles.hostStats}>
                      <View style={styles.hostStat}>
                        <Star size={16} color="#fbbf24" fill="#fbbf24" />
                        <Text style={styles.hostStatText}>Verified Owner</Text>
                      </View>
                      <View style={styles.hostStat}>
                        <Home size={16} color="#3b82f6" />
                        <Text style={styles.hostStatText}>Property listing</Text>
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
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => setShowCheckInPicker(true)}
                >
                  <Calendar size={20} color="#64748b" />
                  <Text style={[styles.input, { color: checkIn ? '#1e293b' : '#9ca3af' }]}>
                    {checkIn || 'Select check-in date'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Check-out Date</Text>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => {
                    if (!checkIn) {
                      setToastMessage('Please select check-in date first');
                      setToastType('error');
                      setToastVisible(true);
                      return;
                    }
                    setShowCheckOutPicker(true);
                  }}
                  disabled={!checkIn}
                >
                  <Calendar size={20} color={checkIn ? '#64748b' : '#cbd5e1'} />
                  <Text style={[styles.input, { color: checkOut ? '#1e293b' : checkIn ? '#9ca3af' : '#cbd5e1' }]}>
                    {checkOut || 'Select check-out date'}
                  </Text>
                </TouchableOpacity>
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

      {/* Date Pickers */}
      <DatePickerModal
        visible={showCheckInPicker}
        onClose={() => setShowCheckInPicker(false)}
        onSelectDate={(date) => {
          setCheckIn(date);
          setShowCheckInPicker(false);
        }}
        minDate={new Date()}
      />

      <DatePickerModal
        visible={showCheckOutPicker}
        onClose={() => setShowCheckOutPicker(false)}
        onSelectDate={(date) => {
          setCheckOut(date);
          setShowCheckOutPicker(false);
        }}
        minDate={checkIn ? new Date(checkIn) : new Date()}
      />

      {/* Toast Notification */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        duration={2000}
        onHide={() => setToastVisible(false)}
      />
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
    paddingVertical: 4,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 16,
  },
});
