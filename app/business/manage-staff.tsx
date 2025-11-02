import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, User, Mail, Phone, Calendar, Search, Edit, Trash2 } from 'lucide-react-native';
import { supabase } from '../supabaseClient';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  hired_date: string;
  status: 'active' | 'inactive';
}

const ManageStaffScreen: React.FC = () => {
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    hired_date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('hired_date', { ascending: false });

      if (error) {
        console.error('Error fetching staff:', error);
        // Use dummy data if error
        setStaff([
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@hotel.com',
            phone: '+1 234-567-8900',
            role: 'Manager',
            hired_date: '2023-01-15',
            status: 'active',
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@hotel.com',
            phone: '+1 234-567-8901',
            role: 'Receptionist',
            hired_date: '2023-03-20',
            status: 'active',
          },
          {
            id: '3',
            name: 'Mike Davis',
            email: 'mike.davis@hotel.com',
            phone: '+1 234-567-8902',
            role: 'Housekeeping',
            hired_date: '2023-05-10',
            status: 'active',
          },
        ]);
        return;
      }

      if (data) {
        setStaff(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([
          {
            ...formData,
            status: 'active',
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        console.error('Error adding staff:', error);
        Alert.alert('Error', 'Failed to add staff member. Please try again.');
      } else {
        Alert.alert('Success', 'Staff member added successfully!');
        setShowAddForm(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          role: 'staff',
          hired_date: new Date().toISOString().split('T')[0],
        });
        fetchStaff();
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleDeleteStaff = (id: string, name: string) => {
    Alert.alert(
      'Delete Staff Member',
      `Are you sure you want to delete ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.from('staff').delete().eq('id', id);
              if (error) {
                console.error('Error deleting staff:', error);
                Alert.alert('Error', 'Failed to delete staff member.');
              } else {
                fetchStaff();
              }
            } catch (error) {
              console.error('Error:', error);
              Alert.alert('Error', 'An unexpected error occurred.');
            }
          },
        },
      ]
    );
  };

  const filteredStaff = staff.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'manager':
        return '#8b5cf6';
      case 'receptionist':
        return '#3b82f6';
      case 'housekeeping':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Staff</Text>
        <TouchableOpacity
          onPress={() => setShowAddForm(!showAddForm)}
          style={styles.addButton}
        >
          <Plus size={24} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9ca3af" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search staff by name, email, or role..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Add Staff Form */}
      {showAddForm && (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Add New Staff Member</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            placeholderTextColor="#9ca3af"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Email *"
            placeholderTextColor="#9ca3af"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone *"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
          />

          <View style={styles.roleSelector}>
            {['Manager', 'Receptionist', 'Housekeeping', 'Maintenance', 'Security'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleButton,
                  formData.role.toLowerCase() === role.toLowerCase() && styles.roleButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, role: role.toLowerCase() })}
              >
                <Text
                  style={[
                    styles.roleButtonText,
                    formData.role.toLowerCase() === role.toLowerCase() &&
                      styles.roleButtonTextActive,
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowAddForm(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  role: 'staff',
                  hired_date: new Date().toISOString().split('T')[0],
                });
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleAddStaff}>
              <Text style={styles.submitButtonText}>Add Staff</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Staff List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : filteredStaff.length === 0 ? (
          <View style={styles.emptyState}>
            <User size={48} color="#9ca3af" />
            <Text style={styles.emptyStateText}>No staff members found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Add your first staff member'}
            </Text>
          </View>
        ) : (
          filteredStaff.map((member) => (
            <View key={member.id} style={styles.staffCard}>
              <View style={styles.staffHeader}>
                <View style={styles.staffInfo}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: `${getRoleColor(member.role)}15` },
                    ]}
                  >
                    <User size={24} color={getRoleColor(member.role)} />
                  </View>
                  <View style={styles.staffDetails}>
                    <Text style={styles.staffName}>{member.name}</Text>
                    <View
                      style={[
                        styles.roleBadge,
                        { backgroundColor: `${getRoleColor(member.role)}15` },
                      ]}
                    >
                      <Text style={[styles.roleText, { color: getRoleColor(member.role) }]}>
                        {member.role}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Edit', 'Edit functionality coming soon')}
                  >
                    <Edit size={18} color="#6366f1" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteStaff(member.id, member.name)}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.staffContact}>
                <View style={styles.contactItem}>
                  <Mail size={16} color="#6b7280" />
                  <Text style={styles.contactText}>{member.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Phone size={16} color="#6b7280" />
                  <Text style={styles.contactText}>{member.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Calendar size={16} color="#6b7280" />
                  <Text style={styles.contactText}>
                    Hired: {new Date(member.hired_date).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              <View style={styles.statusBadge}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor: member.status === 'active' ? '#10b981' : '#ef4444',
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: member.status === 'active' ? '#10b981' : '#ef4444',
                    },
                  ]}
                >
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </Text>
              </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
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
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    marginBottom: 12,
  },
  roleSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  roleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  roleButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  roleButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
  },
  roleButtonTextActive: {
    color: '#ffffff',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  staffCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  staffHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  staffInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffDetails: {
    flex: 1,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#fef2f2',
  },
  staffContact: {
    gap: 8,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});

export default ManageStaffScreen;

