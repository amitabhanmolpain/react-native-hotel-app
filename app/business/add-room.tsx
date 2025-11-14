import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Upload, X, Home, DollarSign, MapPin, Bed, Users } from 'lucide-react-native';
import { supabase } from '../supabaseClient';


const AddRoomScreen: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'hotel', // 'hotel' or 'house'
    price: '',
    location: '',
    city: '',
    state: '',
    bedrooms: '',
    bathrooms: '',
    guests: '',
    amenities: '',
  });

  const handlePickImage = async () => {
    try {
      // For now, show an alert to install expo-image-picker
      // In production: npm install expo-image-picker
      Alert.alert(
        'Image Picker Required',
        'Please install expo-image-picker for image upload functionality.\n\nRun: npm install expo-image-picker',
        [
          { text: 'OK' },
          {
            text: 'Use Demo Images',
            onPress: () => {
              // Add demo images for testing
              const demoImages = [
                'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
                'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400',
              ];
              setImages([...images, ...demoImages]);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const addImageFromUrl = () => {
    if (imageUrl && imageUrl.trim()) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl('');
      setShowUrlInput(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.location || !formData.city || !formData.state) {
      Alert.alert('Validation Error', 'Please fill in all required fields (Name, Price, Location, City, State)');
      return;
    }

    if (images.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one image');
      return;
    }

    setLoading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert('Error', 'You must be logged in to add a property');
        setLoading(false);
        return;
      }

      // For now, use image URLs directly (no storage upload needed for URLs)
      const uploadedImageUrls: string[] = images;

      // Insert property into database
      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            owner_id: user.id,
            name: formData.name,
            description: formData.description,
            type: formData.type,
            price: parseFloat(formData.price),
            location: formData.location,
            city: formData.city,
            state: formData.state,
            bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
            bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
            guests: formData.guests ? parseInt(formData.guests) : null,
            amenities: formData.amenities,
            images: uploadedImageUrls,
            status: 'available',
          },
        ])
        .select();

      if (error) {
        console.error('Error adding property:', error);
        Alert.alert('Error', 'Failed to add property. Please try again.');
      } else {
        Alert.alert('Success', 'Property added successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Property</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Property Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'hotel' && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, type: 'hotel' })}
            >
              <Home size={20} color={formData.type === 'hotel' ? '#ffffff' : '#6366f1'} />
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'hotel' && styles.typeButtonTextActive,
                ]}
              >
                Hotel Room
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'house' && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, type: 'house' })}
            >
              <Home size={20} color={formData.type === 'house' ? '#ffffff' : '#6366f1'} />
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'house' && styles.typeButtonTextActive,
                ]}
              >
                House/Rental
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesContainer}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addImageButton} onPress={handlePickImage}>
              <Upload size={24} color="#6366f1" />
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          </ScrollView>
          {showUrlInput ? (
            <View style={styles.urlInputContainer}>
              <TextInput
                style={styles.urlInput}
                placeholder="Enter image URL"
                placeholderTextColor="#9ca3af"
                value={imageUrl}
                onChangeText={setImageUrl}
                autoCapitalize="none"
              />
              <View style={styles.urlInputActions}>
                <TouchableOpacity
                  style={styles.urlCancelButton}
                  onPress={() => {
                    setShowUrlInput(false);
                    setImageUrl('');
                  }}
                >
                  <Text style={styles.urlCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.urlAddButton} onPress={addImageFromUrl}>
                  <Text style={styles.urlAddText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.urlButton}
              onPress={() => setShowUrlInput(true)}
            >
              <Text style={styles.urlButtonText}>+ Add Image from URL</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Property Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter property name"
              placeholderTextColor="#9ca3af"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your property..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price per Night (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor="#9ca3af"
              keyboardType="decimal-pad"
              value={formData.price}
              onChangeText={(text) => setFormData({ ...formData, price: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color="#9ca3af" />
              <TextInput
                style={[styles.input, styles.inputFlex]}
                placeholder="Enter full address"
                placeholderTextColor="#9ca3af"
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
              />
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter city"
                placeholderTextColor="#9ca3af"
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>State *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter state"
                placeholderTextColor="#9ca3af"
                value={formData.state}
                onChangeText={(text) => setFormData({ ...formData, state: text })}
              />
            </View>
          </View>
        </View>

        {/* Property Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>
          
          <View style={styles.detailsGrid}>
            <View style={styles.inputGroup}>
              <View style={styles.iconLabel}>
                <Bed size={18} color="#6366f1" />
                <Text style={styles.label}>Bedrooms</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={formData.bedrooms}
                onChangeText={(text) => setFormData({ ...formData, bedrooms: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.iconLabel}>
                <Bed size={18} color="#6366f1" />
                <Text style={styles.label}>Bathrooms</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
                value={formData.bathrooms}
                onChangeText={(text) => setFormData({ ...formData, bathrooms: text })}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.iconLabel}>
              <Users size={18} color="#6366f1" />
              <Text style={styles.label}>Max Guests</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              value={formData.guests}
              onChangeText={(text) => setFormData({ ...formData, guests: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amenities</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="WiFi, Pool, Parking, etc. (comma separated)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              value={formData.amenities}
              onChangeText={(text) => setFormData({ ...formData, amenities: text })}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Add Property</Text>
          )}
        </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  typeButtonActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  typeButtonTextActive: {
    color: '#ffffff',
  },
  imagesContainer: {
    marginTop: 8,
  },
  imageWrapper: {
    marginRight: 12,
    position: 'relative',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'dashed',
    backgroundColor: '#f0f4ff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addImageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366f1',
  },
  urlButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  urlButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
  },
  urlInputContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  urlInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
  },
  urlInputActions: {
    flexDirection: 'row',
    gap: 8,
  },
  urlCancelButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  urlCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  urlAddButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  urlAddText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  iconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: '#111827',
  },
  inputFlex: {
    flex: 1,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default AddRoomScreen;

