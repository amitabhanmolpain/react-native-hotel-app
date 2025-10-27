import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Music,
  Utensils,
  Briefcase,
  PartyPopper,
  ChevronRight,
  Filter,
} from 'lucide-react-native';

// Mock Data
const upcomingEvents = [
  {
    id: '1',
    title: 'Wedding Reception - Johnson & Smith',
    type: 'wedding',
    property: 'Grand Plaza Hotel',
    hall: 'Crystal Ballroom',
    date: '2025-11-02',
    time: '18:00',
    duration: '5 hours',
    attendees: 250,
    status: 'confirmed',
    color: '#ec4899',
  },
  {
    id: '2',
    title: 'Corporate Annual Meeting',
    type: 'business',
    property: 'Downtown Business Hotel',
    hall: 'Conference Hall A',
    date: '2025-10-29',
    time: '09:00',
    duration: '8 hours',
    attendees: 120,
    status: 'confirmed',
    color: '#3b82f6',
  },
  {
    id: '3',
    title: 'Birthday Celebration - Sarah Anderson',
    type: 'party',
    property: 'Grand Plaza Hotel',
    hall: 'Garden Terrace',
    date: '2025-10-30',
    time: '19:30',
    duration: '4 hours',
    attendees: 80,
    status: 'pending',
    color: '#f59e0b',
  },
  {
    id: '4',
    title: 'Gala Dinner & Fundraiser',
    type: 'dining',
    property: 'Luxury Resort & Spa',
    hall: 'Grand Dining Hall',
    date: '2025-11-05',
    time: '20:00',
    duration: '3 hours',
    attendees: 180,
    status: 'confirmed',
    color: '#10b981',
  },
  {
    id: '5',
    title: 'Live Jazz Concert',
    type: 'concert',
    property: 'Grand Plaza Hotel',
    hall: 'Rooftop Lounge',
    date: '2025-11-08',
    time: '21:00',
    duration: '3 hours',
    attendees: 150,
    status: 'confirmed',
    color: '#8b5cf6',
  },
  {
    id: '6',
    title: 'Product Launch Event',
    type: 'business',
    property: 'Downtown Business Hotel',
    hall: 'Innovation Center',
    date: '2025-11-12',
    time: '14:00',
    duration: '4 hours',
    attendees: 200,
    status: 'pending',
    color: '#3b82f6',
  },
];

export default function UpcomingEventsScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'wedding':
        return <PartyPopper size={20} color="#fff" />;
      case 'business':
        return <Briefcase size={20} color="#fff" />;
      case 'party':
        return <PartyPopper size={20} color="#fff" />;
      case 'dining':
        return <Utensils size={20} color="#fff" />;
      case 'concert':
        return <Music size={20} color="#fff" />;
      default:
        return <Calendar size={20} color="#fff" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    return formatDate(dateString);
  };

  const filteredEvents = selectedFilter === 'all' 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.type === selectedFilter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <ArrowLeft color="#1e293b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
          <Filter color="#475569" size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Stats Overview */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{upcomingEvents.length}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {upcomingEvents.filter(e => e.status === 'confirmed').length}
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {upcomingEvents.reduce((sum, e) => sum + e.attendees, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Guests</Text>
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterChipsContainer}
          contentContainerStyle={styles.filterChipsContent}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'all' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('all')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'all' && styles.filterChipTextActive,
              ]}>
              All Events
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'wedding' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('wedding')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'wedding' && styles.filterChipTextActive,
              ]}>
              Weddings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'business' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('business')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'business' && styles.filterChipTextActive,
              ]}>
              Business
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'party' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('party')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'party' && styles.filterChipTextActive,
              ]}>
              Parties
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedFilter === 'concert' && styles.filterChipActive,
            ]}
            onPress={() => setSelectedFilter('concert')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterChipText,
                selectedFilter === 'concert' && styles.filterChipTextActive,
              ]}>
              Concerts
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Events List */}
        <View style={styles.eventsContainer}>
          {filteredEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              activeOpacity={0.7}>
              <View style={styles.eventCardLeft}>
                <View
                  style={[
                    styles.eventIconContainer,
                    { backgroundColor: event.color },
                  ]}>
                  {getEventIcon(event.type)}
                </View>
              </View>

              <View style={styles.eventCardContent}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {event.title}
                  </Text>
                  {event.status === 'confirmed' && (
                    <View style={styles.confirmedBadge}>
                      <View style={styles.confirmedDot} />
                    </View>
                  )}
                </View>

                <View style={styles.eventDetails}>
                  <View style={styles.eventDetailRow}>
                    <MapPin size={14} color="#64748b" />
                    <Text style={styles.eventDetailText}>
                      {event.property} • {event.hall}
                    </Text>
                  </View>

                  <View style={styles.eventDetailRow}>
                    <Calendar size={14} color="#64748b" />
                    <Text style={styles.eventDetailText}>
                      {getDaysUntil(event.date)}
                    </Text>
                    <Text style={styles.eventDetailDivider}>•</Text>
                    <Clock size={14} color="#64748b" />
                    <Text style={styles.eventDetailText}>{event.time}</Text>
                  </View>

                  <View style={styles.eventDetailRow}>
                    <Users size={14} color="#64748b" />
                    <Text style={styles.eventDetailText}>
                      {event.attendees} guests • {event.duration}
                    </Text>
                  </View>
                </View>

                <View style={styles.eventFooter}>
                  <View
                    style={[
                      styles.eventTypeBadge,
                      { backgroundColor: `${event.color}15` },
                    ]}>
                    <Text
                      style={[styles.eventTypeText, { color: event.color }]}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.viewDetailsButton}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <ChevronRight size={16} color="#2563eb" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
  backButton: {
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
  filterButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  filterChipsContainer: {
    marginBottom: 20,
  },
  filterChipsContent: {
    gap: 10,
    paddingRight: 20,
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
  eventsContainer: {
    gap: 16,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  eventCardLeft: {
    marginRight: 16,
  },
  eventIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventCardContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  confirmedBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginTop: 6,
  },
  confirmedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  eventDetails: {
    gap: 8,
    marginBottom: 12,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventDetailText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  eventDetailDivider: {
    fontSize: 13,
    color: '#cbd5e1',
    marginHorizontal: 2,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  eventTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
  },
  bottomPadding: {
    height: 40,
  },
});