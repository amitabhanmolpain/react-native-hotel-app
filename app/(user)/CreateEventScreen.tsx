import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ChevronRight,
  Check,
  DollarSign,
  Home,
} from 'lucide-react-native';

/* ==========================================
   MOCK DATA
   ========================================== */
const availableVenues = [
  {
    id: '1',
    name: 'Crystal Ballroom',
    property: 'Grand Plaza Hotel',
    location: 'Miami Beach, FL',
    capacity: 300,
    pricePerHour: 150,
    type: 'Indoor',
    amenities: ['Stage', 'Sound System', 'AC', 'Catering'],
    image: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
  },
  {
    id: '2',
    name: 'Rooftop Garden Terrace',
    property: 'Downtown Boutique Hotel',
    location: 'New York, NY',
    capacity: 150,
    pricePerHour: 200,
    type: 'Outdoor',
    amenities: ['Garden View', 'Bar Setup', 'Lighting', 'WiFi'],
    image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
  },
  {
    id: '3',
    name: 'Grand Dining Hall',
    property: 'Luxury Resort & Spa',
    location: 'Aspen, CO',
    capacity: 200,
    pricePerHour: 175,
    type: 'Indoor',
    amenities: ['Full Kitchen', 'Dining Tables', 'Bar', 'Valet'],
    image: 'https://images.pexels.com/photos/2306281/pexels-photo-2306281.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
  },
  {
    id: '4',
    name: 'Innovation Conference Center',
    property: 'Downtown Business Hotel',
    location: 'San Francisco, CA',
    capacity: 120,
    pricePerHour: 125,
    type: 'Indoor',
    amenities: ['Projector', 'Whiteboards', 'WiFi', 'Coffee Station'],
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: false,
  },
  {
    id: '5',
    name: 'Beachside Pavilion',
    property: 'Seaside Resort',
    location: 'Charleston, SC',
    capacity: 250,
    pricePerHour: 180,
    type: 'Outdoor',
    amenities: ['Ocean View', 'Open Air', 'BBQ Area', 'Parking'],
    image: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
    available: true,
  },
];

const eventTypes = [
  { id: 'wedding', label: 'Wedding', color: '#ec4899' },
  { id: 'business', label: 'Business', color: '#3b82f6' },
  { id: 'party', label: 'Party', color: '#f59e0b' },
  { id: 'conference', label: 'Conference', color: '#8b5cf6' },
  { id: 'other', label: 'Other', color: '#10b981' },
];

/* ==========================================
   MAIN SCREEN
   ========================================== */
