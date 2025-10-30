import React, { useState } from 'react';
import { User, CalendarCheck, Clock, CreditCard, Search, ChevronRight, Filter } from 'lucide-react';

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
    <div style={styles.container}>
      {/* Fixed Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.headerTitle}>Bookings</h1>
            <p style={styles.headerSubtitle}>Manage your hotel reservations</p>
          </div>
          <button style={styles.filterButton}>
            <Filter size={20} color="#64748b" />
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'recent' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('recent')}>
            <span style={{
              ...styles.tabText,
              ...(activeTab === 'recent' ? styles.activeTabText : {}),
            }}>
              Recent
            </span>
            <span style={{
              ...styles.tabBadge,
              ...(activeTab === 'recent' ? styles.tabBadgeActive : {}),
            }}>
              {getTabCount('recent')}
            </span>
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'checkins' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('checkins')}>
            <span style={{
              ...styles.tabText,
              ...(activeTab === 'checkins' ? styles.activeTabText : {}),
            }}>
              Check-ins
            </span>
            <span style={{
              ...styles.tabBadge,
              ...(activeTab === 'checkins' ? styles.tabBadgeActive : {}),
            }}>
              {getTabCount('checkins')}
            </span>
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'checkouts' ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab('checkouts')}>
            <span style={{
              ...styles.tabText,
              ...(activeTab === 'checkouts' ? styles.activeTabText : {}),
            }}>
              Check-outs
            </span>
            <span style={{
              ...styles.tabBadge,
              ...(activeTab === 'checkouts' ? styles.tabBadgeActive : {}),
            }}>
              {getTabCount('checkouts')}
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <Search size={20} color="#9ca3af" />
          <input
            style={styles.searchInput}
            placeholder="Search by guest name, date, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={styles.scrollView}>
        <div style={styles.scrollContent}>
          {filteredBookings.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔍</div>
              <p style={styles.emptyStateText}>No bookings found</p>
              <p style={styles.emptyStateSubtext}>
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            filteredBookings.map((booking, index) => (
              <div 
                key={booking.id} 
                style={{
                  ...styles.bookingCard,
                  animation: `slideIn 0.3s ease ${index * 0.05}s both`,
                }}>
                {/* Header Row */}
                <div style={styles.cardHeader}>
                  <div style={styles.guestInfo}>
                    <div style={styles.iconCircle}>
                      <User size={18} color="#3b82f6" />
                    </div>
                    <div>
                      <div style={styles.guestName}>{booking.guestName}</div>
                      <div style={styles.bookingId}>ID: {booking.id}</div>
                    </div>
                  </div>
                  <div
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(booking.status) + '15',
                      borderLeft: `3px solid ${getStatusColor(booking.status)}`,
                    }}>
                    <span style={{ ...styles.statusText, color: getStatusColor(booking.status) }}>
                      {getStatusText(booking.status)}
                    </span>
                  </div>
                </div>

                {/* Room Type */}
                <div style={styles.roomType}>{booking.roomType}</div>

                {/* Info Grid */}
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <CalendarCheck size={16} color="#10b981" />
                    <div style={styles.infoTextContainer}>
                      <div style={styles.infoLabel}>Check-in</div>
                      <div style={styles.infoValue}>{formatDate(booking.checkIn)}</div>
                    </div>
                  </div>

                  <div style={styles.infoItem}>
                    <CalendarCheck size={16} color="#ef4444" />
                    <div style={styles.infoTextContainer}>
                      <div style={styles.infoLabel}>Check-out</div>
                      <div style={styles.infoValue}>{formatDate(booking.checkOut)}</div>
                    </div>
                  </div>
                </div>

                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <Clock size={16} color="#f59e0b" />
                    <div style={styles.infoTextContainer}>
                      <div style={styles.infoLabel}>Duration</div>
                      <div style={styles.infoValue}>{booking.duration} nights</div>
                    </div>
                  </div>

                  <div style={styles.infoItem}>
                    <CreditCard size={16} color="#3b82f6" />
                    <div style={styles.infoTextContainer}>
                      <div style={styles.infoLabel}>Total Cost</div>
                      <div style={styles.infoValue}>${booking.totalCost}</div>
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <button style={styles.detailsButton}>
                  <span style={styles.detailsButtonText}>View Details</span>
                  <ChevronRight size={18} color="#3b82f6" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 4px 0',
  },
  headerSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  filterButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '10px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tabText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#ffffff',
  },
  tabBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#e5e7eb',
    padding: '2px 8px',
    borderRadius: '12px',
    minWidth: '24px',
    textAlign: 'center',
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: '14px',
    color: '#111827',
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    boxSizing: 'border-box',
  },
  scrollContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  guestInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  iconCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '2px',
  },
  bookingId: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '6px',
  },
  statusText: {
    fontSize: '12px',
    fontWeight: '600',
  },
  roomType: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '16px',
    paddingLeft: '4px',
  },
  infoGrid: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: '10px',
    borderRadius: '8px',
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    marginBottom: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  infoValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
  },
  detailsButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '12px',
    padding: '10px',
    backgroundColor: '#eff6ff',
    borderRadius: '8px',
    gap: '4px',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    transition: 'all 0.2s ease',
  },
  detailsButtonText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#3b82f6',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyStateText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
  },
  emptyStateSubtext: {
    fontSize: '14px',
    color: '#9ca3af',
  },
};

export default BookingsScreen;