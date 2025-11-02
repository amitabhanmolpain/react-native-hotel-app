import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Animated,
} from 'react-native';
import { User, CalendarCheck, Clock, CreditCard, Search, ChevronRight, Filter } from 'lucide-react-native';

// Types
interface Booking {
  id: string;
  guestName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  duration: number;
  totalCost: number;
  status: 'confirmed' | 'pending' | 'checked-in' | 'checked-out' | 'cancelled';
}

type TabType = 'recent' | 'checkins' | 'checkouts';

// Dummy Data
const recentBookings: Booking[] = [
  {
    id: 'B001',
    guestName: 'Sarah Johnson',
    roomType: 'Deluxe Suite',
    checkIn: '2025-10-28',
    checkOut: '2025-11-01',
    duration: 4,
    totalCost: 1200,
    status: 'confirmed',
  },
  {
    id: 'B002',
    guestName: 'Michael Chen',
    roomType: 'Standard Room',
    checkIn: '2025-10-30',
    checkOut: '2025-11-02',
    duration: 3,
    totalCost: 450,
    status: 'pending',
  },
  {
    id: 'B003',
    guestName: 'Emma Williams',
    roomType: 'Presidential Suite',
    checkIn: '2025-11-01',
    checkOut: '2025-11-05',
    duration: 4,
    totalCost: 3200,
    status: 'confirmed',
  },
  {
    id: 'B004',
    guestName: 'David Martinez',
    roomType: 'Family Room',
    checkIn: '2025-10-29',
    checkOut: '2025-10-31',
    duration: 2,
    totalCost: 380,
    status: 'cancelled',
  },
  {
    id: 'B005',
    guestName: 'Jessica Brown',
    roomType: 'Ocean View Suite',
    checkIn: '2025-11-02',
    checkOut: '2025-11-06',
    duration: 4,
    totalCost: 1800,
    status: 'confirmed',
  },
  {
    id: 'B006',
    guestName: 'Daniel Lee',
    roomType: 'Executive Suite',
    checkIn: '2025-10-31',
    checkOut: '2025-11-03',
    duration: 3,
    totalCost: 1050,
    status: 'pending',
  },
];

const checkInBookings: Booking[] = [
  {
    id: 'C001',
    guestName: 'Robert Taylor',
    roomType: 'Deluxe Suite',
    checkIn: '2025-10-30',
    checkOut: '2025-11-03',
    duration: 4,
    totalCost: 1400,
    status: 'confirmed',
  },
  {
    id: 'C002',
    guestName: 'Lisa Anderson',
    roomType: 'Ocean View Room',
    checkIn: '2025-10-30',
    checkOut: '2025-11-01',
    duration: 2,
    totalCost: 620,
    status: 'confirmed',
  },
  {
    id: 'C003',
    guestName: 'James Brown',
    roomType: 'Standard Room',
    checkIn: '2025-10-30',
    checkOut: '2025-11-04',
    duration: 5,
    totalCost: 750,
    status: 'pending',
  },
  {
    id: 'C004',
    guestName: 'Maria Garcia',
    roomType: 'Luxury Suite',
    checkIn: '2025-10-30',
    checkOut: '2025-11-02',
    duration: 3,
    totalCost: 1350,
    status: 'confirmed',
  },
];

const checkOutBookings: Booking[] = [
  {
    id: 'O001',
    guestName: 'Patricia Davis',
    roomType: 'Executive Suite',
    checkIn: '2025-10-27',
    checkOut: '2025-10-30',
    duration: 3,
    totalCost: 1050,
    status: 'checked-in',
  },
  {
    id: 'O002',
    guestName: 'Christopher Wilson',
    roomType: 'Standard Room',
    checkIn: '2025-10-28',
    checkOut: '2025-10-30',
    duration: 2,
    totalCost: 300,
    status: 'checked-in',
  },
  {
    id: 'O003',
    guestName: 'Jennifer Moore',
    roomType: 'Deluxe Suite',
    checkIn: '2025-10-26',
    checkOut: '2025-10-30',
    duration: 4,
    totalCost: 1400,
    status: 'checked-in',
  },
];

const BookingsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [searchQuery, setSearchQuery] = useState('');

  const getBookingsData = (): Booking[] => {
    switch (activeTab) {
      case 'recent':
        return recentBookings;
      case 'checkins':
        return checkInBookings;
      case 'checkouts':
        return checkOutBookings;
      default:
        return recentBookings;
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
    switch (tab) {
      case 'recent':
        return recentBookings.length;
      case 'checkins':
        return checkInBookings.length;
      case 'checkouts':
        return checkOutBookings.length;
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
        {filteredBookings.length === 0 ? (
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

              {/* Room Type */}
              <Text style={styles.roomType}>{booking.roomType}</Text>

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
                    <Text style={styles.infoValue}>{booking.duration} nights</Text>
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
});

export default BookingsScreen;
