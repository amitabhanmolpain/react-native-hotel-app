import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, XCircle, Zap, ArrowUpRight } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

// Types
interface KPI {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  gradient: string;
}

interface Insight {
  id: string;
  text: string;
  type: 'positive' | 'warning' | 'info';
  icon: React.ReactNode;
}

// Dummy Data
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

const occupancyData = [
  { name: 'Occupied', value: 68, color: '#3b82f6' },
  { name: 'Available', value: 32, color: '#e5e7eb' },
];

const roomTypeData = [
  { type: 'Deluxe', occupied: 45, total: 60 },
  { type: 'Standard', occupied: 38, total: 50 },
  { type: 'Suite', occupied: 12, total: 20 },
  { type: 'Family', occupied: 28, total: 35 },
];

const AnalyticsScreen: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const kpiData: KPI[] = [
    {
      id: '1',
      title: 'Total Revenue',
      value: '$138.7K',
      change: 12.5,
      trend: 'up',
      icon: <DollarSign size={24} color="#ffffff" />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      id: '2',
      title: 'Occupancy Rate',
      value: '68%',
      change: 8.3,
      trend: 'up',
      icon: <Users size={24} color="#ffffff" />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      id: '3',
      title: 'Weekly Bookings',
      value: '168',
      change: 15.2,
      trend: 'up',
      icon: <Calendar size={24} color="#ffffff" />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    {
      id: '4',
      title: 'Cancellations',
      value: '12',
      change: -3.4,
      trend: 'down',
      icon: <XCircle size={24} color="#ffffff" />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    },
  ];

  const insights: Insight[] = [
    {
      id: '1',
      text: 'Occupancy up 12% this week! Weekend bookings are driving growth.',
      type: 'positive',
      icon: <TrendingUp size={18} color="#10b981" />,
    },
    {
      id: '2',
      text: 'Deluxe suites at 75% capacity. Consider dynamic pricing for peak demand.',
      type: 'info',
      icon: <Zap size={18} color="#3b82f6" />,
    },
    {
      id: '3',
      text: 'Revenue increased by $18.2K compared to last week.',
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Analytics</h1>
        <p style={styles.headerSubtitle}>Real-time insights and performance metrics</p>
      </div>

      {/* Scrollable Content */}
      <div style={styles.scrollView}>
        {/* KPI Cards */}
        <div style={styles.kpiContainer}>
          {kpiData.map((kpi, index) => (
            <div
              key={kpi.id}
              style={{
                ...styles.kpiCard,
                background: kpi.gradient,
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.5s ease ${index * 0.1}s`,
              }}
            >
              <div style={styles.kpiIconContainer}>{kpi.icon}</div>
              <div style={styles.kpiContent}>
                <p style={styles.kpiTitle}>{kpi.title}</p>
                <h2 style={styles.kpiValue}>{kpi.value}</h2>
                <div style={styles.kpiChangeContainer}>
                  {kpi.trend === 'up' ? (
                    <TrendingUp size={16} color="#ffffff" />
                  ) : (
                    <TrendingDown size={16} color="#ffffff" />
                  )}
                  <span style={styles.kpiChange}>
                    {kpi.change > 0 ? '+' : ''}{kpi.change}% vs last week
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Insights Section */}
        <div
          style={{
            ...styles.section,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.4s',
          }}
        >
          <h3 style={styles.sectionTitle}>Smart Insights</h3>
          <div style={styles.insightsContainer}>
            {insights.map((insight, index) => (
              <div
                key={insight.id}
                style={{
                  ...styles.insightCard,
                  ...(insight.type === 'positive'
                    ? styles.insightPositive
                    : insight.type === 'warning'
                    ? styles.insightWarning
                    : styles.insightInfo),
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.4s ease ${0.5 + index * 0.1}s`,
                }}
              >
                <div style={styles.insightIcon}>{insight.icon}</div>
                <p style={styles.insightText}>{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Revenue Chart */}
        <div
          style={{
            ...styles.section,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.6s',
          }}
        >
          <h3 style={styles.sectionTitle}>Weekly Revenue Trend</h3>
          <div style={styles.chartCard}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row */}
        <div style={styles.chartsRow}>
          {/* Occupancy Pie Chart */}
          <div
            style={{
              ...styles.chartSection,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease 0.7s',
            }}
          >
            <h3 style={styles.sectionTitle}>Room Occupancy</h3>
            <div style={styles.chartCard}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props) => `${props.name} ${(Number(props.percent) * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={styles.occupancyStats}>
                <div style={styles.occupancyStat}>
                  <div style={{ ...styles.occupancyDot, backgroundColor: '#3b82f6' }} />
                  <span style={styles.occupancyLabel}>Occupied: 123 rooms</span>
                </div>
                <div style={styles.occupancyStat}>
                  <div style={{ ...styles.occupancyDot, backgroundColor: '#e5e7eb' }} />
                  <span style={styles.occupancyLabel}>Available: 57 rooms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Bookings Bar Chart */}
          <div
            style={{
              ...styles.chartSection,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease 0.8s',
            }}
          >
            <h3 style={styles.sectionTitle}>Monthly Bookings</h3>
            <div style={styles.chartCard}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyBookingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="bookings" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Room Type Performance */}
        <div
          style={{
            ...styles.section,
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.9s',
          }}
        >
          <h3 style={styles.sectionTitle}>Room Type Performance</h3>
          <div style={styles.roomTypeContainer}>
            {roomTypeData.map((room) => {
              const occupancyPercent = (room.occupied / room.total) * 100;
              return (
                <div key={room.type} style={styles.roomTypeCard}>
                  <div style={styles.roomTypeHeader}>
                    <h4 style={styles.roomTypeName}>{room.type}</h4>
                    <span style={styles.roomTypeStats}>
                      {room.occupied}/{room.total} rooms
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${occupancyPercent}%`,
                        backgroundColor:
                          occupancyPercent > 75
                            ? '#10b981'
                            : occupancyPercent > 50
                            ? '#3b82f6'
                            : '#f59e0b',
                      }}
                    />
                  </div>
                  <span style={styles.roomTypePercent}>{occupancyPercent.toFixed(0)}% occupied</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
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
    padding: '20px 20px 16px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
  },
  headerTitle: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px 0',
  },
  headerSubtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  scrollView: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  kpiContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  kpiCard: {
    borderRadius: '16px',
    padding: '24px',
    color: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  kpiIconContainer: {
    marginBottom: '16px',
  },
  kpiContent: {
    position: 'relative',
    zIndex: 1,
  },
  kpiTitle: {
    fontSize: '14px',
    fontWeight: '500',
    opacity: 0.9,
    margin: '0 0 8px 0',
  },
  kpiValue: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 12px 0',
  },
  kpiChangeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  kpiChange: {
    fontSize: '13px',
    fontWeight: '500',
    opacity: 0.95,
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 16px 0',
  },
  insightsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '12px',
  },
  insightCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid',
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
    marginTop: '2px',
  },
  insightText: {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#374151',
    margin: 0,
    flex: 1,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  chartSection: {
    flex: 1,
  },
  occupancyStats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '16px',
  },
  occupancyStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  occupancyDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  occupancyLabel: {
    fontSize: '14px',
    color: '#6b7280',
  },
  roomTypeContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
  },
  roomTypeCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  roomTypeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  roomTypeName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  roomTypeStats: {
    fontSize: '13px',
    color: '#6b7280',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 1s ease',
  },
  roomTypePercent: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
};

export default AnalyticsScreen;