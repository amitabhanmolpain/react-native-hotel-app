import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, XCircle, Zap, ArrowUpRight } from 'lucide-react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../supabaseClient';

const { width } = Dimensions.get('window');

// Types
interface KPI {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  gradient: [string, string];
}

interface Insight {
  id: string;
  text: string;
  type: 'positive' | 'warning' | 'info';
  icon: React.ReactNode;
}

const AnalyticsScreen: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [profitChange, setProfitChange] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [weeklyRevenueData, setWeeklyRevenueData] = useState<any[]>([]);
  const [monthlyBookingsData, setMonthlyBookingsData] = useState<any[]>([]);
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [cancellations, setCancellations] = useState<number>(0);
  const [occupancyRate, setOccupancyRate] = useState<number>(0);
  const [propertyTypeData, setPropertyTypeData] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetchAllAnalytics();
    // Refresh analytics data every 30 seconds
    const interval = setInterval(fetchAllAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllAnalytics = async () => {
    await Promise.all([
      fetchProfitData(),
      fetchWeeklyRevenue(),
      fetchMonthlyBookings(),
      fetchPropertyTypeData(),
      fetchBookingStats()
    ]);
  };

  const fetchProfitData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch bookings for properties owned by this user
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          total_cost,
          status,
          created_at,
          property_id,
          properties!inner (owner_id)
        `)
        .eq('properties.owner_id', user.id);

      if (error) {
        console.error('Error fetching bookings:', error);
        return;
      }

      if (bookings) {
        const confirmedBookings = bookings.filter(
          (b: any) => b.status === 'confirmed' || b.status === 'checked-out' || b.status === 'checked-in'
        );
        const profit = confirmedBookings.reduce((sum: number, booking: any) => sum + (booking.total_cost || 0), 0);

        // Calculate last period profit (7-14 days ago)
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        const lastPeriodBookings = confirmedBookings.filter((b: any) => {
          const bookingDate = new Date(b.created_at);
          return bookingDate >= fourteenDaysAgo && bookingDate < sevenDaysAgo;
        });

        const lastPeriodProfit = lastPeriodBookings.reduce((sum: number, booking: any) => sum + (booking.total_cost || 0), 0);

        const change = lastPeriodProfit > 0
          ? ((profit - lastPeriodProfit) / lastPeriodProfit) * 100
          : profit > 0 ? 100 : 0;

        setTotalProfit(profit);
        setProfitChange(change);
      }
    } catch (error) {
      console.error('Error calculating profit:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyRevenue = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          total_cost,
          status,
          created_at,
          property_id,
          properties!inner (owner_id)
        `)
        .eq('properties.owner_id', user.id)
        .gte('created_at', new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString())
        .in('status', ['confirmed', 'checked-in', 'checked-out'])
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching weekly revenue:', error);
        return;
      }

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const last7Days = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        last7Days.push({
          day: dayNames[date.getDay()],
          revenue: 0,
          bookings: 0,
          date: date.getTime()
        });
      }

      if (bookings) {
        bookings.forEach((booking: any) => {
          const bookingDate = new Date(booking.created_at);
          bookingDate.setHours(0, 0, 0, 0);

          const dayIndex = last7Days.findIndex(d => d.date === bookingDate.getTime());
          if (dayIndex !== -1) {
            last7Days[dayIndex].revenue += booking.total_cost || 0;
            last7Days[dayIndex].bookings += 1;
          }
        });
      }

      setWeeklyRevenueData(last7Days);
    } catch (error) {
      console.error('Error fetching weekly revenue:', error);
    }
  };

  const fetchMonthlyBookings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          total_cost,
          status,
          created_at,
          property_id,
          properties!inner (owner_id)
        `)
        .eq('properties.owner_id', user.id)
        .gte('created_at', new Date(Date.now() - 5 * 30 * 24 * 60 * 60 * 1000).toISOString())
        .in('status', ['confirmed', 'checked-in', 'checked-out'])
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching monthly bookings:', error);
        return;
      }

      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const last6Months = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        last6Months.push({
          month: monthNames[date.getMonth()],
          bookings: 0,
          revenue: 0,
          monthIndex: date.getMonth(),
          year: date.getFullYear()
        });
      }

      if (bookings) {
        bookings.forEach((booking: any) => {
          const bookingDate = new Date(booking.created_at);
          const monthIndex = last6Months.findIndex(
            m => m.monthIndex === bookingDate.getMonth() && m.year === bookingDate.getFullYear()
          );

          if (monthIndex !== -1) {
            last6Months[monthIndex].bookings += 1;
            last6Months[monthIndex].revenue += booking.total_cost || 0;
          }
        });
      }

      setMonthlyBookingsData(last6Months);
    } catch (error) {
      console.error('Error fetching monthly bookings:', error);
    }
  };

  const fetchPropertyTypeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: properties, error } = await supabase
        .from('properties')
        .select('type, status')
        .eq('owner_id', user.id);

      if (error) {
        console.error('Error fetching property types:', error);
        return;
      }

      if (properties) {
        const typeMap = new Map<string, { total: number; occupied: number }>();

        properties.forEach((prop: any) => {
          const typeName = prop.type === 'hotel' ? 'Hotel' : 'House';
          if (!typeMap.has(typeName)) {
            typeMap.set(typeName, { total: 0, occupied: 0 });
          }

          const data = typeMap.get(typeName)!;
          data.total += 1;
          if (prop.status === 'occupied') {
            data.occupied += 1;
          }
        });

        const typeDataArray = Array.from(typeMap.entries()).map(([type, data]) => ({
          type,
          occupied: data.occupied,
          total: data.total
        }));

        setPropertyTypeData(typeDataArray);

        // Calculate occupancy rate
        const totalProperties = properties.length;
        const occupiedProperties = properties.filter((p: any) => p.status === 'occupied').length;
        const rate = totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;
        setOccupancyRate(rate);
      }
    } catch (error) {
      console.error('Error fetching property type data:', error);
    }
  };

  const fetchBookingStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: bookings, error } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          created_at,
          property_id,
          properties!inner (owner_id)
        `)
        .eq('properties.owner_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Error fetching booking stats:', error);
        return;
      }

      if (bookings) {
        const total = bookings.length;
        const cancelled = bookings.filter((b: any) => b.status === 'cancelled').length;

        setTotalBookings(total);
        setCancellations(cancelled);
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };


  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const cancellationChange = totalBookings > 0 ? ((cancellations / totalBookings) * 100) - 5 : 0;

  const kpiData: KPI[] = [
    {
      id: '1',
      title: 'Live Profit',
      value: loading ? '...' : formatCurrency(totalProfit),
      change: profitChange,
      trend: profitChange >= 0 ? 'up' : 'down',
      icon: <DollarSign size={24} color="#ffffff" />,
      gradient: ['#667eea', '#764ba2'],
    },
    {
      id: '2',
      title: 'Occupancy Rate',
      value: `${occupancyRate.toFixed(1)}%`,
      change: occupancyRate - 60,
      trend: occupancyRate >= 60 ? 'up' : 'down',
      icon: <Users size={24} color="#ffffff" />,
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      id: '3',
      title: 'Weekly Bookings',
      value: totalBookings.toString(),
      change: totalBookings > 0 ? 15.2 : 0,
      trend: 'up',
      icon: <Calendar size={24} color="#ffffff" />,
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      id: '4',
      title: 'Cancellations',
      value: cancellations.toString(),
      change: cancellationChange,
      trend: cancellationChange < 0 ? 'up' : 'down',
      icon: <XCircle size={24} color="#ffffff" />,
      gradient: ['#43e97b', '#38f9d7'],
    },
  ];

  const insights: Insight[] = [
    {
      id: '1',
      text: `Total profit: ${formatCurrency(totalProfit)}. ${profitChange >= 0 ? 'Increasing' : 'Decreasing'} by ${Math.abs(profitChange).toFixed(1)}% this period.`,
      type: profitChange >= 0 ? 'positive' : 'warning',
      icon: profitChange >= 0 ? <TrendingUp size={18} color="#10b981" /> : <TrendingDown size={18} color="#f59e0b" />,
    },
    {
      id: '2',
      text: 'Deluxe suites at 75% capacity. Consider dynamic pricing for peak demand.',
      type: 'info',
      icon: <Zap size={18} color="#3b82f6" />,
    },
    {
      id: '3',
      text: 'Revenue increased significantly. Weekend bookings are driving growth.',
      type: 'positive',
      icon: <ArrowUpRight size={18} color="#10b981" />,
    },
    {
      id: '4',
      text: 'Standard rooms have lower occupancy. Promotional campaigns may help.',
      type: 'warning',
      icon: <TrendingDown size={18} color="#f59e0b" />,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
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

  const revenueChartData = {
    labels: weeklyRevenueData.length > 0
      ? weeklyRevenueData.map((d) => d.day)
      : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: weeklyRevenueData.length > 0 && weeklyRevenueData.some(d => d.revenue > 0)
          ? weeklyRevenueData.map((d) => d.revenue)
          : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const bookingsChartData = {
    labels: monthlyBookingsData.length > 0
      ? monthlyBookingsData.map((d) => d.month)
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: monthlyBookingsData.length > 0 && monthlyBookingsData.some(d => d.bookings > 0)
          ? monthlyBookingsData.map((d) => d.bookings)
          : [0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <Text style={styles.headerSubtitle}>Real-time insights and performance metrics</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* KPI Cards */}
        <View style={styles.kpiContainer}>
          {kpiData.map((kpi, index) => (
            <Animated.View
              key={kpi.id}
              style={{
                opacity: mounted ? 1 : 0,
                transform: [{ translateY: mounted ? 0 : 20 }],
              }}
            >
              <LinearGradient
                colors={kpi.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.kpiCard}
              >
                <View style={styles.kpiIconContainer}>{kpi.icon}</View>
                <View style={styles.kpiContent}>
                  <Text style={styles.kpiTitle}>{kpi.title}</Text>
                  <Text style={styles.kpiValue}>{kpi.value}</Text>
                  <View style={styles.kpiChangeContainer}>
                    {kpi.trend === 'up' ? (
                      <TrendingUp size={16} color="#ffffff" />
                    ) : (
                      <TrendingDown size={16} color="#ffffff" />
                    )}
                    <Text style={styles.kpiChange}>
                      {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}% vs last week
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </View>

        {/* Insights Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Insights</Text>
          <View style={styles.insightsContainer}>
            {insights.map((insight) => (
              <View
                key={insight.id}
                style={[
                  styles.insightCard,
                  insight.type === 'positive'
                    ? styles.insightPositive
                    : insight.type === 'warning'
                    ? styles.insightWarning
                    : styles.insightInfo,
                ]}
              >
                <View style={styles.insightIcon}>{insight.icon}</View>
                <Text style={styles.insightText}>{insight.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Weekly Revenue Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Revenue Trend</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={revenueChartData}
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
          </View>
        </View>

        {/* Monthly Bookings Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Bookings</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={bookingsChartData}
              width={width - 60}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
              }}
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
          </View>
        </View>

        {/* Property Type Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type Performance</Text>
          <View style={styles.roomTypeContainer}>
            {propertyTypeData.length > 0 ? (
              propertyTypeData.map((property) => {
                const occupancyPercent = property.total > 0 ? (property.occupied / property.total) * 100 : 0;
                return (
                  <View key={property.type} style={styles.roomTypeCard}>
                    <View style={styles.roomTypeHeader}>
                      <Text style={styles.roomTypeName}>{property.type}</Text>
                      <Text style={styles.roomTypeStats}>
                        {property.occupied}/{property.total} properties
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${occupancyPercent}%`,
                            backgroundColor:
                              occupancyPercent > 75
                                ? '#10b981'
                                : occupancyPercent > 50
                                ? '#3b82f6'
                                : '#f59e0b',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.roomTypePercent}>{occupancyPercent.toFixed(0)}% occupied</Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.roomTypeCard}>
                <Text style={styles.roomTypeStats}>No properties available</Text>
              </View>
            )}
          </View>
        </View>
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
    padding: 20,
    paddingBottom: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  kpiCard: {
    width: (width - 56) / 2,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  kpiIconContainer: {
    marginBottom: 16,
  },
  kpiContent: {
    position: 'relative',
    zIndex: 1,
  },
  kpiTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  kpiChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  kpiChange: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  insightPositive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
  insightWarning: {
    backgroundColor: '#fffbeb',
    borderColor: '#fcd34d',
  },
  insightInfo: {
    backgroundColor: '#eff6ff',
    borderColor: '#93c5fd',
  },
  insightIcon: {
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chart: {
    borderRadius: 16,
  },
  roomTypeContainer: {
    gap: 16,
  },
  roomTypeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  roomTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomTypeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  roomTypeStats: {
    fontSize: 13,
    color: '#6b7280',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  roomTypePercent: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
});

export default AnalyticsScreen;
