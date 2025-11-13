import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MapPin, Star, Heart, SlidersHorizontal, User as UserIcon, Calendar, Users, Bed, Wifi, Coffee, Dumbbell } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../supabaseClient';

// Mock special offers/deals
const specialOffers = [
  {
    id: '1',
    title: 'Weekend Getaway Special',
    discount: '30% OFF',
    property: 'Luxury Beach Resort',
    validUntil: '2025-11-15',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#ec4899',
  },
  {
    id: '2',
    title: 'Early Bird Booking',
    discount: '25% OFF',
    property: 'Mountain View Villa',
    validUntil: '2025-11-20',
    image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#8b5cf6',
  },
  {
    id: '3',
    title: 'Extended Stay Discount',
    discount: '40% OFF',
    property: 'Downtown Boutique Hotel',
    validUntil: '2025-11-30',
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    color: '#10b981',
  },
];

// Mock upcoming events
const upcomingEvents = [
  {
    id: '1',
    title: 'Corporate Annual Gala 2025',
    venue: 'Grand Ballroom - Luxury Beach Resort',
    date: '2025-11-10',
    time: '7:00 PM',
    category: 'Corporate',
    ticketPrice: 150,
    image: 'https://images.pexels.com/photos/1387037/pexels-photo-1387037.jpeg?auto=compress&cs=tinysrgb&w=800',
    attendees: 250,
  },
  {
    id: '2',
    title: 'Wedding Celebration',
    venue: 'Garden Pavilion - Mountain View Villa',
    date: '2025-11-15',
    time: '5:00 PM',
    category: 'Wedding',
    ticketPrice: 200,
    image: 'https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=800',
    attendees: 150,
  },
  {
    id: '3',
    title: 'Tech Conference 2025',
    venue: 'Convention Center - Downtown Boutique Hotel',
    date: '2025-11-18',
    time: '9:00 AM',
    category: 'Conference',
    ticketPrice: 99,
    image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=800',
    attendees: 500,
  },
  {
    id: '4',
    title: 'Charity Fundraiser Dinner',
    venue: 'Rooftop Terrace - Luxury Beach Resort',
    date: '2025-11-22',
    time: '6:30 PM',
    category: 'Charity',
    ticketPrice: 120,
    image: 'https://images.pexels.com/photos/2306203/pexels-photo-2306203.jpeg?auto=compress&cs=tinysrgb&w=800',
    attendees: 180,
  },
];

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
  description: string;
  images: string[];
  amenities: string;
  status: string;
  featured: boolean;
}

