import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  Image,
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

// Mock venue data
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
  {
    id: '6',
    name: 'Executive Boardroom',
    property: 'Grand Plaza Hotel',
    location: 'Miami Beach, FL',
    capacity: 50,
    pricePerHour: 100,
    type: 'Indoor',
    amenities: ['Conference Table', 'Video Conferencing', 'Catering', 'Privacy'],
    image: 'https://images.pexels.com/photos/827528/pexels-photo-827528.jpeg?auto=compress&cs=tinysrgb&w=800',
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

export default function CreateEventScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Event Details, 2: Select Venue, 3: Review
  const [selectedEventType, setSelectedEventType] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [duration, setDuration] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');

  const filteredVenues = filterType === 'all' 
    ? availableVenues 
    : availableVenues.filter(v => v.type.toLowerCase() === filterType);

  const canProceedToStep2 = eventName && selectedEventType && eventDate && eventTime && duration && guestCount;
  const canProceedToStep3 = selectedVenue;

  const totalCost = selectedVenue ? parseFloat(duration) * selectedVenue.pricePerHour : 0;

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, step >= 1 && styles.stepCircleActive]}>
          {step > 1 ? <Check size={16} color="#fff" /> : <Text style={styles.stepNumber}>1</Text>}
        </View>
        <Text style={[styles.stepLabel, step >= 1 && styles.stepLabelActive]}>Details</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, step >= 2 && styles.stepCircleActive]}>
          {step > 2 ? <Check size={16} color="#fff" /> : <Text style={styles.stepNumber}>2</Text>}
        </View>
        <Text style={[styles.stepLabel, step >= 2 && styles.stepLabelActive]}>Venue</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepItem}>
        <View style={[styles.stepCircle, step >= 3 && styles.stepCircleActive]}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
        <Text style={[styles.stepLabel, step >= 3 && styles.stepLabelActive]}>Review</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.formSection}>
        <Text style={styles.formSectionTitle}>Event Information</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Event Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Annual Gala Dinner"
            placeholderTextColor="#94a3b8"
            value={eventName}
            onChangeText={setEventName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Event Type *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
            {eventTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeChip,
                  selectedEventType === type.id && { 
                    backgroundColor: type.color,
                    borderColor: type.color 
                  },
                ]}
                onPress={() => setSelectedEventType(type.id)}
                activeOpacity={0.7}>
                <Text
                  style={[
                    styles.typeChipText,
                    selectedEventType === type.id && styles.typeChipTextActive,
                  ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.inputLabel}>Date *</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={20} color="#64748b" />
              <TextInput
                style={styles.inputWithIconText}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
                value={eventDate}
                onChangeText={setEventDate}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Time *</Text>
            <View style={styles.inputWithIcon}>
              <Clock size={20} color="#64748b" />
              <TextInput
                style={styles.inputWithIconText}
                placeholder="HH:MM"
                placeholderTextColor="#94a3b8"
                value={eventTime}
                onChangeText={setEventTime}
              />
            </View>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.inputLabel}>Duration (hours) *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 4"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Expected Guests *</Text>
            <View style={styles.inputWithIcon}>
              <Users size={20} color="#64748b" />
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

      <TouchableOpacity
        style={[styles.nextButton, !canProceedToStep2 && styles.nextButtonDisabled]}
        onPress={() => canProceedToStep2 && setStep(2)}
        disabled={!canProceedToStep2}
        activeOpacity={0.8}>
        <Text style={styles.nextButtonText}>Continue to Venue Selection</Text>
        <ChevronRight size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filterType === 'all' && styles.filterChipActive]}
          onPress={() => setFilterType('all')}
          activeOpacity={0.7}>
          <Text style={[styles.filterChipText, filterType === 'all' && styles.filterChipTextActive]}>
            All Venues
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filterType === 'indoor' && styles.filterChipActive]}
          onPress={() => setFilterType('indoor')}
          activeOpacity={0.7}>
          <Text style={[styles.filterChipText, filterType === 'indoor' && styles.filterChipTextActive]}>
            Indoor
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filterType === 'outdoor' && styles.filterChipActive]}
          onPress={() => setFilterType('outdoor')}
          activeOpacity={0.7}>
          <Text style={[styles.filterChipText, filterType === 'outdoor' && styles.filterChipTextActive]}>
            Outdoor
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.venuesContainer}>
        <Text style={styles.venuesTitle}>Available Venues ({filteredVenues.length})</Text>
        {filteredVenues.map((venue) => (
          <TouchableOpacity
            key={venue.id}
            style={[
              styles.venueCard,
              selectedVenue?.id === venue.id && styles.venueCardSelected,
              !venue.available && styles.venueCardDisabled,
            ]}
            onPress={() => venue.available && setSelectedVenue(venue)}
            disabled={!venue.available}
            activeOpacity={0.7}>
            <Image source={{ uri: venue.image }} style={styles.venueImage} />
            
            {selectedVenue?.id === venue.id && (
              <View style={styles.selectedBadge}>
                <Check size={16} color="#fff" />
              </View>
            )}

            {!venue.available && (
              <View style={styles.unavailableBadge}>
                <Text style={styles.unavailableText}>Unavailable</Text>
              </View>
            )}

            <View style={styles.venueContent}>
              <View style={styles.venueHeader}>
                <Text style={styles.venueName}>{venue.name}</Text>
                <View style={[styles.venueTypeBadge, { backgroundColor: venue.type === 'Indoor' ? '#dbeafe' : '#dcfce7' }]}>
                  <Text style={[styles.venueTypeText, { color: venue.type === 'Indoor' ? '#1e40af' : '#15803d' }]}>
                    {venue.type}
                  </Text>
                </View>
              </View>

              <View style={styles.venueLocation}>
                <Home size={14} color="#64748b" />
                <Text style={styles.venueLocationText}>{venue.property}</Text>
              </View>

              <View style={styles.venueLocation}>
                <MapPin size={14} color="#64748b" />
                <Text style={styles.venueLocationText}>{venue.location}</Text>
              </View>

              <View style={styles.venueDetails}>
                <View style={styles.venueDetailItem}>
                  <Users size={16} color="#64748b" />
                  <Text style={styles.venueDetailText}>Up to {venue.capacity} guests</Text>
                </View>
                <View style={styles.venueDetailItem}>
                  <DollarSign size={16} color="#16a34a" />
                  <Text style={styles.venuePriceText}>₹{venue.pricePerHour}/hour</Text>
                </View>
              </View>

              <View style={styles.amenitiesContainer}>
                {venue.amenities.slice(0, 3).map((amenity, index) => (
                  <View key={index} style={styles.amenityChip}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
                {venue.amenities.length > 3 && (
                  <View style={styles.amenityChip}>
                    <Text style={styles.amenityText}>+{venue.amenities.length - 3}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep(1)}
          activeOpacity={0.7}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, styles.nextButtonFlex, !canProceedToStep3 && styles.nextButtonDisabled]}
          onPress={() => canProceedToStep3 && setStep(3)}
          disabled={!canProceedToStep3}
          activeOpacity={0.8}>
          <Text style={styles.nextButtonText}>Review Booking</Text>
          <ChevronRight size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>Booking Summary</Text>
        
        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Event Details</Text>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Event Name:</Text>
            <Text style={styles.reviewValue}>{eventName}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Type:</Text>
            <View style={[styles.typeChipSmall, { 
              backgroundColor: eventTypes.find(t => t.id === selectedEventType)?.color 
            }]}>
              <Text style={styles.typeChipSmallText}>
                {eventTypes.find(t => t.id === selectedEventType)?.label}
              </Text>
            </View>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Date & Time:</Text>
            <Text style={styles.reviewValue}>{eventDate} at {eventTime}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Duration:</Text>
            <Text style={styles.reviewValue}>{duration} hours</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Expected Guests:</Text>
            <Text style={styles.reviewValue}>{guestCount} people</Text>
          </View>
        </View>

        <View style={styles.reviewDivider} />

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Venue Information</Text>
          <Image source={{ uri: selectedVenue?.image }} style={styles.reviewVenueImage} />
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Venue:</Text>
            <Text style={styles.reviewValue}>{selectedVenue?.name}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Property:</Text>
            <Text style={styles.reviewValue}>{selectedVenue?.property}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Location:</Text>
            <Text style={styles.reviewValue}>{selectedVenue?.location}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Capacity:</Text>
            <Text style={styles.reviewValue}>Up to {selectedVenue?.capacity} guests</Text>
          </View>
        </View>

        <View style={styles.reviewDivider} />

        <View style={styles.reviewSection}>
          <Text style={styles.reviewSectionTitle}>Cost Breakdown</Text>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Venue Rate:</Text>
            <Text style={styles.reviewValue}>₹{selectedVenue?.pricePerHour}/hour</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Duration:</Text>
            <Text style={styles.reviewValue}>{duration} hours</Text>
          </View>
          <View style={styles.reviewDivider} />
          <View style={styles.reviewRow}>
            <Text style={styles.reviewTotalLabel}>Total Cost:</Text>
            <Text style={styles.reviewTotalValue}>₹{totalCost.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep(2)}
          activeOpacity={0.7}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.confirmButton, styles.nextButtonFlex]}
          onPress={() => {
            // Handle booking confirmation
            alert('Event booking confirmed!');
          }}
          activeOpacity={0.8}>
          <Sparkles size={20} color="#fff" />
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <ArrowLeft color="#1e293b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Event</Text>
        <View style={styles.headerBackButton} />
      </View>

      {renderStepIndicator()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerBackButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#2563eb',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  stepLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  stepLabelActive: {
    color: '#2563eb',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
    marginBottom: 30,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  stepContent: {
    flex: 1,
  },
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  formSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 20,
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
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1e293b',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  inputWithIconText: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  inputRow: {
    flexDirection: 'row',
  },
  typeScroll: {
    marginTop: 8,
  },
  typeChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginRight: 10,
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  typeChipTextActive: {
    color: '#fff',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  nextButtonFlex: {
    flex: 1,
  },
  nextButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  venuesContainer: {
    marginBottom: 20,
  },
  venuesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  venueCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  venueCardSelected: {
    borderColor: '#2563eb',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  venueCardDisabled: {
    opacity: 0.5,
  },
  venueImage: {
    width: '100%',
    height: 180,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
  unavailableText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  venueContent: {
    padding: 16,
  },
  venueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  venueName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  venueTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  venueTypeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  venueLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  venueLocationText: {
    fontSize: 14,
    color: '#64748b',
  },
  venueDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  venueDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venueDetailText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  venuePriceText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16a34a',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityChip: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  amenityText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reviewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  reviewSection: {
    marginBottom: 16,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  reviewValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  typeChipSmall: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeChipSmallText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 16,
  },
  reviewVenueImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  reviewTotalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});