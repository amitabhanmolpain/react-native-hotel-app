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

  useEffect(() => {
    setMounted(true);
    fetchProfitData();
    // Refresh profit data every 30 seconds
    const interval = setInterval(fetchProfitData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProfitData = async () => {
    try {
      // Fetch bookings from Supabase
      const { data: bookings, error } = await supabase
        .from('bookings')
        .select('total_cost, status, created_at');

      if (error) {
        console.error('Error fetching bookings:', error);
        // Use dummy data if error
        calculateDummyProfit();
        return;
      }

      if (bookings) {
        // Calculate total profit from confirmed/completed bookings
        const confirmedBookings = bookings.filter(
          (b) => b.status === 'confirmed' || b.status === 'checked-out' || b.status === 'checked-in'
        );
        const profit = confirmedBookings.reduce((sum, booking) => sum + (booking.total_cost || 0), 0);
        
        // Calculate profit change (compare with previous period - simplified)
        const lastWeekProfit = profit * 0.85; // Simulated previous week data
        const change = ((profit - lastWeekProfit) / lastWeekProfit) * 100;
        
        setTotalProfit(profit);
        setProfitChange(change);
      } else {
        calculateDummyProfit();
      }
    } catch (error) {
      console.error('Error calculating profit:', error);
      calculateDummyProfit();
    } finally {
      setLoading(false);
    }
  };

  const calculateDummyProfit = () => {
    // Dummy profit calculation based on recent bookings
    const dummyProfit = 187500;
    const dummyChange = 12.5;
    setTotalProfit(dummyProfit);
    setProfitChange(dummyChange);
  };

  const weeklyRevenueData = [
    { day: 'Mon', revenue: 12500, bookings: 15 },
    { day: 'Tue', revenue: 15200, bookings: 18 },
    { day: 'Wed', revenue: 18900, bookings: 22 },
    { day: 'Thu', revenue: 16400, bookings: 19 },
    { day: 'Fri', revenue: 22100, bookings: 28 },
    { day: 'Sat', revenue: 28500, bookings: 35 },
    { day: 'Sun', revenue: 25300, bookings: 31 },
  ];

  const monthlyBookingsData = [
    { month: 'Jan', bookings: 145, revenue: 87000 },
    { month: 'Feb', bookings: 168, revenue: 95400 },
    { month: 'Mar', bookings: 192, revenue: 112300 },
    { month: 'Apr', bookings: 178, revenue: 98700 },
    { month: 'May', bookings: 205, revenue: 125600 },
    { month: 'Jun', bookings: 234, revenue: 145800 },
  ];

  const roomTypeData = [
    { type: 'Deluxe', occupied: 45, total: 60 },
    { type: 'Standard', occupied: 38, total: 50 },
    { type: 'Suite', occupied: 12, total: 20 },
    { type: 'Family', occupied: 28, total: 35 },
  ];

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
      value: '68%',
      change: 8.3,
      trend: 'up',
      icon: <Users size={24} color="#ffffff" />,
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      id: '3',
      title: 'Weekly Bookings',
      value: '168',
      change: 15.2,
      trend: 'up',
      icon: <Calendar size={24} color="#ffffff" />,
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      id: '4',
      title: 'Cancellations',
      value: '12',
      change: -3.4,
      trend: 'down',
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
    labels: weeklyRevenueData.map((d) => d.day),
    datasets: [
      {
        data: weeklyRevenueData.map((d) => d.revenue),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 3,
      },
    ],
  };

  const bookingsChartData = {
    labels: monthlyBookingsData.map((d) => d.month),
    datasets: [
      {
        data: monthlyBookingsData.map((d) => d.bookings),
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

        {/* Room Type Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Type Performance</Text>
          <View style={styles.roomTypeContainer}>
            {roomTypeData.map((room) => {
              const occupancyPercent = (room.occupied / room.total) * 100;
              return (
                <View key={room.type} style={styles.roomTypeCard}>
                  <View style={styles.roomTypeHeader}>
                    <Text style={styles.roomTypeName}>{room.type}</Text>
                    <Text style={styles.roomTypeStats}>
                      {room.occupied}/{room.total} rooms
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
            })}
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
