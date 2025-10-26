import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Building2, MapPin, Phone, DollarSign, Home, Bed, Bath, ImageIcon, Plus, X, Square, Trees } from 'lucide-react-native';
import { useProperty } from '@/contexts/PropertyContext';

export default function BusinessRegisterScreen() {
  const router = useRouter();
  const { addProperty } = useProperty();
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState<'hotel' | 'house'>('hotel');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const [totalRooms, setTotalRooms] = useState('');
  const [squareFeet, setSquareFeet] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [parking, setParking] = useState('');
  const [hasGarden, setHasGarden] = useState(false);

  const addImage = () => {
    if (currentImageUrl.trim()) {
      setImages([...images, currentImageUrl.trim()]);
      setCurrentImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!propertyName || !city || !state || !address || !price || !bedrooms || !bathrooms || images.length === 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields and add at least one image.');
      return;
    }

    const newProperty = {
      name: propertyName,
      type: propertyType,
      city,
      state,
      address,
      phone,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      description,
      images,
      amenities: ['WiFi', 'Air Conditioning', 'TV', 'Coffee Maker'],
      host: 'Property Owner',
      hostImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
      ...(propertyType === 'hotel' && totalRooms && { totalRooms: parseInt(totalRooms) }),
      ...(propertyType === 'house' && {
        ...(squareFeet && { squareFeet: parseInt(squareFeet) }),
        ...(yearBuilt && { yearBuilt: parseInt(yearBuilt) }),
        ...(parking && { parking }),
        garden: hasGarden,
      }),
    };

    addProperty(newProperty);
    Alert.alert('Success', 'Property added successfully!');
    router.push('/business/dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <ArrowLeft color="#1e293b" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Property</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, propertyType === 'hotel' && styles.typeButtonActive]}
              onPress={() => setPropertyType('hotel')}
              activeOpacity={0.7}>
              <Building2 color={propertyType === 'hotel' ? '#fff' : '#475569'} size={24} />
              <Text style={[styles.typeText, propertyType === 'hotel' && styles.typeTextActive]}>
                Hotel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeButton, propertyType === 'house' && styles.typeButtonActive]}
              onPress={() => setPropertyType('house')}
              activeOpacity={0.7}>
              <Home color={propertyType === 'house' ? '#fff' : '#475569'} size={24} />
              <Text style={[styles.typeText, propertyType === 'house' && styles.typeTextActive]}>
                House
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>

          <View style={styles.inputContainer}>
            <Building2 color="#475569" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Property Name *"
              placeholderTextColor="#999"
              value={propertyName}
              onChangeText={setPropertyName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MapPin color="#475569" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Street Address *"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <MapPin color="#475569" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="City *"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <MapPin color="#475569" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="State *"
                placeholderTextColor="#999"
                value={state}
                onChangeText={setState}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Phone color="#475569" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contact Phone"
              placeholderTextColor="#999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Details</Text>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Bed color="#475569" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Bedrooms *"
                placeholderTextColor="#999"
                value={bedrooms}
                onChangeText={setBedrooms}
                keyboardType="number-pad"
              />
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Bath color="#475569" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Bathrooms *"
                placeholderTextColor="#999"
                value={bathrooms}
                onChangeText={setBathrooms}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <DollarSign color="#475569" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Price per night *"
              placeholderTextColor="#999"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Property Description"
              placeholderTextColor="#999"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {propertyType === 'hotel' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hotel-Specific Details</Text>

            <View style={styles.inputContainer}>
              <Building2 color="#475569" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Total Number of Rooms"
                placeholderTextColor="#999"
                value={totalRooms}
                onChangeText={setTotalRooms}
                keyboardType="number-pad"
              />
            </View>
          </View>
        )}

        {propertyType === 'house' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>House-Specific Details</Text>

            <View style={styles.inputContainer}>
              <Square color="#475569" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Square Feet"
                placeholderTextColor="#999"
                value={squareFeet}
                onChangeText={setSquareFeet}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Building2 color="#475569" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Year Built"
                placeholderTextColor="#999"
                value={yearBuilt}
                onChangeText={setYearBuilt}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Building2 color="#475569" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Parking (e.g., Garage, Driveway)"
                placeholderTextColor="#999"
                value={parking}
                onChangeText={setParking}
              />
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setHasGarden(!hasGarden)}
              activeOpacity={0.7}>
              <View style={[styles.checkbox, hasGarden && styles.checkboxActive]}>
                {hasGarden && <View style={styles.checkboxInner} />}
              </View>
              <Trees color="#475569" size={20} style={styles.checkboxIcon} />
              <Text style={styles.checkboxLabel}>Has Garden</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Images *</Text>
          <Text style={styles.sectionSubtitle}>Add multiple images from Pexels or other sources</Text>

          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageList}>
              {images.map((img, index) => (
                <View key={index} style={styles.imagePreviewContainer}>
                  <Image source={{ uri: img }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                    activeOpacity={0.8}>
                    <X color="#fff" size={16} />
                  </TouchableOpacity>
                  <View style={styles.imageNumber}>
                    <Text style={styles.imageNumberText}>{index + 1}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.addImageContainer}>
            <View style={styles.inputContainer}>
              <ImageIcon color="#475569" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Image URL (e.g., from Pexels)"
                placeholderTextColor="#999"
                value={currentImageUrl}
                onChangeText={setCurrentImageUrl}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={addImage}
              activeOpacity={0.8}>
              <Plus color="#fff" size={24} />
            </TouchableOpacity>
          </View>

          {images.length === 0 && (
            <View style={styles.imagePlaceholder}>
              <ImageIcon color="#999" size={48} />
              <Text style={styles.imagePlaceholderText}>No images added yet</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>Add Property</Text>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  typeButtonActive: {
    backgroundColor: '#475569',
    borderColor: '#475569',
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  typeTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  textAreaContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  textArea: {
    fontSize: 16,
    color: '#333',
    minHeight: 100,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxActive: {
    borderColor: '#475569',
    backgroundColor: '#475569',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  checkboxIcon: {
    marginRight: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  imageList: {
    marginBottom: 16,
  },
  imagePreviewContainer: {
    marginRight: 12,
    position: 'relative',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageNumber: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addImageContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  addImageButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  imagePlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    marginTop: 16,
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  submitButton: {
    backgroundColor: '#475569',
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
