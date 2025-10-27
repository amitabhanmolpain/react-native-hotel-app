import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {
  ChevronLeft,
  Calendar,
  User,
  Bed,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

// Type definitions
interface Activity {
  id: string;
  event: string;
  guest: string;
  timestamp: string;
  type: 'checkout' | 'booking' | 'checkin' | 'cancellation';
}

interface RoomBooking {
  id: string;
  room: string;
  roomType: string;
  guest: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: 'ongoing' | 'upcoming' | 'checkedout';
}

interface AvailableRoom {
  id: string;
  room: string;
  roomType: string;
  pricePerNight: number;
  status: 'available';
}

interface CalendarData {
  date: string;
  room: string;
  status: 'booked';
}

type ExpandedItems = Record<string, boolean>;

// Mock Data
const recentActivity: Activity[] = [
  {
    id: '1',
    event: 'Room 102 checked out',
    guest: 'Sarah Johnson',
    timestamp: '2 hours ago',
    type: 'checkout',
  },
  {
    id: '2',
    event: 'New booking by Jane Smith',
    guest: 'Jane Smith',
    timestamp: '5 hours ago',
    type: 'booking',
  },
  {
    id: '3',
    event: 'Room 205 checked in',
    guest: 'Michael Brown',
    timestamp: '1 day ago',
    type: 'checkin',
  },
  {
    id: '4',
    event: 'Booking cancelled - Room 310',
    guest: 'Emily Davis',
    timestamp: '2 days ago',
    type: 'cancellation',
  },
];

const roomsBooked: RoomBooking[] = [
  {
    id: '1',
    room: '101',
    roomType: 'Deluxe Suite',
    guest: 'John Doe',
    checkIn: '2025-10-25',
    checkOut: '2025-10-30',
    nights: 5,
    totalPrice: 750,
    status: 'ongoing',
  },
  {
    id: '2',
    room: '203',
    roomType: 'Standard Room',
    guest: 'Alice Williams',
    checkIn: '2025-10-28',
    checkOut: '2025-11-02',
    nights: 5,
    totalPrice: 500,
    status: 'upcoming',
  },
  {
    id: '3',
    room: '305',
    roomType: 'Executive Suite',
    guest: 'Robert Taylor',
    checkIn: '2025-10-26',
    checkOut: '2025-10-29',
    nights: 3,
    totalPrice: 600,
    status: 'ongoing',
  },
];

const availableRooms: AvailableRoom[] = [
  {
    id: '1',
    room: '104',
    roomType: 'Deluxe Suite',
    pricePerNight: 150,
    status: 'available',
  },
  {
    id: '2',
    room: '207',
    roomType: 'Standard Room',
    pricePerNight: 100,
    status: 'available',
  },
  {
    id: '3',
    room: '312',
    roomType: 'Executive Suite',
    pricePerNight: 200,
    status: 'available',
  },
  {
    id: '4',
    room: '115',
    roomType: 'Standard Room',
    pricePerNight: 100,
    status: 'available',
  },
];

const calendarData: CalendarData[] = [
  { date: '25', room: '101', status: 'booked' },
  { date: '26', room: '101', status: 'booked' },
  { date: '27', room: '101', status: 'booked' },
  { date: '28', room: '203', status: 'booked' },
  { date: '29', room: '203', status: 'booked' },
];

export default function ViewBookingsScreen() {
  const [activeTab, setActiveTab] = useState<'recent' | 'booked' | 'available'>('recent');
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>({});
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'checkedout'>('all');
  const [showCalendar, setShowCalendar] = useState(false);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCheckout = (roomId: string) => {
    // Static action for now
    console.log('Checkout:', roomId);
  };

  const getStatusColor = (status: RoomBooking['status']) => {
    switch (status) {
      case 'ongoing':
        return '#3B82F6';
      case 'upcoming':
        return '#10B981';
      case 'checkedout':
        return '#6B7280';
      default:
        return '#3B82F6';
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'checkout':
        return <CheckCircle size={16} color="#10B981" />;
      case 'booking':
        return <Calendar size={16} color="#3B82F6" />;
      case 'checkin':
        return <User size={16} color="#8B5CF6" />;
      case 'cancellation':
        return <AlertCircle size={16} color="#EF4444" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  const filteredBookings = roomsBooked.filter((booking) => {
    if (activeFilter === 'all') return true;
    return booking.status === activeFilter;
  });

  const renderRecentActivity = () => (
    <View style={styles.listContainer}>
      {recentActivity.map((activity) => (
        <TouchableOpacity
          key={activity.id}
          style={styles.card}
          onPress={() => toggleExpand(`activity-${activity.id}`)}
        >
          <View style={styles.cardHeader}>
            <View style={styles.activityHeader}>
              {getActivityIcon(activity.type)}
              <Text style={styles.cardTitle}>{activity.event}</Text>
            </View>
            {expandedItems[`activity-${activity.id}`] ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </View>
          {expandedItems[`activity-${activity.id}`] && (
            <View style={styles.expandedContent}>
              <View style={styles.detailRow}>
                <User size={16} color="#6B7280" />
                <Text style={styles.detailText}>Guest: {activity.guest}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.detailText}>{activity.timestamp}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRoomsBooked = () => (
    <View style={styles.listContainer}>
      {filteredBookings.map((booking) => (
        <TouchableOpacity
          key={booking.id}
          style={styles.card}
          onPress={() => toggleExpand(`booking-${booking.id}`)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Room {booking.room} – {booking.guest}
            </Text>
            {expandedItems[`booking-${booking.id}`] ? (
              <ChevronUp size={20} color="#6B7280" />
            ) : (
              <ChevronDown size={20} color="#6B7280" />
            )}
          </View>
          {expandedItems[`booking-${booking.id}`] && (
            <View style={styles.expandedContent}>
              <View style={styles.detailRow}>
                <Bed size={16} color="#6B7280" />
                <Text style={styles.detailText}>{booking.roomType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  Check-in: {booking.checkIn}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  Check-out: {booking.checkOut}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.detailText}>
                  {booking.nights} nights
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.priceLabel}>Total:</Text>
                <Text style={styles.priceValue}>${booking.totalPrice}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(booking.status) },
                  ]}
                >
                  {booking.status.toUpperCase()}
                </Text>
              </View>
              {booking.status === 'ongoing' && (
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={() => handleCheckout(booking.id)}
                >
                  <CheckCircle size={16} color="#FFFFFF" />
                  <Text style={styles.checkoutButtonText}>
                    Mark as Checked Out
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAvailableRooms = () => (
    <View style={styles.listContainer}>
      {availableRooms.map((room) => (
        <TouchableOpacity
          key={room.id}
          style={styles.card}
          onPress={() => toggleExpand(`available-${room.id}`)}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Room {room.room}</Text>
            <View style={styles.availableBadge}>
              <View style={styles.greenDot} />
              <Text style={styles.availableText}>Available</Text>
            </View>
          </View>
          {expandedItems[`available-${room.id}`] && (
            <View style={styles.expandedContent}>
              <View style={styles.detailRow}>
                <Bed size={16} color="#6B7280" />
                <Text style={styles.detailText}>{room.roomType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.priceLabel}>Price per night:</Text>
                <Text style={styles.priceValue}>${room.pricePerNight}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCalendarView = () => (
    <View style={styles.calendarContainer}>
      <TouchableOpacity
        style={styles.calendarHeader}
        onPress={() => setShowCalendar(!showCalendar)}
      >
        <View style={styles.calendarHeaderContent}>
          <Calendar size={20} color="#3B82F6" />
          <Text style={styles.calendarTitle}>October 2025 Calendar View</Text>
        </View>
        {showCalendar ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </TouchableOpacity>
      {showCalendar && (
        <View style={styles.calendarGrid}>
          <View style={styles.calendarWeekHeader}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>
          <View style={styles.calendarDays}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isBooked = calendarData.some((d) => d.date === String(day));
              return (
                <View
                  key={day}
                  style={[
                    styles.calendarDay,
                    isBooked && styles.calendarDayBooked,
                  ]}
                >
                  <Text
                    style={[
                      styles.calendarDayText,
                      isBooked && styles.calendarDayTextBooked,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Bookings</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.tabActive]}
          onPress={() => setActiveTab('recent')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'recent' && styles.tabTextActive,
            ]}
          >
            Recent Activity
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'booked' && styles.tabActive]}
          onPress={() => setActiveTab('booked')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'booked' && styles.tabTextActive,
            ]}
          >
            Rooms Booked
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.tabActive]}
          onPress={() => setActiveTab('available')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'available' && styles.tabTextActive,
            ]}
          >
            Available Rooms
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'booked' && (
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'all' && styles.filterTextActive,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'upcoming' && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter('upcoming')}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'upcoming' && styles.filterTextActive,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'ongoing' && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter('ongoing')}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'ongoing' && styles.filterTextActive,
              ]}
            >
              Ongoing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === 'checkedout' && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter('checkedout')}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === 'checkedout' && styles.filterTextActive,
              ]}
            >
              Checked Out
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'recent' && renderRecentActivity()}
        {activeTab === 'booked' && renderRoomsBooked()}
        {activeTab === 'available' && renderAvailableRooms()}

        {renderCalendarView()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 'auto',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  availableText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
  },
  calendarContainer: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarGrid: {
    marginTop: 16,
  },
  calendarWeekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 40,
    textAlign: 'center',
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  calendarDayBooked: {
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
  },
  calendarDayText: {
    fontSize: 14,
    color: '#6B7280',
  },
  calendarDayTextBooked: {
    color: '#3B82F6',
    fontWeight: '600',
  },
});