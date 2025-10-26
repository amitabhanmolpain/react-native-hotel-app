import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MapPin, Star, Heart, SlidersHorizontal, User as UserIcon } from 'lucide-react-native';
import { useProperty } from '@/contexts/PropertyContext';

const oldProperties = [
  {
    id: '1',
    name: 'Luxury Beach Resort',
    type: 'Hotel',
    city: 'Miami Beach',
    state: 'FL',
    price: 280,
    rating: 4.8,
    reviews: 342,
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    id: '2',
    name: 'Mountain View Villa',
    type: 'House',
    city: 'Aspen',
    state: 'CO',
    price: 450,
    rating: 4.9,
    reviews: 128,
    bedrooms: 4,
    bathrooms: 3,
    image: 'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    id: '3',
    name: 'Downtown Boutique Hotel',
    type: 'Hotel',
    city: 'New York',
    state: 'NY',
    price: 320,
    rating: 4.7,
    reviews: 567,
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: '4',
    name: 'Cozy Lakeside Cabin',
    type: 'House',
    city: 'Lake Tahoe',
    state: 'CA',
    price: 195,
    rating: 4.6,
    reviews: 89,
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: '5',
    name: 'Modern City Apartment',
    type: 'House',
    city: 'San Francisco',
    state: 'CA',
    price: 210,
    rating: 4.5,
    reviews: 234,
    bedrooms: 2,
    bathrooms: 1,
    image: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: '6',
    name: 'Tropical Paradise Resort',
    type: 'Hotel',
    city: 'Honolulu',
    state: 'HI',
    price: 385,
    rating: 4.9,
    reviews: 412,
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: true,
  },
  {
    id: '7',
    name: 'Historic Downtown Loft',
    type: 'House',
    city: 'Boston',
    state: 'MA',
    price: 275,
    rating: 4.7,
    reviews: 156,
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
  {
    id: '8',
    name: 'Seaside Inn & Spa',
    type: 'Hotel',
    city: 'Charleston',
    state: 'SC',
    price: 240,
    rating: 4.8,
    reviews: 298,
    bedrooms: 1,
    bathrooms: 1,
    image: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
    featured: false,
  },
];

export default function UserHomeScreen() {
  const router = useRouter();
  const { properties } = useProperty();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProperties = filteredProperties.filter(p => p.featured);
  const allProperties = filteredProperties;

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.username}>John Doe</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
            <UserIcon color="#475569" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search color="#64748b" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search hotels, houses, locations..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
            <SlidersHorizontal color="#475569" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {searchQuery === '' && featuredProperties.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Properties</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}>
              {featuredProperties.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={styles.featuredCard}
                  onPress={() => router.push(`/(user)/property/${property.id}`)}
                  activeOpacity={0.9}>
                  <Image source={{ uri: property.images[0] }} style={styles.featuredImage} />
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => toggleFavorite(property.id)}
                    activeOpacity={0.8}>
                    <Heart
                      color={favorites.includes(property.id) ? '#ef4444' : '#fff'}
                      size={20}
                      fill={favorites.includes(property.id) ? '#ef4444' : 'none'}
                    />
                  </TouchableOpacity>
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredName} numberOfLines={1}>{property.name}</Text>
                    <View style={styles.featuredLocation}>
                      <MapPin color="#fff" size={14} />
                      <Text style={styles.featuredLocationText}>{property.city}, {property.state}</Text>
                    </View>
                    <View style={styles.featuredFooter}>
                      {property.rating > 0 && (
                        <View style={styles.ratingBadge}>
                          <Star color="#fbbf24" size={12} fill="#fbbf24" />
                          <Text style={styles.ratingText}>{property.rating}</Text>
                        </View>
                      )}
                      <Text style={styles.featuredPrice}>${property.price}/night</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : 'All Properties'}
          </Text>
          <Text style={styles.sectionSubtitle}>{allProperties.length} properties available</Text>

          {allProperties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={styles.propertyCard}
              onPress={() => router.push(`/(user)/property/${property.id}`)}
              activeOpacity={0.9}>
              <Image source={{ uri: property.images[0] }} style={styles.propertyImage} />
              <View style={styles.propertyContent}>
                <View style={styles.propertyHeader}>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyName} numberOfLines={1}>{property.name}</Text>
                    <View style={styles.propertyLocation}>
                      <MapPin color="#64748b" size={14} />
                      <Text style={styles.propertyLocationText}>{property.city}, {property.state}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleFavorite(property.id)}
                    activeOpacity={0.8}>
                    <Heart
                      color={favorites.includes(property.id) ? '#ef4444' : '#cbd5e1'}
                      size={22}
                      fill={favorites.includes(property.id) ? '#ef4444' : 'none'}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.propertyDetails}>
                  <View style={styles.propertyTag}>
                    <Text style={styles.propertyTagText}>{property.type === 'hotel' ? 'Hotel' : 'House'}</Text>
                  </View>
                  <Text style={styles.propertyDetailText}>
                    {property.bedrooms} bed • {property.bathrooms} bath
                  </Text>
                </View>

                <View style={styles.propertyFooter}>
                  {property.rating > 0 ? (
                    <View style={styles.ratingContainer}>
                      <Star color="#fbbf24" size={16} fill="#fbbf24" />
                      <Text style={styles.propertyRating}>{property.rating}</Text>
                      <Text style={styles.propertyReviews}>({property.reviews})</Text>
                    </View>
                  ) : (
                    <Text style={styles.newPropertyBadge}>New</Text>
                  )}
                  <Text style={styles.propertyPrice}>${property.price}<Text style={styles.priceUnit}>/night</Text></Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
  featuredCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredContent: {
    padding: 16,
    backgroundColor: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  featuredLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  featuredLocationText: {
    fontSize: 14,
    color: '#fff',
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  propertyCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  propertyImage: {
    width: 120,
    height: '100%',
  },
  propertyContent: {
    flex: 1,
    padding: 12,
  },
  propertyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  propertyInfo: {
    flex: 1,
    marginRight: 8,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  propertyLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyLocationText: {
    fontSize: 13,
    color: '#64748b',
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  propertyTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  propertyTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e40af',
  },
  propertyDetailText: {
    fontSize: 12,
    color: '#64748b',
  },
  propertyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  propertyReviews: {
    fontSize: 12,
    color: '#64748b',
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#64748b',
  },
  newPropertyBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bottomPadding: {
    height: 40,
  },
});
