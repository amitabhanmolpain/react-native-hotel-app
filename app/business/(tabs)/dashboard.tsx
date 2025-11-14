import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Home,
  Bed,
  DollarSign,
  TrendingUp,
  Plus,
  Calendar,
  Users,
  Eye,
  MapPin,
} from 'lucide-react-native';
import { supabase } from '../../supabaseClient';

const { width } = Dimensions.get('window');

// Types
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  gradient: [string, string];
  subtitle?: string;
  delay?: number;
}

interface QuickActionProps {
  title: string;
  icon: React.ComponentType<any>;
  color: string;
  onPress: () => void;
  delay?: number;
}

interface PropertyCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
  location: string;
  ownerName: string;
  delay?: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

// Animated Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  subtitle,
  delay = 0 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statGradient}
      >
        <View style={styles.iconContainer}>
          <Icon color="#ffffff" size={24} strokeWidth={2.5} />
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Animated Quick Action Button
const QuickActionButton: React.FC<QuickActionProps> = ({ 
  title, 
  icon: Icon, 
  color, 
  onPress,
  delay = 0 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.actionButton,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={styles.actionTouchable}
      >
        <View style={[styles.actionIconWrapper, { backgroundColor: `${color}15` }]}>
          <Icon color={color} size={24} strokeWidth={2.5} />
        </View>
        <Text style={styles.actionTitle}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Animated Property Card
const PropertyCard: React.FC<PropertyCardProps> = ({
  name,
  image,
  price,
  status,
  location,
  ownerName,
  delay = 0,
}) => {
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

  const getStatusColor = (): string => {
    switch (status) {
      case 'Available':
        return '#10b981';
      case 'Occupied':
        return '#f59e0b';
      case 'Maintenance':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <Animated.View
      style={[
        styles.propertyCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.9} style={styles.propertyTouchable}>
        <Image source={{ uri: image }} style={styles.propertyImage} />
        <View style={styles.propertyInfo}>
          <View style={styles.propertyHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.propertyName}>{name}</Text>
              <Text style={styles.ownerNameText}>By {ownerName}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${getStatusColor()}15` },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
              />
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {status}
              </Text>
            </View>
          </View>
          <View style={styles.propertyLocation}>
            <MapPin color="#94a3b8" size={14} />
            <Text style={styles.locationText}>{location}</Text>
          </View>
          <View style={styles.propertyFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceAmount}>₹{price}</Text>
              <Text style={styles.priceLabel}>/night</Text>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Eye color="#6366f1" size={18} />
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const router = useRouter();
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyBookings, setWeeklyBookings] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [weekDays, setWeekDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);

  useEffect(() => {
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    fetchProperties();
    fetchWeeklyBookings();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('User not authenticated');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching properties:', error);
      } else if (data) {
        setProperties(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyBookings = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      // Get bookings for properties owned by this user in the last 7 days
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          created_at,
          property_id,
          properties!inner (owner_id)
        `)
        .eq('properties.owner_id', user.id)
        .gte('created_at', new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        return;
      }

      // Create array for last 7 days
      const last7Days = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const counts = new Array(7).fill(0);
      const labels = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        last7Days.push(date);
        labels.push(dayNames[date.getDay()]);
      }

      // Count bookings per day
      if (bookingsData) {
        bookingsData.forEach((booking: any) => {
          const bookingDate = new Date(booking.created_at);
          bookingDate.setHours(0, 0, 0, 0);

          const dayIndex = last7Days.findIndex(d => d.getTime() === bookingDate.getTime());
          if (dayIndex !== -1) {
            counts[dayIndex]++;
          }
        });
      }

      setWeeklyBookings(counts);
      setWeekDays(labels);
    } catch (error) {
      console.error('Error fetching weekly bookings:', error);
    }
  };

  const availableProperties = properties.filter(p => p.status === 'available').length;
  const occupiedProperties = properties.filter(p => p.status === 'occupied').length;
  const totalRevenue = properties.reduce((sum, p) => sum + (p.price || 0), 0);

  const stats: Omit<StatCardProps, 'delay'>[] = [
    {
      title: 'Total Properties',
      value: properties.length.toString(),
      icon: Home,
      gradient: ['#6366f1', '#8b5cf6'],
      subtitle: 'Your listings',
    },
    {
      title: 'Occupied',
      value: occupiedProperties.toString(),
      icon: Bed,
      gradient: ['#06b6d4', '#3b82f6'],
      subtitle: properties.length > 0 ? `${Math.round((occupiedProperties / properties.length) * 100)}% occupancy` : '0% occupancy',
    },
    {
      title: 'Available',
      value: availableProperties.toString(),
      icon: TrendingUp,
      gradient: ['#10b981', '#14b8a6'],
      subtitle: 'Ready to book',
    },
    {
      title: 'Avg Price',
      value: properties.length > 0 ? `₹${Math.round(totalRevenue / properties.length)}` : '₹0',
      icon: DollarSign,
      gradient: ['#f59e0b', '#eab308'],
      subtitle: 'Per night',
    },
  ];

  const quickActions: Omit<QuickActionProps, 'delay'>[] = [
    {
      title: 'Add Property',
      icon: Plus,
      color: '#6366f1',
      onPress: () => router.push('/business/add-room'),
    },
    {
      title: 'View Bookings',
      icon: Calendar,
      color: '#06b6d4',
      onPress: () => router.push('/business/(tabs)/bookings'),
    },
    {
      title: 'Manage Staff',
      icon: Users,
      color: '#10b981',
      onPress: () => router.push('/business/manage-staff'),
    },
  ];

  const propertyCards: Omit<PropertyCardProps, 'delay'>[] = properties.map(prop => ({
    id: prop.id,
    name: prop.name,
    image: Array.isArray(prop.images) && prop.images.length > 0 ? prop.images[0] : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    price: prop.price || 0,
    status: prop.status === 'available' ? 'Available' : prop.status === 'occupied' ? 'Occupied' : 'Maintenance',
    location: `${prop.city}, ${prop.state}`,
    ownerName: prop.owner_name || 'Owner',
  }));

  const chartData: ChartData = {
    labels: weekDays,
    datasets: [
      {
        data: weeklyBookings.length > 0 && weeklyBookings.some(v => v > 0)
          ? weeklyBookings
          : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 11,
      fontWeight: '600' as const,
      fill: '#64748b',
    },
  };

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
          <Text style={styles.headerGreeting}>Good Morning 👋</Text>
          <Text style={styles.headerTitle}>Hotel Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage your properties efficiently</Text>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} delay={index * 100} />
          ))}
        </View>

        {/* Weekly Booking Trend Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Booking Trend</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={chartData}
              width={width - 60}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              withDots={true}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={true}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero
            />
            <View style={styles.chartLegend}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Bookings per day</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <QuickActionButton key={index} {...action} delay={index * 100} />
            ))}
          </View>
        </View>

        {/* Active Properties */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Properties</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text style={{ color: '#6b7280', fontSize: 14 }}>Loading properties...</Text>
            </View>
          ) : propertyCards.length === 0 ? (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
              <Text style={{ color: '#6b7280', fontSize: 14 }}>No properties added yet</Text>
            </View>
          ) : (
            propertyCards.map((property, index) => (
              <PropertyCard key={property.id} {...property} delay={index * 100} />
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  headerGreeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    marginBottom: 6,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  statGradient: {
    padding: 18,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 28,
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
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  chart: {
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6366f1',
  },
  legendText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  actionTouchable: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
  },
  propertyCard: {
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
  propertyTouchable: {
    flexDirection: 'row',
  },
  propertyImage: {
    width: 110,
    height: 140,
    resizeMode: 'cover',
  },
  propertyInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  propertyName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  ownerNameText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e293b',
    marginRight: 2,
  },
  priceLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  viewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366f1',
  },
});

export default Dashboard;