export default function CreateEventScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedEventType, setSelectedEventType] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [duration, setDuration] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');

  const filteredVenues =
    filterType === 'all'
      ? availableVenues
      : availableVenues.filter(v => v.type.toLowerCase() === filterType);

  const canProceedToStep2 =
    eventName && selectedEventType && eventDate && eventTime && duration && guestCount;

  const canProceedToStep3 = selectedVenue;

  const totalCost = selectedVenue
    ? parseFloat(duration) * selectedVenue.pricePerHour
    : 0;

  /* ==========================================
     HEADER (Neon Glass)
     ========================================== */
  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerBackButton}
        onPress={() => router.back()}
        activeOpacity={0.7}>
        <ArrowLeft color="#93c5fd" size={24} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Create Event</Text>

      <View style={{ width: 40 }} />
    </View>
  );

  /* ==========================================
     STEP INDICATOR (Neon)
     ========================================== */
  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {/* Step 1 */}
      <View style={styles.stepItem}>
        <View
          style={[
            styles.stepCircle,
            step >= 1 && styles.stepCircleActive,
          ]}
        >
          {step > 1 ? (
            <Check size={16} color="#fff" />
          ) : (
            <Text style={styles.stepNumber}>1</Text>
          )}
        </View>
        <Text
          style={[
            styles.stepLabel,
            step >= 1 && styles.stepLabelActive,
          ]}
        >
          Details
        </Text>
      </View>

      <View style={styles.stepLine} />

      {/* Step 2 */}
      <View style={styles.stepItem}>
        <View
          style={[
            styles.stepCircle,
            step >= 2 && styles.stepCircleActive,
          ]}
        >
          {step > 2 ? (
            <Check size={16} color="#fff" />
          ) : (
            <Text style={styles.stepNumber}>2</Text>
          )}
        </View>
        <Text
          style={[
            styles.stepLabel,
            step >= 2 && styles.stepLabelActive,
          ]}
        >
          Venue
        </Text>
      </View>

      <View style={styles.stepLine} />

      {/* Step 3 */}
      <View style={styles.stepItem}>
        <View
          style={[
            styles.stepCircle,
            step >= 3 && styles.stepCircleActive,
          ]}
        >
          <Text style={styles.stepNumber}>3</Text>
        </View>
        <Text
          style={[
            styles.stepLabel,
            step >= 3 && styles.stepLabelActive,
          ]}
        >
          Review
        </Text>
      </View>
    </View>
  );

  /* ==========================================
     PART 2 — STEP 1: EVENT DETAILS (Neon Glass UI)
     ========================================== */
  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Event Information</Text>

        {/* Event Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Event Name *</Text>
          <View style={styles.inputGlassRow}>
            <TextInput
              style={styles.inputGlass}
              placeholder="e.g., Annual Gala Dinner"
              placeholderTextColor="#94a3b8"
              value={eventName}
              onChangeText={setEventName}
            />
          </View>
        </View>

        {/* Event Type Chips */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Event Type *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typeScroll}
          >
            {eventTypes.map((type) => {
              const selected = selectedEventType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedEventType(type.id)}
                  style={[
                    styles.typeChipNeon,
                    selected && { backgroundColor: type.color, borderColor: type.color },
                  ]}
                >
                  <Text style={[styles.typeChipText, selected && styles.typeChipTextActive]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Date & Time Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.inputLabel}>Date *</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.inputWithIconGlass}>
              <Calendar size={18} color="#9fb7ff" />
              <TextInput
                style={styles.inputWithIconText}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
                value={eventDate}
                onChangeText={setEventDate}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Time *</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.inputWithIconGlass}>
              <Clock size={18} color="#9fb7ff" />
              <TextInput
                style={styles.inputWithIconText}
                placeholder="HH:MM"
                placeholderTextColor="#94a3b8"
                value={eventTime}
                onChangeText={setEventTime}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration & Guests Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.inputLabel}>Duration (hours) *</Text>
            <TextInput
              style={styles.inputGlass}
              placeholder="e.g., 4"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Expected Guests *</Text>
            <View style={styles.inputWithIconGlass}>
              <Users size={18} color="#9fb7ff" />
              <TextInput
                style={styles.inputWithIconText}
                placeholder="e.g., 100"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={guestCount}
                onChangeText={setGuestCount}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceedToStep2 && styles.nextButtonDisabled]}
          onPress={() => canProceedToStep2 && setStep(2)}
          disabled={!canProceedToStep2}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>Continue to Venue Selection</Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
  /* ==========================================
     PART 3 — STEP 2: VENUE SELECTION (Neon Cards)
     ========================================== */
  const renderStep2 = () => (
    <View style={styles.stepContent}>
      {/* Filters */}
      <View style={styles.filterRowNeon}>
        <TouchableOpacity
          style={[styles.filterChipNeon, filterType === 'all' && styles.filterChipNeonActive]}
          onPress={() => setFilterType('all')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipNeonText, filterType === 'all' && styles.filterChipNeonTextActive]}>All Venues</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChipNeon, filterType === 'indoor' && styles.filterChipNeonActive]}
          onPress={() => setFilterType('indoor')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipNeonText, filterType === 'indoor' && styles.filterChipNeonTextActive]}>Indoor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChipNeon, filterType === 'outdoor' && styles.filterChipNeonActive]}
          onPress={() => setFilterType('outdoor')}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterChipNeonText, filterType === 'outdoor' && styles.filterChipNeonTextActive]}>Outdoor</Text>
        </TouchableOpacity>
      </View>

      {/* Venues list */}
      <View style={styles.venuesContainer}>
        <Text style={styles.venuesTitle}>Available Venues ({filteredVenues.length})</Text>

        {filteredVenues.map((venue) => {
          const selected = selectedVenue?.id === venue.id;
          return (
            <TouchableOpacity
              key={venue.id}
              style={[
                styles.venueCardNeon,
                selected && styles.venueCardNeonSelected,
                !venue.available && styles.venueCardDisabled,
              ]}
              onPress={() => venue.available && setSelectedVenue(venue)}
              disabled={!venue.available}
              activeOpacity={0.85}
            >
              {/* Background image */}
              <Image source={{ uri: venue.image }} style={styles.venueImageNeon} />

              {/* Dark glass overlay */}
              <View style={styles.venueOverlay} />

              {/* Selected badge */}
              {selected && (
                <View style={styles.selectedBadgeNeon}>
                  <Check size={16} color="#0b1220" />
                </View>
              )}

              {/* Unavailable badge */}
              {!venue.available && (
                <View style={styles.unavailableBadgeNeon}>
                  <Text style={styles.unavailableTextNeon}>Unavailable</Text>
                </View>
              )}

              {/* Content */}
              <View style={styles.venueContentNeon}>
                <View style={styles.venueHeaderNeon}>
                  <Text style={styles.venueNameNeon} numberOfLines={1}>{venue.name}</Text>

                  <View style={[
                    styles.venueTypeBadgeNeon,
                    { backgroundColor: venue.type === 'Indoor' ? 'rgba(147,197,253,0.12)' : 'rgba(220,253,231,0.12)' }
                  ]}>
                    <Text style={[
                      styles.venueTypeTextNeon,
                      { color: venue.type === 'Indoor' ? '#93c5fd' : '#86efac' }
                    ]}>
                      {venue.type}
                    </Text>
                  </View>
                </View>

                <View style={styles.venueLocationNeon}>
                  <Home size={14} color="#94a3b8" />
                  <Text style={styles.venueLocationTextNeon}>{venue.property}</Text>
                </View>

                <View style={styles.venueLocationNeon}>
                  <MapPin size={14} color="#94a3b8" />
                  <Text style={styles.venueLocationTextNeon}>{venue.location}</Text>
                </View>

                <View style={styles.venueDetailsNeon}>
                  <View style={styles.venueDetailItemNeon}>
                    <Users size={16} color="#94a3b8" />
                    <Text style={styles.venueDetailTextNeon}>Up to {venue.capacity} guests</Text>
                  </View>

                  <View style={styles.venueDetailItemNeon}>
                    <DollarSign size={16} color="#4ade80" />
                    <Text style={styles.venuePriceTextNeon}>₹{venue.pricePerHour}/hour</Text>
                  </View>
                </View>

                <View style={styles.amenitiesContainerNeon}>
                  {venue.amenities.slice(0, 3).map((amenity, idx) => (
                    <View key={idx} style={styles.amenityChipNeon}>
                      <Text style={styles.amenityTextNeon}>{amenity}</Text>
                    </View>
                  ))}
                  {venue.amenities.length > 3 && (
                    <View style={styles.amenityChipNeon}>
                      <Text style={styles.amenityTextNeon}>+{venue.amenities.length - 3}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.buttonRowNeon}>
        <TouchableOpacity
          style={styles.backButtonNeon}
          onPress={() => setStep(1)}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonTextNeon}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.nextButtonNeon, !canProceedToStep3 && styles.nextButtonDisabledNeon]}
          onPress={() => canProceedToStep3 && setStep(3)}
          disabled={!canProceedToStep3}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonTextNeon}>Review Booking</Text>
          <ChevronRight size={20} color="#0b1220" />
        </TouchableOpacity>
      </View>
    </View>
  );
  /* ==========================================
     PART 4 — STEP 3: REVIEW (Neon Glass UI)
     ========================================== */
  const renderStep3 = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
    <View style={styles.stepContent}>
      <View style={styles.reviewCardNeon}>
        <Text style={styles.reviewTitleNeon}>Booking Summary</Text>

        {/* Event Details */}
        <View style={styles.reviewSectionNeon}>
          <Text style={styles.reviewSectionTitleNeon}>Event Details</Text>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Event Name:</Text>
            <Text style={styles.reviewValueNeon}>{eventName}</Text>
          </View>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Type:</Text>
            <View style={[
              styles.typeChipSmallNeon,
              { backgroundColor: eventTypes.find(t => t.id === selectedEventType)?.color }
            ]}>
              <Text style={styles.typeChipSmallTextNeon}>
                {eventTypes.find(t => t.id === selectedEventType)?.label}
              </Text>
            </View>
          </View>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Date & Time:</Text>
            <Text style={styles.reviewValueNeon}>{eventDate} at {eventTime}</Text>
          </View>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Duration:</Text>
            <Text style={styles.reviewValueNeon}>{duration} hours</Text>
          </View>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Guests:</Text>
            <Text style={styles.reviewValueNeon}>{guestCount} people</Text>
          </View>
        </View>

        <View style={styles.reviewDividerNeon} />

        {/* Venue */}
        <View style={styles.reviewSectionNeon}>
          <Text style={styles.reviewSectionTitleNeon}>Venue Information</Text>

          <Image source={{ uri: selectedVenue?.image }} style={styles.reviewVenueImageNeon} />

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Venue:</Text>
            <Text style={styles.reviewValueNeon}>{selectedVenue?.name}</Text>
          </View>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Property:</Text>
            <Text style={styles.reviewValueNeon}>{selectedVenue?.property}</Text>
          </View>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Location:</Text>
            <Text style={styles.reviewValueNeon}>{selectedVenue?.location}</Text>
          </View>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Capacity:</Text>
            <Text style={styles.reviewValueNeon}>Up to {selectedVenue?.capacity} guests</Text>
          </View>
        </View>

        <View style={styles.reviewDividerNeon} />

        {/* Pricing */}
        <View style={styles.reviewSectionNeon}>
          <Text style={styles.reviewSectionTitleNeon}>Cost Breakdown</Text>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Venue Rate:</Text>
            <Text style={styles.reviewValueNeon}>₹{selectedVenue?.pricePerHour}/hour</Text>
          </View>

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewLabelNeon}>Duration:</Text>
            <Text style={styles.reviewValueNeon}>{duration} hours</Text>
          </View>

          <View style={styles.reviewDividerNeon} />

          <View style={styles.reviewRowNeon}>
            <Text style={styles.reviewTotalLabelNeon}>Total Cost:</Text>
            <Text style={styles.reviewTotalValueNeon}>₹{totalCost.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.buttonRowNeon}>
        <TouchableOpacity
          style={styles.backButtonNeon}
          onPress={() => setStep(2)}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonTextNeon}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.confirmButtonNeon}
          onPress={() => alert("Event booking confirmed!")}
          activeOpacity={0.85}
        >
          <Sparkles size={20} color="#0b1220" />
          <Text style={styles.confirmButtonTextNeon}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
      </View>
      </ScrollView>
  );

  /* ==========================================
     MAIN RETURN
     ========================================== */
  return (
    <View style={styles.container}>
      {renderHeader()}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {renderStepIndicator()}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1220",
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 14,
    backgroundColor: "rgba(17, 25, 40, 0.65)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
  },
  headerBackButton: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e2e8f0",
  },

  /* STEP INDICATOR */
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(17,25,40,0.6)",
  },
  stepItem: { alignItems: "center" },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(51,65,85,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  stepNumber: {
    color: "#cbd5e1",
    fontWeight: "700",
    fontSize: 15,
  },
  stepLabel: { fontSize: 12, color: "#64748b" },
  stepLabelActive: { color: "#3b82f6", fontWeight: "600" },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginHorizontal: 8,
    marginBottom: 26,
  },

  scrollView: { flex: 1 },
  scrollContent: { padding: 20 },
  stepContent: { marginBottom: 30 },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  /* FORM CARD (STEP 1) */
  formCard: {
    backgroundColor: "rgba(17,25,40,0.55)",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#e2e8f0",
    marginBottom: 20,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  /* GLASS INPUT */
  inputGlass: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    padding: 14,
    borderRadius: 12,
    color: "#e2e8f0",
    fontSize: 16,
  },
  inputGlassRow: { flexDirection: "row", alignItems: "center" },

  inputWithIconGlass: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
  },
  inputWithIconText: {
    flex: 1,
    color: "#e2e8f0",
    fontSize: 16,
  },

  row: { flexDirection: "row" },

  /* TYPE CHIPS */
  typeScroll: { paddingVertical: 6 },
  typeChipNeon: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    marginRight: 10,
  },
  typeChipText: { color: "#94a3b8", fontWeight: "600" },
  typeChipTextActive: { color: "#0b1220" },

  /* BUTTONS */
  nextButton: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#3b82f6",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  nextButtonDisabled: { backgroundColor: "#1e293b" },
  nextButtonText: { fontSize: 16, fontWeight: "700", color: "#0b1220" },

  /* VENUE CARD (STEP 2) */

  filterRowNeon: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 12,
  },
  filterChipNeon: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
  },
  filterChipNeonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  filterChipNeonText: { color: "#94a3b8", fontWeight: "600" },
  filterChipNeonTextActive: { color: "#0b1220" },

  venuesContainer: { marginBottom: 20 },
  venuesTitle: { color: "#e2e8f0", fontSize: 18, fontWeight: "700", marginBottom: 14 },

  venueCardNeon: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(17,25,40,0.35)",
  },
  venueCardNeonSelected: {
    borderColor: "#3b82f6",
    shadowColor: "#3b82f6",
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 6,
  },
  venueCardDisabled: { opacity: 0.4 },

  venueImageNeon: {
    width: "100%",
    height: 170,
  },
  venueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  selectedBadgeNeon: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  unavailableBadgeNeon: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  unavailableTextNeon: { color: "#fff", fontSize: 12, fontWeight: "700" },

  venueContentNeon: { padding: 16 },
  venueHeaderNeon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  venueNameNeon: { color: "#e2e8f0", fontSize: 18, fontWeight: "700" },

  venueTypeBadgeNeon: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  venueTypeTextNeon: { fontSize: 11, fontWeight: "700" },

  venueLocationNeon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  venueLocationTextNeon: { color: "#94a3b8", fontSize: 14 },

  venueDetailsNeon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 12,
  },
  venueDetailItemNeon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  venueDetailTextNeon: { color: "#94a3b8", fontSize: 14 },
  venuePriceTextNeon: { color: "#4ade80", fontSize: 16, fontWeight: "700" },

  amenitiesContainerNeon: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  amenityChipNeon: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  amenityTextNeon: { color: "#cbd5e1", fontSize: 12 },

  buttonRowNeon: { flexDirection: "row", gap: 12, marginTop: 10 },
  backButtonNeon: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.1)",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  backButtonTextNeon: { color: "#94a3b8", fontSize: 16, fontWeight: "600" },

  nextButtonNeon: {
    flex: 1,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  nextButtonDisabledNeon: {
    backgroundColor: "#1e293b",
  },
  nextButtonTextNeon: { color: "#0b1220", fontSize: 16, fontWeight: "700" },

  /* REVIEW STEP (STEP 3) */

  reviewCardNeon: {
    backgroundColor: "rgba(17,25,40,0.6)",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 24,
  },
  reviewTitleNeon: {
    fontSize: 22,
    fontWeight: "800",
    color: "#e2e8f0",
    marginBottom: 20,
  },
  reviewSectionNeon: { marginBottom: 18 },
  reviewSectionTitleNeon: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e2e8f0",
    marginBottom: 12,
  },
  reviewRowNeon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  reviewLabelNeon: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "500",
  },
  reviewValueNeon: {
    color: "#e2e8f0",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 20,
  },

  typeChipSmallNeon: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  typeChipSmallTextNeon: {
    color: "#0b1220",
    fontWeight: "700",
    fontSize: 12,
  },

  reviewDividerNeon: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 18,
  },
  reviewVenueImageNeon: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 14,
  },

  reviewTotalLabelNeon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e2e8f0",
  },
  reviewTotalValueNeon: {
    color: "#4ade80",
    fontSize: 24,
    fontWeight: "800",
  },

  confirmButtonNeon: {
    flex: 1,
    backgroundColor: "#4ade80",
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  confirmButtonTextNeon: {
    color: "#0b1220",
    fontWeight: "800",
    fontSize: 16,
  },

  bottomPadding: { height: 40 },
});

