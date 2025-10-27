import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, MapPin, DollarSign, Plus, Edit, ArrowLeft, Calendar, Eye } from 'lucide-react-native';
import { useProperty } from '@/contexts/PropertyContext';

export default function BusinessDashboardScreen() {
  const router = useRouter();
  const { properties } = useProperty();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/')}
          activeOpacity={0.7}>
          <ArrowLeft color="#1e293b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Properties</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/business/register')}
          activeOpacity={0.7}>
          <Plus color="#475569" size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Quick Action Buttons */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => router.push("/business/view-bookings")}
            activeOpacity={0.8}>
            <View style={styles.actionButtonIcon}>
              <Eye color="#fff" size={20} />
            </View>
            <Text style={styles.primaryActionButtonText}>View Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={() => router.push('/business/UpcomingEventsScreen')}
            activeOpacity={0.8}>
            <View style={styles.actionButtonIconSecondary}>
              <Calendar color="#2563eb" size={20} />
            </View>
            <Text style={styles.secondaryActionButtonText}>Upcoming Events</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Building2 color="#2563eb" size={20} />
            </View>
            <Text style={styles.statValue}>{properties.length}</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Calendar color="#10b981" size={20} />
            </View>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <DollarSign color="#f59e0b" size={20} />
            </View>
            <Text style={styles.statValue}>$8.5K</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Properties</Text>
            <View style={styles.propertyCount}>
              <Text style={styles.propertyCountText}>{properties.length}</Text>
            </View>
          </View>

          {properties.map((property) => (
            <View key={property.id} style={styles.propertyCard}>
              <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
              <View style={styles.propertyContent}>
                <View style={styles.propertyHeader}>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyName}>{property.name}</Text>
                    <View style={styles.propertyMeta}>
                      <MapPin color="#64748b" size={14} />
                      <Text style={styles.propertyMetaText}>{property.city}, {property.state}</Text>
                      <Text style={styles.propertyMetaDivider}>•</Text>
                      <Building2 color="#64748b" size={14} />
                      <Text style={styles.propertyMetaText}>{property.type === 'hotel' ? 'Hotel' : 'House'}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
                    <Edit color="#475569" size={20} />
                  </TouchableOpacity>
                </View>

                <View style={styles.propertyFooter}>
                  <View style={styles.priceContainer}>
                    <DollarSign color="#16a34a" size={18} />
                    <Text style={styles.priceText}>{property.price}/night</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>Active</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addPropertyButton}
          onPress={() => router.push('/business/register')}
          activeOpacity={0.8}>
          <Plus color="#fff" size={24} />
          <Text style={styles.addPropertyButtonText}>Add New Property</Text>
        </TouchableOpacity>

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
  addButton: {
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
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  primaryActionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: '#2563eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonIconSecondary: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryActionButtonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  propertyCount: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyCountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyImage: {
    width: '100%',
    height: 180,
  },
  propertyContent: {
    padding: 16,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  propertyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  propertyMetaText: {
    fontSize: 14,
    color: '#64748b',
  },
  propertyMetaDivider: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  editButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16a34a',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  addPropertyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#475569',
    borderRadius: 12,
    height: 56,
    gap: 8,
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addPropertyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});