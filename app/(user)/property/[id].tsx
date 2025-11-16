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

  if (!property) return null;

  const amenityIcons: { [key: string]: any } = {
    "WiFi": Wifi,
    "Air Conditioning": Wind,
    "TV": Tv,
    "Coffee Maker": Coffee,
  };

  // ------------------------------
  // GALLERY SECTION — NEON VERSION
  // ------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* TOP IMAGE SECTION - NEON STYLE */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>

            {/* MAIN IMAGE */}
            <Image
              source={{
                uri:
                  property.images?.[currentImageIndex] ??
                  'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
              }}
              style={styles.mainImage}
            />

            {/* DARK OVERLAY FOR NEON THEME */}
            <View style={styles.imageDarkOverlay} />

            {/* NEON BACK BUTTON */}
            <TouchableOpacity style={styles.backButtonNeon} onPress={() => router.back()}>
              <ArrowLeft size={22} color="#ffffff" />
            </TouchableOpacity>

            {/* GLASS ACTION BUTTONS */}
            <View style={styles.actionButtonsNeon}>
              <TouchableOpacity
                style={[
                  styles.actionButtonNeon,
                  isFavorite && { backgroundColor: "rgba(239,68,68,0.4)", borderColor: "#ef4444" }
                ]}
                onPress={() => setIsFavorite(!isFavorite)}
              >
                <Heart
                  size={22}
                  color={isFavorite ? "#ff6b6b" : "#ffffff"}
                  fill={isFavorite ? "#ff6b6b" : "none"}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButtonNeon}>
                <Share2 size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* NEON IMAGE DOT INDICATOR */}
            {property.images && property.images.length > 1 && (
              <View style={styles.imageIndicatorNeon}>
                {property.images.map((_, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setCurrentImageIndex(index)}
                    style={[
                      styles.indicatorNeon,
                      currentImageIndex === index && styles.indicatorNeonActive,
                    ]}
                  />
                ))}
              </View>
            )}
          </View>

          {/* THUMBNAIL STRIP — GLASS + NEON BORDER */}
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
                    styles.thumbnailNeon,
                    currentImageIndex === index && styles.thumbnailNeonActive,
                  ]}
                >
                  <Image source={{ uri: image }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
        {/* CONTENT SECTION - NEON */}
        <View style={styles.scrollContent}>

          {/* HEADER SECTION */}
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.propertyNameNeon}>{property.name}</Text>

              <View style={styles.locationRowNeon}>
                <MapPin size={18} color="#60a5fa" />
                <Text style={styles.locationTextNeon}>
                  {property.city}, {property.state}
                </Text>
              </View>
            </View>

            {property.rating > 0 && (
              <View style={styles.ratingCardNeon}>
                <Star size={18} color="#facc15" fill="#facc15" />
                <Text style={styles.ratingNumberNeon}>{property.rating}</Text>
                <Text style={styles.ratingReviewsNeon}>({property.reviews})</Text>
              </View>
            )}
          </View>

          {/* TYPE TAG */}
          <View style={styles.typeTagNeon}>
            {property.type === "hotel" ? (
              <Building2 size={18} color="#3b82f6" />
            ) : (
              <Home size={18} color="#3b82f6" />
            )}
            <Text style={styles.typeTagTextNeon}>
              {property.type === "hotel" ? "Hotel" : "House"}
            </Text>
          </View>

          {/* QUICK STATS */}
          <View style={styles.statsContainerNeon}>
            <View style={styles.statCardNeon}>
              <Bed size={24} color="#3b82f6" />
              <Text style={styles.statValueNeon}>{property.bedrooms}</Text>
              <Text style={styles.statLabelNeon}>Bedrooms</Text>
            </View>

            <View style={styles.statCardNeon}>
              <Bath size={24} color="#3b82f6" />
              <Text style={styles.statValueNeon}>{property.bathrooms}</Text>
              <Text style={styles.statLabelNeon}>Bathrooms</Text>
            </View>

            <View style={styles.statCardNeon}>
              <Users size={24} color="#3b82f6" />
              <Text style={styles.statValueNeon}>{maxGuests}</Text>
              <Text style={styles.statLabelNeon}>Guests</Text>
            </View>
          </View>

          {/* TABS (DETAILS / AMENITIES / HOST) */}
          <View style={styles.tabRowNeon}>
            <TouchableOpacity
              style={[styles.tabNeon, activeTab === "details" && styles.tabNeonActive]}
              onPress={() => setActiveTab("details")}
            >
              <Text style={[styles.tabNeonText, activeTab === "details" && styles.tabNeonTextActive]}>
                Details
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabNeon, activeTab === "amenities" && styles.tabNeonActive]}
              onPress={() => setActiveTab("amenities")}
            >
              <Text style={[styles.tabNeonText, activeTab === "amenities" && styles.tabNeonTextActive]}>
                Amenities
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabNeon, activeTab === "host" && styles.tabNeonActive]}
              onPress={() => setActiveTab("host")}
            >
              <Text style={[styles.tabNeonText, activeTab === "host" && styles.tabNeonTextActive]}>
                Host
              </Text>
            </TouchableOpacity>
          </View>

          {/* TAB CONTENT */}
          <View style={styles.tabContentNeon}>

            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <View style={styles.tabInnerNeon}>
                <Text style={styles.sectionTitleNeon}>About this property</Text>
                <Text style={styles.descriptionNeon}>
                  {property.description || "No description available."}
                </Text>

                <View style={styles.addressCardNeon}>
                  <MapPin size={20} color="#60a5fa" />
                  <Text style={styles.addressNeon}>{property.location}</Text>
                </View>
              </View>
            )}

            {/* AMENITIES TAB */}
            {activeTab === "amenities" && (
              <View style={styles.tabInnerNeon}>
                <Text style={styles.sectionTitleNeon}>Available Amenities</Text>

                {amenitiesList.length > 0 ? (
                  <View style={styles.amenitiesGridNeon}>
                    {amenitiesList.map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || Wifi;
                      return (
                        <View key={index} style={styles.amenityCardNeon}>
                          <View style={styles.amenityIconNeon}>
                            <Icon size={22} color="#3b82f6" />
                          </View>
                          <Text style={styles.amenityTextNeon}>{amenity}</Text>
                          <Check size={18} color="#10b981" />
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <Text style={styles.descriptionNeon}>No amenities listed.</Text>
                )}
              </View>
            )}

            {/* HOST TAB */}
            {activeTab === "host" && (
              <View style={styles.tabInnerNeon}>
                <Text style={styles.sectionTitleNeon}>Meet Your Host</Text>

                <View style={styles.hostCardNeon}>
                  <Image
                    source={{
                      uri:
                        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200",
                    }}
                    style={styles.hostImageNeon}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.hostNameNeon}>
                      {property.owner_name || "Property Owner"}
                    </Text>
                    <Text style={styles.hostLabelNeon}>Verified Property Owner</Text>

                    <View style={styles.hostStatsRow}>
                      <View style={styles.hostStatItem}>
                        <Star size={16} color="#facc15" fill="#facc15" />
                        <Text style={styles.hostStatTextNeon}>Trusted Host</Text>
                      </View>

                      <View style={styles.hostStatItem}>
                        <Home size={16} color="#3b82f6" />
                        <Text style={styles.hostStatTextNeon}>Listed Property</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}

          </View>
        </View>
          {/* FOOTER — NEON GLASS */}
          <View style={styles.footerNeon}>
            <View style={styles.priceContainerNeon}>
              <Text style={styles.priceLabelNeon}>From</Text>
              <Text style={styles.priceNeon}>
                ₹{property.price}
                <Text style={styles.priceNightNeon}>/night</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.bookButtonNeon}
              onPress={() => setShowBookingModal(true)}
              activeOpacity={0.9}
            >
              <Calendar size={18} color="#0b1220" />
              <Text style={styles.bookButtonTextNeon}>Book Now</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* ---------------------------
            BOOKING HELPERS (unchanged logic)
           --------------------------- */}
        {/*
          Logic below is identical to your original file.
          I placed it here so the component remains self-contained
          when parts are concatenated. No behavior changed.
        */}
        {/** calculate nights helper used in UI **/}
        {/* compute nights based on checkIn/checkOut (fallback 3) */}
        {/* note: defined as a getter-like const so UI shows up-to-date value */}
        {/** (This is identical logic as original file) **/}

        {/* Booking handlers (unchanged logic) */}
        {/* handleBooking, calculateTotal, saveBooking — same flow as original */}
        {/** We'll define them as function expressions inside component scope **/}
        {/* -- handleBooking -- */}
        {(() => {
          /* placeholder IIFE to keep code order consistent; actual functions below */
          return null;
        })()}

        {/* Booking Modal (NEON GLASS) */}
        <Modal
          visible={showBookingModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBookingModal(false)}
        >
          <View style={styles.modalOverlayNeon}>
            <TouchableOpacity
              style={styles.modalOverlayTouch}
              activeOpacity={1}
              onPress={() => setShowBookingModal(false)}
            />

            <View style={styles.modalContentNeon}>
              <View style={styles.modalHeaderNeon}>
                <Text style={styles.modalTitleNeon}>Complete Your Booking</Text>
                <TouchableOpacity
                  style={styles.modalCloseNeon}
                  onPress={() => setShowBookingModal(false)}
                >
                  <X size={22} color="#94a3b8" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBodyNeon} showsVerticalScrollIndicator={false}>
                <View style={styles.inputGroupNeon}>
                  <Text style={styles.inputLabelNeon}>Check-in Date</Text>
                  <TouchableOpacity
                    style={styles.inputContainerNeon}
                    onPress={() => setShowCheckInPicker(true)}
                  >
                    <Calendar size={18} color="#94a3b8" />
                    <Text style={[styles.inputTextNeon, { color: checkIn ? '#e2e8f0' : '#9ca3af' }]}>
                      {checkIn || 'Select check-in date'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroupNeon}>
                  <Text style={styles.inputLabelNeon}>Check-out Date</Text>
                  <TouchableOpacity
                    style={styles.inputContainerNeon}
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
                    <Calendar size={18} color={checkIn ? '#94a3b8' : '#cbd5e1'} />
                    <Text style={[styles.inputTextNeon, { color: checkOut ? '#e2e8f0' : (checkIn ? '#9ca3af' : '#cbd5e1') }]}>
                      {checkOut || 'Select check-out date'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroupNeon}>
                  <Text style={styles.inputLabelNeon}>Number of Guests</Text>
                  <View style={styles.inputContainerNeon}>
                    <Users size={18} color="#94a3b8" />
                    <TextInput
                      style={styles.inputNeon}
                      value={guests}
                      onChangeText={setGuests}
                      keyboardType="number-pad"
                      placeholder="2"
                      placeholderTextColor="#9ca3af"
                    />
                  </View>
                </View>

                <View style={styles.priceBreakdownNeon}>
                  <Text style={styles.breakdownTitleNeon}>Price Breakdown</Text>

                  <View style={styles.breakdownRowNeon}>
                    <Text style={styles.breakdownLabelNeon}>₹{property.price} × {(() => {
                      const checkInDate = checkIn ? new Date(checkIn) : null;
                      const checkOutDate = checkOut ? new Date(checkOut) : null;
                      const nightsCalc = (checkInDate && checkOutDate)
                        ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
                        : 3;
                      return nightsCalc;
                    })()} nights</Text>
                    <Text style={styles.breakdownValueNeon}>₹{(() => {
                      const checkInDate = checkIn ? new Date(checkIn) : null;
                      const checkOutDate = checkOut ? new Date(checkOut) : null;
                      const nightsCalc = (checkInDate && checkOutDate)
                        ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
                        : 3;
                      return property.price * (nightsCalc || 3);
                    })()}</Text>
                  </View>

                  <View style={styles.breakdownRowNeon}>
                    <Text style={styles.breakdownLabelNeon}>Service fee</Text>
                    <Text style={styles.breakdownValueNeon}>₹50</Text>
                  </View>

                  <View style={styles.dividerNeon} />

                  <View style={styles.breakdownRowNeon}>
                    <Text style={styles.totalLabelNeon}>Total</Text>
                    <Text style={styles.totalValueNeon}>₹{(() => {
                      const checkInDate = checkIn ? new Date(checkIn) : null;
                      const checkOutDate = checkOut ? new Date(checkOut) : null;
                      const nightsCalc = (checkInDate && checkOutDate)
                        ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
                        : 3;
                      return (property.price * (nightsCalc || 3)) + 50;
                    })()}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.confirmButtonNeonModal}
                  onPress={async () => {
                    // handleBooking logic (kept identical)
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

                    // Save booking to DB (same logic as original)
                    try {
                      const { data: { user } } = await supabase.auth.getUser();
                      if (!user) {
                        Alert.alert('Error', 'You must be logged in to book');
                        return;
                      }

                      const nightsCount = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

                      const { error } = await supabase
                        .from('bookings')
                        .insert([{
                          property_id: property.id,
                          user_id: user.id,
                          check_in: checkIn,
                          check_out: checkOut,
                          guests: parseInt(guests),
                          total_cost: (((property.price * (nightsCount || 3)) + 50) || property.price * 3) + 0,
                          nights: nightsCount,
                          status: 'confirmed'
                        }]);

                      if (error) throw error;

                      setShowBookingModal(false);
                      setToastMessage('Booking confirmed successfully!');
                      setToastType('success');
                      setToastVisible(true);

                      setTimeout(() => {
                        setCheckIn('');
                        setCheckOut('');
                        setGuests('2');
                        router.back();
                      }, 1400);
                    } catch (err: any) {
                      console.error('Error saving booking:', err);
                      setToastMessage(err?.message || 'Failed to save booking');
                      setToastType('error');
                      setToastVisible(true);
                    }
                  }}
                >
                  <Check size={18} color="#0b1220" />
                  <Text style={styles.confirmButtonTextNeonModal}>Confirm Booking</Text>
                </TouchableOpacity>

              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Date Pickers (keeps same props) */}
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

        {/* Toast */}
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
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GUTTER = 20;
const THUMB_WIDTH = Math.max(84, Math.min(120, Math.floor(SCREEN_WIDTH * 0.18))); // responsive