export default function EnhancedUserHomeScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');
  const [guests, setGuests] = useState<string>('2 Adults, 1 Room');
  const [userName, setUserName] = useState('Guest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserName();
    initializeDates();
    fetchProperties();
  }, []);

  const loadUserName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .maybeSingle();

        if (userData && userData.name) {
          setUserName(userData.name);
        } else {
          const storedName = await AsyncStorage.getItem('userName');
          if (storedName) {
            setUserName(storedName);
          }
        }
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const initializeDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 2);

    setCheckInDate(tomorrow.toISOString().split('T')[0]);
    setCheckOutDate(dayAfter.toISOString().split('T')[0]);
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      } else if (data) {
        const formattedProperties = data.map((prop: any) => ({
          id: prop.id,
          name: prop.name,
          type: prop.type,
          city: prop.city,
          state: prop.state,
          location: prop.location,
          price: prop.price,
          rating: prop.rating || 0,
          reviews: prop.reviews || 0,
          bedrooms: prop.bedrooms || 0,
          bathrooms: prop.bathrooms || 0,
          description: prop.description || '',
          images: Array.isArray(prop.images) ? prop.images : [],
          amenities: prop.amenities || '',
          status: prop.status,
          featured: prop.featured || false,
        }));
        setProperties(formattedProperties);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProperties = filteredProperties.filter(p => p.featured);
  const allProperties = filteredProperties;

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.username}>{userName}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
            <UserIcon color="#475569" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color="#64748b" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search hotels, destinations..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <SlidersHorizontal color="#475569" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Quick Booking Card */}
        <View style={styles.quickBookingCard}>
          <View style={styles.quickBookingHeader}>
            <View style={styles.quickBookingTitleRow}>
              <Bed color="#2563eb" size={24} />
              <Text style={styles.quickBookingTitle}>Book Your Stay</Text>
            </View>
            <Text style={styles.quickBookingSubtitle}>Find your perfect room</Text>
          </View>

          <View style={styles.quickBookingInputs}>
            <View style={styles.dateInputRow}>
              <TouchableOpacity 
                style={styles.dateInput}
                activeOpacity={0.7}
                onPress={() => {
                  // Open date picker for check-in
                  const today = new Date();
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setCheckInDate(tomorrow.toISOString().split('T')[0]);
                }}>
                <Calendar size={18} color="#64748b" />
                <View style={styles.dateInputText}>
                  <Text style={styles.dateLabel}>Check-in</Text>
                  <Text style={styles.dateValue}>
                    {checkInDate ? new Date(checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date'}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.dateInput}
                activeOpacity={0.7}
                onPress={() => {
                  // Open date picker for check-out
                  const checkIn = new Date(checkInDate);
                  const nextDay = new Date(checkIn);
                  nextDay.setDate(nextDay.getDate() + 1);
                  setCheckOutDate(nextDay.toISOString().split('T')[0]);
                }}>
                <Calendar size={18} color="#64748b" />
                <View style={styles.dateInputText}>
                  <Text style={styles.dateLabel}>Check-out</Text>
                  <Text style={styles.dateValue}>
                    {checkOutDate ? new Date(checkOutDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.guestsInput}
              activeOpacity={0.7}
              onPress={() => {
                // Could open a modal for guest selection
                Alert.alert('Guests', 'Select number of guests and rooms', [
                  { text: '1 Adult, 1 Room', onPress: () => setGuests('1 Adult, 1 Room') },
                  { text: '2 Adults, 1 Room', onPress: () => setGuests('2 Adults, 1 Room') },
                  { text: '2 Adults, 2 Rooms', onPress: () => setGuests('2 Adults, 2 Rooms') },
                  { text: 'Cancel', style: 'cancel' },
                ]);
              }}>
              <Users size={18} color="#64748b" />
              <View style={styles.dateInputText}>
                <Text style={styles.dateLabel}>Guests</Text>
                <Text style={styles.dateValue}>{guests}</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.searchRoomsButton}
            activeOpacity={0.8}
            onPress={() => {
              if (!checkInDate || !checkOutDate) {
                Alert.alert('Missing Dates', 'Please select check-in and check-out dates');
                return;
              }

              const checkIn = new Date(checkInDate);
              const checkOut = new Date(checkOutDate);

              if (checkOut <= checkIn) {
                Alert.alert('Invalid Dates', 'Check-out date must be after check-in date');
                return;
              }

              const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

              Alert.alert(
                'Search Results',
                `Searching for rooms:\n\nCheck-in: ${checkIn.toLocaleDateString()}\nCheck-out: ${checkOut.toLocaleDateString()}\nNights: ${nights}\nGuests: ${guests}\n\nShowing all available properties below.`,
                [{ text: 'OK' }]
              );
            }}>
            <Search size={20} color="#fff" />
            <Text style={styles.searchRoomsButtonText}>Search Rooms</Text>
          </TouchableOpacity>
        </View>

        {/* Special Offers */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Special Offers</Text>
              <Text style={styles.sectionSubtitle}>Limited time deals</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersScroll}>
            {specialOffers.map((offer) => (
              <TouchableOpacity
                key={offer.id}
                style={styles.offerCard}
                activeOpacity={0.9}>
                <Image source={{ uri: offer.image }} style={styles.offerImage} />
                <View style={styles.offerOverlay}>
                  <View style={[styles.discountBadge, { backgroundColor: offer.color }]}>
                    <Text style={styles.discountText}>{offer.discount}</Text>
                  </View>
                  
                  <View style={styles.offerContent}>
                    <Text style={styles.offerTitle} numberOfLines={2}>{offer.title}</Text>
                    
                    <View style={styles.offerLocation}>
                      <MapPin size={14} color="#64748b" />
                      <Text style={styles.offerLocationText} numberOfLines={1}>
                        {offer.property}
                      </Text>
                    </View>

                    <View style={styles.offerFooter}>
                      <View style={styles.validUntilContainer}>
                        <Calendar size={12} color="#64748b" />
                        <Text style={styles.validUntilText}>
                          Valid until {formatDate(offer.validUntil)}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity 
                      style={styles.bookNowButton} 
                      activeOpacity={0.8}
                      onPress={() => {
                        // Find property by name or use first available property
                        const matchingProperty = properties.find(p => 
                          p.name.toLowerCase().includes(offer.property.toLowerCase())
                        );
                        if (matchingProperty) {
                          router.push(`/(user)/property/${matchingProperty.id}`);
                        } else if (properties.length > 0) {
                          router.push(`/(user)/property/${properties[0].id}`);
                        }
                      }}>
                      <Text style={styles.bookNowButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Amenities Quick Filter */}
        <View style={styles.amenitiesSection}>
          <Text style={styles.amenitiesTitle}>Popular Amenities</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.amenitiesScroll}>
            <TouchableOpacity style={styles.amenityChip} activeOpacity={0.7}>
              <Wifi size={18} color="#2563eb" />
              <Text style={styles.amenityChipText}>Free WiFi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.amenityChip} activeOpacity={0.7}>
              <Coffee size={18} color="#2563eb" />
              <Text style={styles.amenityChipText}>Breakfast</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.amenityChip} activeOpacity={0.7}>
              <Dumbbell size={18} color="#2563eb" />
              <Text style={styles.amenityChipText}>Gym</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.amenityChip} activeOpacity={0.7}>
              <Bed size={18} color="#2563eb" />
              <Text style={styles.amenityChipText}>Pool</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {searchQuery === '' && featuredProperties.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Featured Hotels</Text>
                <Text style={styles.sectionSubtitle}>Handpicked for you</Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}>
              {featuredProperties.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={styles.featuredCard}
                  onPress={() => router.push(`/(user)/property/${property.id}`)}
                  activeOpacity={0.9}>
                  <Image source={{ uri: property.images[0] }} style={styles.featuredImage} />
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(property.id)}
                    activeOpacity={0.8}>
                    <Heart
                      color={favorites.includes(property.id) ? '#ef4444' : '#fff'}
                      size={20}
                      fill={favorites.includes(property.id) ? '#ef4444' : 'none'}
                    />
                  </TouchableOpacity>
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredName} numberOfLines={1}>{property.name}</Text>
                    <View style={styles.featuredLocation}>
                      <MapPin color="#fff" size={14} />
                      <Text style={styles.featuredLocationText}>{property.city}, {property.state}</Text>
                    </View>
                    <View style={styles.featuredFooter}>
                      {property.rating > 0 && (
                        <View style={styles.ratingBadge}>
                          <Star color="#fbbf24" size={12} fill="#fbbf24" />
                          <Text style={styles.ratingText}>{property.rating}</Text>
                        </View>
                      )}
                      <Text style={styles.featuredPrice}>₹{property.price}/night</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Upcoming Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <Text style={styles.sectionSubtitle}>Book tickets for exclusive events</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}>
            {upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                activeOpacity={0.9}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventCategoryBadge}>
                  <Text style={styles.eventCategoryText}>{event.category}</Text>
                </View>
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
                  
                  <View style={styles.eventLocation}>
                    <MapPin size={14} color="#64748b" />
                    <Text style={styles.eventLocationText} numberOfLines={1}>
                      {event.venue}
                    </Text>
                  </View>

                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetailItem}>
                      <Calendar size={14} color="#64748b" />
                      <Text style={styles.eventDetailText}>{formatDate(event.date)}</Text>
                    </View>
                    <View style={styles.eventDetailItem}>
                      <Users size={14} color="#64748b" />
                      <Text style={styles.eventDetailText}>{event.attendees} attending</Text>
                    </View>
                  </View>

                  <View style={styles.eventFooter}>
                    <View>
                      <Text style={styles.eventPriceLabel}>From</Text>
                      <Text style={styles.eventPrice}>₹{event.ticketPrice}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.bookTicketButton} 
                      activeOpacity={0.8}
                      onPress={() => {
                        router.push('/(user)/CreateEventScreen');
                      }}>
                      <Text style={styles.bookTicketButtonText}>Book Ticket</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                {searchQuery ? `Results for "${searchQuery}"` : 'All Properties'}
              </Text>
              <Text style={styles.sectionSubtitle}>{allProperties.length} properties available</Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Loading properties...</Text>
            </View>
          ) : allProperties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No properties found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
            </View>
          ) : (
            allProperties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={styles.propertyCard}
              onPress={() => router.push(`/(user)/property/${property.id}`)}
              activeOpacity={0.9}>
              <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
              <View style={styles.propertyContent}>
                <View style={styles.propertyHeader}>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyName} numberOfLines={1}>{property.name}</Text>
                    <View style={styles.propertyLocation}>
                      <MapPin color="#64748b" size={14} />
                      <Text style={styles.propertyLocationText}>{property.city}, {property.state}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(property.id)}
                    activeOpacity={0.8}>
                    <Heart
                      color={favorites.includes(property.id) ? '#ef4444' : '#cbd5e1'}
                      size={22}
                      fill={favorites.includes(property.id) ? '#ef4444' : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.propertyDetails}>
                  <View style={styles.propertyTag}>
                    <Text style={styles.propertyTagText}>{property.type === 'hotel' ? 'Hotel' : 'House'}</Text>
                  </View>
                  <Text style={styles.propertyDetailText}>
                    {property.bedrooms} bed • {property.bathrooms} bath
                  </Text>
                </View>

                <View style={styles.propertyFooter}>
                  {property.rating > 0 ? (
                    <View style={styles.ratingContainer}>
                      <Star color="#fbbf24" size={16} fill="#fbbf24" />
                      <Text style={styles.propertyRating}>{property.rating}</Text>
                      <Text style={styles.propertyReviews}>({property.reviews})</Text>
                    </View>
                  ) : (
                    <Text style={styles.newPropertyBadge}>New</Text>
                  )}
                  <Text style={styles.propertyPrice}>₹{property.price}<Text style={styles.priceUnit}>/night</Text></Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
          )}
        </View>

        {/* Event Hosting CTA - Moved to bottom */}
        <View style={styles.eventHostingBanner}>
          <View style={styles.eventHostingContent}>
            <Text style={styles.eventHostingTitle}>Need a Venue for Your Event?</Text>
            <Text style={styles.eventHostingSubtitle}>
              Book our premium halls and event spaces
            </Text>
            <TouchableOpacity 
              style={styles.eventHostingButton}
              onPress={() => router.push('/(user)/CreateEventScreen')}
              activeOpacity={0.8}>
              <Calendar size={18} color="#2563eb" />
              <Text style={styles.eventHostingButtonText}>Browse Event Venues</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  quickBookingCard: {
    marginHorizontal: 20,
    marginBottom: 28,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  quickBookingHeader: {
    marginBottom: 20,
  },
  quickBookingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  quickBookingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  quickBookingSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  quickBookingInputs: {
    gap: 12,
    marginBottom: 16,
  },
  dateInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  guestsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dateInputText: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
    fontWeight: '500',
  },
  dateValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  searchRoomsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchRoomsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  seeAllText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
  },
  offersScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
  offerCard: {
    width: 300,
    height: 360,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  offerOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  discountBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  offerContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  offerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  offerLocationText: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  offerFooter: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  validUntilContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  validUntilText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  bookNowButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  amenitiesSection: {
    marginHorizontal: 20,
    marginBottom: 28,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  amenitiesScroll: {
    gap: 10,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  amenityChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
  featuredCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredContent: {
    padding: 16,
    backgroundColor: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  featuredLocationText: {
    fontSize: 14,
    color: '#fff',
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventCategoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  eventCategoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  eventLocationText: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  eventDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventDetailText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPriceLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 2,
  },
  eventPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  bookTicketButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  bookTicketButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  propertyImage: {
    width: 120,
    height: '100%',
  },
  propertyContent: {
    flex: 1,
    padding: 12,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  propertyInfo: {
    flex: 1,
    marginRight: 8,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyLocationText: {
    fontSize: 13,
    color: '#64748b',
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  propertyTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  propertyTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e40af',
  },
  propertyDetailText: {
    fontSize: 12,
    color: '#64748b',
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  propertyReviews: {
    fontSize: 12,
    color: '#64748b',
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#64748b',
  },
  newPropertyBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eventHostingBanner: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  eventHostingContent: {
    alignItems: 'center',
  },
  eventHostingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
    textAlign: 'center',
  },
  eventHostingSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    textAlign: 'center',
  },
  eventHostingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: '#2563eb',
  },
  eventHostingButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
  },
  bottomPadding: {
    height: 40,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
  },
});