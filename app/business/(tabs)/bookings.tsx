import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { User, CalendarCheck, Clock, CreditCard, Search, ChevronRight, Filter } from 'lucide-react-native';
import { supabase } from '../../supabaseClient';

// Types
interface Booking {
  id: string;
  guestName: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalCost: number;
  guests: number;
  status: 'confirmed' | 'pending' | 'checked-in' | 'checked-out' | 'cancelled';
}

type TabType = 'recent' | 'checkins' | 'checkouts';


const BookingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }

      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          check_in,
          check_out,
          guests,
          nights,
          total_cost,
          status,
          property_id,
          user_id,
          properties!inner (name, owner_id),
          users!bookings_user_id_fkey (name)
        `)
        .eq('properties.owner_id', user.id)
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        setAllBookings([]);
        return;
      }

      if (bookingsData) {
        const formattedBookings: Booking[] = bookingsData.map((booking: any) => ({
          id: booking.id,
          guestName: booking.users?.name || 'Guest',
          propertyName: booking.properties?.name || 'Property',
          checkIn: booking.check_in,
          checkOut: booking.check_out,
          nights: booking.nights,
          totalCost: parseFloat(booking.total_cost),
          guests: booking.guests,
          status: booking.status,
        }));
        setAllBookings(formattedBookings);
      }
    } catch (error) {
      console.error('Error:', error);
      setAllBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getBookingsData = (): Booking[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (activeTab) {
      case 'recent':
        return allBookings;
      case 'checkins':
        return allBookings.filter((booking) => {
          const checkInDate = new Date(booking.checkIn);
          checkInDate.setHours(0, 0, 0, 0);
          return checkInDate.getTime() === today.getTime() &&
                 (booking.status === 'confirmed' || booking.status === 'pending');
        });
      case 'checkouts':
        return allBookings.filter((booking) => {
          const checkOutDate = new Date(booking.checkOut);
          checkOutDate.setHours(0, 0, 0, 0);
          return checkOutDate.getTime() === today.getTime() &&
                 booking.status === 'checked-in';
        });
      default:
        return allBookings;
    }
  };

  const filteredBookings = getBookingsData().filter(
    (booking) =>
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.checkIn.includes(searchQuery) ||
      booking.checkOut.includes(searchQuery) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'checked-in':
        return '#3b82f6';
      case 'checked-out':
        return '#6b7280';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: Booking['status']) => {
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTabCount = (tab: TabType): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (tab) {
      case 'recent':
        return allBookings.length;
      case 'checkins':
        return allBookings.filter((booking) => {
          const checkInDate = new Date(booking.checkIn);
          checkInDate.setHours(0, 0, 0, 0);
          return checkInDate.getTime() === today.getTime() &&
                 (booking.status === 'confirmed' || booking.status === 'pending');
        }).length;
      case 'checkouts':
        return allBookings.filter((booking) => {
          const checkOutDate = new Date(booking.checkOut);
          checkOutDate.setHours(0, 0, 0, 0);
          return checkOutDate.getTime() === today.getTime() &&
                 booking.status === 'checked-in';
        }).length;
      default:
        return 0;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Bookings</Text>
            <Text style={styles.headerSubtitle}>Manage your hotel reservations</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'recent' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('recent')}>
            <Text style={[
              styles.tabText,
              activeTab === 'recent' && styles.activeTabText,
            ]}>
              Recent
            </Text>
            <View style={[
              styles.tabBadge,
              activeTab === 'recent' && styles.tabBadgeActive,
            ]}>
              <Text style={[
                styles.tabBadgeText,
                activeTab === 'recent' && styles.tabBadgeTextActive,
              ]}>
                {getTabCount('recent')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'checkins' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('checkins')}>
            <Text style={[
              styles.tabText,
              activeTab === 'checkins' && styles.activeTabText,
            ]}>
              Check-ins
            </Text>
            <View style={[
              styles.tabBadge,
              activeTab === 'checkins' && styles.tabBadgeActive,
            ]}>
              <Text style={[
                styles.tabBadgeText,
                activeTab === 'checkins' && styles.tabBadgeTextActive,
              ]}>
                {getTabCount('checkins')}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'checkouts' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('checkouts')}>
            <Text style={[
              styles.tabText,
              activeTab === 'checkouts' && styles.activeTabText,
            ]}>
              Check-outs
            </Text>
            <View style={[
              styles.tabBadge,
              activeTab === 'checkouts' && styles.tabBadgeActive,
            ]}>
              <Text style={[
                styles.tabBadgeText,
                activeTab === 'checkouts' && styles.tabBadgeTextActive,
              ]}>
                {getTabCount('checkouts')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by guest name, date, or ID..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : filteredBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyStateText}>No bookings found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search criteria
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking, index) => (
            <View key={booking.id} style={styles.bookingCard}>
              {/* Header Row */}
              <View style={styles.cardHeader}>
                <View style={styles.guestInfo}>
                  <View style={styles.iconCircle}>
                    <User size={18} color="#3b82f6" />
                  </View>
                  <View>
                    <Text style={styles.guestName}>{booking.guestName}</Text>
                    <Text style={styles.bookingId}>ID: {booking.id}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: getStatusColor(booking.status) + '15',
                      borderLeftWidth: 3,
                      borderLeftColor: getStatusColor(booking.status),
                    },
                  ]}
                >
                  <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                    {getStatusText(booking.status)}
                  </Text>
                </View>
              </View>

              {/* Property Name */}
              <Text style={styles.roomType}>{booking.propertyName}</Text>

              {/* Info Grid */}
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <CalendarCheck size={16} color="#10b981" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Check-in</Text>
                    <Text style={styles.infoValue}>{formatDate(booking.checkIn)}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <CalendarCheck size={16} color="#ef4444" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Check-out</Text>
                    <Text style={styles.infoValue}>{formatDate(booking.checkOut)}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Clock size={16} color="#f59e0b" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Duration</Text>
                    <Text style={styles.infoValue}>{booking.nights} nights</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <CreditCard size={16} color="#3b82f6" />
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>Total Cost</Text>
                    <Text style={styles.infoValue}>₹{booking.totalCost}</Text>
                  </View>
                </View>
              </View>

              {/* View Details Button */}
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>View Details</Text>
                <ChevronRight size={18} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabBadge: {
    minWidth: 24,
    height: 20,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  tabBadgeTextActive: {
    color: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  guestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  bookingId: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderLeftWidth: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  roomType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 16,
    paddingLeft: 4,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
});

export default BookingsScreen;