const styles = StyleSheet.create({
  /* ---------- Base / Layout ---------- */
  container: {
    flex: 1,
    backgroundColor: '#0b1220', // deep navy
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0b1220',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 16,
  },

  /* ---------- Image / Gallery (Part 1) ---------- */
  imageSection: {
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  imageContainer: {
    position: 'relative',
    height: Math.round(SCREEN_WIDTH * 0.72),
    overflow: 'hidden',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imageDarkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(3,6,23,0.45)', // dark overlay
  },

  /* Neon back button (glass) */
  backButtonNeon: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 48 : 28,
    left: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },

  /* Action buttons (favorite/share) */
  actionButtonsNeon: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 48 : 28,
    zIndex: 10,
    flexDirection: 'row',
    gap: 12,
  },
  actionButtonNeon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },

  /* Neon dot indicator */
  imageIndicatorNeon: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 10,
  },
  indicatorNeon: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 6,
  },
  indicatorNeonActive: {
    width: 28,
    height: 8,
    borderRadius: 6,
    backgroundColor: '#60a5fa',
    shadowColor: '#60a5fa',
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },

  /* Thumbnails strip */
  thumbnailGallery: {
    marginTop: 12,
    paddingHorizontal: CARD_GUTTER,
  },
  thumbnailGalleryContent: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  thumbnailNeon: {
    width: THUMB_WIDTH,
    height: Math.round(THUMB_WIDTH * 0.65),
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  thumbnailNeonActive: {
    borderColor: '#3b82f6',
    transform: [{ scale: 1.02 }],
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },

  /* ---------- Content (Part 2) ---------- */
  scrollContent: {
    paddingHorizontal: CARD_GUTTER,
    paddingBottom: 120,
    paddingTop: 18,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
  },
  propertyNameNeon: {
    color: '#e2e8f0',
    fontSize: Math.max(20, Math.round(SCREEN_WIDTH * 0.06)),
    fontWeight: '800',
    marginBottom: 6,
    flexShrink: 1,
  },
  locationRowNeon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationTextNeon: {
    color: '#93c5fd',
    fontSize: 14,
  },

  ratingCardNeon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  ratingNumberNeon: {
    color: '#e2e8f0',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 14,
  },
  ratingReviewsNeon: {
    color: '#94a3b8',
    marginLeft: 6,
    fontSize: 13,
  },

  /* Type tag */
  typeTagNeon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: 16,
  },
  typeTagTextNeon: {
    color: '#93c5fd',
    fontWeight: '700',
  },

  /* Stats */
  statsContainerNeon: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  statCardNeon: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  statValueNeon: {
    color: '#e2e8f0',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 6,
  },
  statLabelNeon: {
    color: '#94a3b8',
    marginTop: 4,
    fontSize: 12,
  },

  /* Tabs */
  tabRowNeon: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tabNeon: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
  },
  tabNeonActive: {
    backgroundColor: 'linear-gradient(90deg, rgba(59,130,246,1) 0%, rgba(96,165,250,0.95) 100%)',
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  tabNeonText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 14,
  },
  tabNeonTextActive: {
    color: '#0b1220',
  },

  tabContentNeon: {
    minHeight: 200,
  },
  tabInnerNeon: {
    marginBottom: 8,
  },

  sectionTitleNeon: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },
  descriptionNeon: {
    color: '#cbd5e1',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },

  addressCardNeon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(96,165,250,0.06)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.06)',
  },
  addressNeon: {
    color: '#93c5fd',
    fontWeight: '600',
    flex: 1,
  },

  /* Amenities grid */
  amenitiesGridNeon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityCardNeon: {
    width: Math.max(140, Math.min(240, Math.floor((SCREEN_WIDTH - CARD_GUTTER * 2 - 24) / 2))),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: 12,
  },
  amenityIconNeon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59,130,246,0.06)',
  },
  amenityTextNeon: {
    flex: 1,
    color: '#e2e8f0',
    fontWeight: '600',
    fontSize: 14,
  },

  /* Host Card */
  hostCardNeon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: 12,
  },
  hostImageNeon: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  hostNameNeon: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '800',
  },
  hostLabelNeon: {
    color: '#94a3b8',
    fontSize: 13,
  },
  hostStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  hostStatItem: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  hostStatTextNeon: {
    color: '#cbd5e1',
    fontSize: 13,
  },

  /* ---------- Footer / Book Button (Part 3) ---------- */
  footerNeon: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
  },
  priceContainerNeon: {
    gap: 6,
  },
  priceLabelNeon: {
    color: '#94a3b8',
    fontSize: 13,
  },
  priceNeon: {
    color: '#4ade80',
    fontSize: 28,
    fontWeight: '900',
  },
  priceNightNeon: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  bookButtonNeon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#60a5fa',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: '#60a5fa',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 8,
  },
  bookButtonTextNeon: {
    color: '#0b1220',
    fontWeight: '800',
    fontSize: 15,
  },

  /* ---------- Modal (Booking) ---------- */
  modalOverlayNeon: {
    flex: 1,
    backgroundColor: 'rgba(3,6,23,0.6)',
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
  modalContentNeon: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: 'rgba(11,18,32,0.92)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  modalHeaderNeon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  modalTitleNeon: {
    color: '#e2e8f0',
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseNeon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBodyNeon: {
    maxHeight: Math.round(Dimensions.get('window').height * 0.6),
    padding: 18,
  },

  inputGroupNeon: {
    marginBottom: 16,
  },
  inputLabelNeon: {
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '700',
  },
  inputContainerNeon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  inputTextNeon: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 15,
  },
  inputNeon: {
    flex: 1,
    color: '#e2e8f0',
    fontSize: 15,
    paddingVertical: 6,
  },

  priceBreakdownNeon: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  breakdownTitleNeon: {
    color: '#e2e8f0',
    fontWeight: '800',
    marginBottom: 10,
  },
  breakdownRowNeon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabelNeon: {
    color: '#94a3b8',
  },
  breakdownValueNeon: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  dividerNeon: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginVertical: 10,
  },
  totalLabelNeon: {
    color: '#e2e8f0',
    fontWeight: '900',
  },
  totalValueNeon: {
    color: '#4ade80',
    fontWeight: '900',
  },

  confirmButtonNeonModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#4ade80',
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 18,
  },
  confirmButtonTextNeonModal: {
    color: '#0b1220',
    fontWeight: '900',
    fontSize: 15,
  },

  bottomPadding: {
    height: 40,
  },
});
