import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Building2, MapPin, Phone, DollarSign, Home, Bed, Bath, Image as ImageIcon } from 'lucide-react-native';

export default function BusinessRegisterScreen() {
  const router = useRouter();
  const [propertyName, setPropertyName] = useState('');
  const [propertyType, setPropertyType] = useState('hotel');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = () => {
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
              placeholder="Property Name"
              placeholderTextColor="#999"
              value={propertyName}
              onChangeText={setPropertyName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MapPin color="#475569" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
            />
          </View>

          <View style={styles.inputContainer}>
            <MapPin color="#475569" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="City"
              placeholderTextColor="#999"
              value={city}
              onChangeText={setCity}
            />
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
                placeholder="Bedrooms"
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
                placeholder="Bathrooms"
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
              placeholder="Price per night"
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Image</Text>

          <View style={styles.imageUploadContainer}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ImageIcon color="#999" size={48} />
                <Text style={styles.imagePlaceholderText}>Add property image</Text>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <ImageIcon color="#475569" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Image URL (e.g., from Pexels)"
              placeholderTextColor="#999"
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
            />
          </View>
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
  imageUploadContainer: {
    marginBottom: 12,
  },
  imagePlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
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
