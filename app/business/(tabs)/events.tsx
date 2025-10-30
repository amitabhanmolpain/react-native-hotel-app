import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Calendar,
  Users,
  MapPin,
  Edit,
  Trash2,
  Plus,
  X,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Types
interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  organizer: string;
  location: string;
  guests: number;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Cancelled';
  type: 'Wedding' | 'Conference' | 'Party' | 'Meeting' | 'Other';
}

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

interface CalendarDay {
  date: number;
  hasEvent: boolean;
  isToday: boolean;
}

interface AddEventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id'>) => void;
  editingEvent?: Event | null;
}

// Animated Event Card Component
const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getStatusColor = (status: Event['status']): string => {
    switch (status) {
      case 'Upcoming':
        return '#3b82f6';
      case 'In Progress':
        return '#10b981';
      case 'Completed':
        return '#6b7280';
      case 'Cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTypeColor = (type: Event['type']): string => {
    switch (type) {
      case 'Wedding':
        return '#ec4899';
      case 'Conference':
        return '#8b5cf6';
      case 'Party':
        return '#f59e0b';
      case 'Meeting':
        return '#06b6d4';
      default:
        return '#6366f1';
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDelete(event.id) },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.eventCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.eventTypeStrip, { backgroundColor: getTypeColor(event.type) }]} />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.eventTitleRow}>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(event.status)}15` }]}>
              <View style={[styles.statusDot, { backgroundColor: getStatusColor(event.status) }]} />
              <Text style={[styles.statusText, { color: getStatusColor(event.status) }]}>
                {event.status}
              </Text>
            </View>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: `${getTypeColor(event.type)}15` }]}>
            <Text style={[styles.typeText, { color: getTypeColor(event.type) }]}>
              {event.type}
            </Text>
          </View>
        </View>

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Calendar color="#6366f1" size={16} />
            <Text style={styles.detailText}>{event.date}</Text>
            <Clock color="#64748b" size={14} style={{ marginLeft: 8 }} />
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Users color="#10b981" size={16} />
            <Text style={styles.detailText}>{event.organizer}</Text>
            <Text style={styles.guestsText}>• {event.guests} guests</Text>
          </View>
          <View style={styles.detailRow}>
            <MapPin color="#f59e0b" size={16} />
            <Text style={styles.detailText}>{event.location}</Text>
          </View>
        </View>

        <View style={styles.eventActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(event)}
          >
            <Edit color="#6366f1" size={16} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Trash2 color="#ef4444" size={16} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

// Calendar Widget Component
const CalendarWidget: React.FC<{ events: Event[] }> = ({ events }) => {
  const [currentMonth] = useState(new Date());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const getDaysInMonth = (): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().getDate();
    const isCurrentMonth = new Date().getMonth() === month;

    const days: CalendarDay[] = [];
    
    // Add empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push({ date: 0, hasEvent: false, isToday: false });
    }
    
    // Add days of the month
    for (let date = 1; date <= daysInMonth; date++) {
      const hasEvent = events.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === date && eventDate.getMonth() === month;
      });
      days.push({
        date,
        hasEvent,
        isToday: isCurrentMonth && date === today,
      });
    }
    
    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <Animated.View style={[styles.calendarWidget, { opacity: fadeAnim }]}>
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
      </View>
      <View style={styles.calendarDaysHeader}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <Text key={index} style={styles.dayHeader}>{day}</Text>
        ))}
      </View>
      <View style={styles.calendarGrid}>
        {getDaysInMonth().map((day, index) => (
          <View key={index} style={styles.calendarDay}>
            {day.date > 0 && (
              <View style={[
                styles.dayCircle,
                day.isToday && styles.todayCircle,
                day.hasEvent && styles.eventDayCircle,
              ]}>
                <Text style={[
                  styles.dayText,
                  day.isToday && styles.todayText,
                  day.hasEvent && styles.eventDayText,
                ]}>
                  {day.date}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
      <View style={styles.calendarLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#6366f1' }]} />
          <Text style={styles.legendText}>Today</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
          <Text style={styles.legendText}>Has Event</Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Add Event Modal Component
const AddEventModal: React.FC<AddEventModalProps> = ({ visible, onClose, onSave, editingEvent }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [type, setType] = useState<Event['type']>('Wedding');

  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      if (editingEvent) {
        setName(editingEvent.name);
        setDate(editingEvent.date);
        setTime(editingEvent.time);
        setOrganizer(editingEvent.organizer);
        setLocation(editingEvent.location);
        setGuests(editingEvent.guests.toString());
        setType(editingEvent.type);
      } else {
        resetForm();
      }
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 600,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, editingEvent]);

  const resetForm = () => {
    setName('');
    setDate('');
    setTime('');
    setOrganizer('');
    setLocation('');
    setGuests('');
    setType('Wedding');
  };

  const handleSave = () => {
    if (!name || !date || !time || !organizer || !location || !guests) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    onSave({
      name,
      date,
      time,
      organizer,
      location,
      guests: parseInt(guests),
      status: 'Upcoming',
      type,
    });
    onClose();
  };

  const eventTypes: Event['type'][] = ['Wedding', 'Conference', 'Party', 'Meeting', 'Other'];

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color="#64748b" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Annual Conference 2024"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Event Type *</Text>
              <View style={styles.typeSelector}>
                {eventTypes.map((eventType) => (
                  <TouchableOpacity
                    key={eventType}
                    style={[
                      styles.typeChip,
                      type === eventType && styles.typeChipActive,
                    ]}
                    onPress={() => setType(eventType)}
                  >
                    <Text style={[
                      styles.typeChipText,
                      type === eventType && styles.typeChipTextActive,
                    ]}>
                      {eventType}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Date *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/DD/YYYY"
                  value={date}
                  onChangeText={setDate}
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Time *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="HH:MM AM/PM"
                  value={time}
                  onChangeText={setTime}
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Organizer *</Text>
              <TextInput
                style={styles.input}
                placeholder="Name of event organizer"
                value={organizer}
                onChangeText={setOrganizer}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Grand Ballroom, Floor 2"
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Number of Guests *</Text>
              <TextInput
                style={styles.input}
                placeholder="Expected guest count"
                value={guests}
                onChangeText={setGuests}
                keyboardType="numeric"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.saveButtonGradient}
                >
                  <Text style={styles.saveButtonText}>
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Main Events Management Component
const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      name: 'Smith-Johnson Wedding',
      date: '11/15/2024',
      time: '4:00 PM',
      organizer: 'Emily Smith',
      location: 'Grand Ballroom, Floor 2',
      guests: 150,
      status: 'Upcoming',
      type: 'Wedding',
    },
    {
      id: '2',
      name: 'Tech Summit 2024',
      date: '11/20/2024',
      time: '9:00 AM',
      organizer: 'TechCorp Inc.',
      location: 'Conference Hall A',
      guests: 250,
      status: 'Upcoming',
      type: 'Conference',
    },
    {
      id: '3',
      name: 'Corporate Gala Night',
      date: '11/25/2024',
      time: '7:00 PM',
      organizer: 'Business Partners Ltd.',
      location: 'Rooftop Terrace',
      guests: 100,
      status: 'Upcoming',
      type: 'Party',
    },
    {
      id: '4',
      name: 'Annual Board Meeting',
      date: '11/10/2024',
      time: '2:00 PM',
      organizer: 'Management Team',
      location: 'Executive Suite',
      guests: 20,
      status: 'Completed',
      type: 'Meeting',
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const headerFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleAddEvent = (newEvent: Omit<Event, 'id'>) => {
    if (editingEvent) {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...newEvent, id: e.id } : e));
      setEditingEvent(null);
    } else {
      const event: Event = {
        ...newEvent,
        id: Date.now().toString(),
      };
      setEvents([event, ...events]);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setModalVisible(true);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const upcomingEvents = events.filter(e => e.status === 'Upcoming');
  const completedEvents = events.filter(e => e.status === 'Completed');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />

      {/* Header */}
      <Animated.View style={[styles.header, { opacity: headerFadeAnim }]}>
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>Events Management</Text>
          <Text style={styles.headerSubtitle}>Manage hotel events and bookings</Text>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Calendar Widget */}
        <CalendarWidget events={events} />

        {/* Add Event Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingEvent(null);
            setModalVisible(true);
          }}
        >
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addButtonGradient}
          >
            <Plus color="#ffffff" size={24} strokeWidth={3} />
            <Text style={styles.addButtonText}>Add New Event</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{upcomingEvents.length}</Text>
            </View>
          </View>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                delay={index * 100}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <AlertCircle color="#94a3b8" size={48} />
              <Text style={styles.emptyText}>No upcoming events</Text>
              <Text style={styles.emptySubtext}>Add your first event to get started</Text>
            </View>
          )}
        </View>

        {/* Completed Events */}
        {completedEvents.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Completed Events</Text>
              <View style={[styles.countBadge, { backgroundColor: '#f1f5f9' }]}>
                <Text style={[styles.countText, { color: '#64748b' }]}>
                  {completedEvents.length}
                </Text>
              </View>
            </View>
            {completedEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                delay={index * 100}
              />
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Add Event Modal */}
      <AddEventModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingEvent(null);
        }}
        onSave={handleAddEvent}
        editingEvent={editingEvent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  calendarWidget: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  dayHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    width: 36,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayCircle: {
    backgroundColor: '#6366f1',
  },
  eventDayCircle: {
    backgroundColor: '#10b98115',
    borderWidth: 2,
    borderColor: '#10b981',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  todayText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  eventDayText: {
    color: '#10b981',
    fontWeight: '800',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  addButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  countBadge: {
    backgroundColor: '#6366f115',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#6366f1',
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
  },
  eventTypeStrip: {
    height: 6,
  },
  eventContent: {
    padding: 18,
  },
  eventHeader: {
    marginBottom: 14,
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e293b',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  eventDetails: {
    gap: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  guestsText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  editButton: {
    backgroundColor: '#6366f115',
  },
  deleteButton: {
    backgroundColor: '#ef444415',
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6366f1',
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeChipActive: {
    backgroundColor: '#6366f115',
    borderColor: '#6366f1',
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },
  typeChipTextActive: {
    color: '#6366f1',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#64748b',
  },
  saveButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
});