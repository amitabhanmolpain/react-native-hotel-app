import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, MapPin, Star, Bed, Bath, Wifi, Coffee, Tv, Wind, 
  Heart, Share2, Calendar, Users, X, Check, Home, Building2 
} from 'lucide-react';

// Mock data
const propertyData = {
  id: '1',
  name: 'Luxury Beachfront Villa',
  type: 'hotel',
  city: 'Miami',
  state: 'Florida',
  address: '123 Ocean Drive, Miami Beach, FL 33139',
  rating: 4.8,
  reviews: 128,
  bedrooms: 4,
  bathrooms: 3,
  price: 450,
  description: 'Experience luxury living in this stunning beachfront villa. With panoramic ocean views, modern amenities, and direct beach access, this property offers the perfect getaway. The spacious interior features high-end finishes, a gourmet kitchen, and floor-to-ceiling windows that flood the space with natural light.',
  amenities: ['WiFi', 'Air Conditioning', 'TV', 'Coffee Maker'],
  host: 'Sarah Johnson',
  hostImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
  images: [
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  ]
};

export default function PropertyDetailScreen() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [activeTab, setActiveTab] = useState<'details' | 'amenities' | 'host'>('details');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const property = propertyData;

  const amenityIcons: { [key: string]: any } = {
    'WiFi': Wifi,
    'Air Conditioning': Wind,
    'TV': Tv,
    'Coffee Maker': Coffee,
  };

  const handleBooking = () => {
    if (!checkIn || !checkOut) {
      alert('Please fill in check-in and check-out dates');
      return;
    }
    setShowBookingModal(false);
    setShowSuccessModal(true);
    setTimeout(() => setShowSuccessModal(false), 3000);
  };

  const calculateTotal = () => {
    return property.price * 3;
  };

  return (
    <div style={styles.container}>
      {/* Image Gallery */}
      <div style={styles.imageSection}>
        <div style={styles.imageContainer}>
          <img 
            src={property.images[currentImageIndex]} 
            alt={property.name}
            style={styles.mainImage}
          />
          
          {/* Image Navigation Dots */}
          <div style={styles.imageIndicator}>
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  ...styles.indicator,
                  ...(currentImageIndex === index ? styles.indicatorActive : {}),
                }}
              />
            ))}
          </div>

          {/* Back Button */}
          <button style={styles.backButton} onClick={() => window.history.back()}>
            <ArrowLeft size={24} color="#1e293b" />
          </button>

          {/* Action Buttons */}
          <div style={styles.actionButtons}>
            <button
              style={{
                ...styles.actionButton,
                ...(isFavorite ? { backgroundColor: '#fee2e2' } : {}),
              }}
              onClick={() => setIsFavorite(!isFavorite)}>
              <Heart
                size={22}
                color={isFavorite ? '#ef4444' : '#1e293b'}
                fill={isFavorite ? '#ef4444' : 'none'}
              />
            </button>
            <button style={styles.actionButton}>
              <Share2 size={22} color="#1e293b" />
            </button>
          </div>
        </div>

        {/* Thumbnail Gallery */}
        <div style={styles.thumbnailGallery}>
          {property.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              style={{
                ...styles.thumbnail,
                ...(currentImageIndex === index ? styles.thumbnailActive : {}),
              }}>
              <img src={image} alt={`View ${index + 1}`} style={styles.thumbnailImage} />
            </button>
          ))}
        </div>
      </div>

      {/* Content Section */}
      <div style={styles.scrollContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.propertyName}>{property.name}</h1>
            <div style={styles.locationRow}>
              <MapPin size={18} color="#64748b" />
              <span style={styles.locationText}>{property.city}, {property.state}</span>
            </div>
          </div>
          <div style={styles.ratingContainer}>
            <Star size={20} color="#fbbf24" fill="#fbbf24" />
            <span style={styles.ratingText}>{property.rating}</span>
            <span style={styles.reviewsText}>({property.reviews})</span>
          </div>
        </div>

        {/* Property Type Tag */}
        <div style={styles.typeTag}>
          {property.type === 'hotel' ? <Building2 size={16} color="#1e40af" /> : <Home size={16} color="#1e40af" />}
          <span style={styles.typeTagText}>{property.type === 'hotel' ? 'Hotel' : 'House'}</span>
        </div>

        {/* Quick Stats */}
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <Bed size={24} color="#3b82f6" />
            <span style={styles.statValue}>{property.bedrooms}</span>
            <span style={styles.statLabel}>Bedrooms</span>
          </div>
          <div style={styles.statCard}>
            <Bath size={24} color="#3b82f6" />
            <span style={styles.statValue}>{property.bathrooms}</span>
            <span style={styles.statLabel}>Bathrooms</span>
          </div>
          <div style={styles.statCard}>
            <Users size={24} color="#3b82f6" />
            <span style={styles.statValue}>{property.bedrooms * 2}</span>
            <span style={styles.statLabel}>Guests</span>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'details' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('details')}>
            <span style={{
              ...styles.tabText,
              ...(activeTab === 'details' ? styles.tabTextActive : {}),
            }}>
              Details
            </span>
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'amenities' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('amenities')}>
            <span style={{
              ...styles.tabText,
              ...(activeTab === 'amenities' ? styles.tabTextActive : {}),
            }}>
              Amenities
            </span>
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'host' ? styles.tabActive : {}),
            }}
            onClick={() => setActiveTab('host')}>
            <span style={{
              ...styles.tabText,
              ...(activeTab === 'host' ? styles.tabTextActive : {}),
            }}>
              Host
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div style={styles.tabContent}>
          {activeTab === 'details' && (
            <div style={styles.fadeIn}>
              <h3 style={styles.sectionTitle}>About this property</h3>
              <p style={styles.description}>{property.description}</p>
              <div style={styles.addressCard}>
                <MapPin size={20} color="#3b82f6" />
                <span style={styles.address}>{property.address}</span>
              </div>
            </div>
          )}

          {activeTab === 'amenities' && (
            <div style={styles.fadeIn}>
              <h3 style={styles.sectionTitle}>Available amenities</h3>
              <div style={styles.amenitiesGrid}>
                {property.amenities.map((amenity, index) => {
                  const IconComponent = amenityIcons[amenity] || Wifi;
                  return (
                    <div key={index} style={styles.amenityCard}>
                      <div style={styles.amenityIcon}>
                        <IconComponent size={24} color="#3b82f6" />
                      </div>
                      <span style={styles.amenityText}>{amenity}</span>
                      <Check size={18} color="#10b981" style={{ marginLeft: 'auto' }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'host' && (
            <div style={styles.fadeIn}>
              <h3 style={styles.sectionTitle}>Meet your host</h3>
              <div style={styles.hostCard}>
                <img src={property.hostImage} alt={property.host} style={styles.hostImage} />
                <div style={styles.hostInfo}>
                  <span style={styles.hostName}>{property.host}</span>
                  <span style={styles.hostLabel}>Property Owner</span>
                  <div style={styles.hostStats}>
                    <div style={styles.hostStat}>
                      <Star size={16} color="#fbbf24" fill="#fbbf24" />
                      <span style={styles.hostStatText}>4.9 rating</span>
                    </div>
                    <div style={styles.hostStat}>
                      <Home size={16} color="#3b82f6" />
                      <span style={styles.hostStatText}>12 properties</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <div style={styles.priceContainer}>
          <span style={styles.priceLabel}>From</span>
          <span style={styles.price}>${property.price}<span style={styles.priceNight}>/night</span></span>
        </div>
        <button style={styles.bookButton} onClick={() => setShowBookingModal(true)}>
          <Calendar size={20} color="#ffffff" style={{ marginRight: '8px' }} />
          <span style={styles.bookButtonText}>Book Now</span>
        </button>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={styles.modalOverlay} onClick={() => setShowBookingModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Complete Your Booking</h2>
              <button style={styles.modalClose} onClick={() => setShowBookingModal(false)}>
                <X size={24} color="#64748b" />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Check-in Date</label>
                <div style={styles.inputContainer}>
                  <Calendar size={20} color="#64748b" />
                  <input
                    type="date"
                    style={styles.input}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Check-out Date</label>
                <div style={styles.inputContainer}>
                  <Calendar size={20} color="#64748b" />
                  <input
                    type="date"
                    style={styles.input}
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Number of Guests</label>
                <div style={styles.inputContainer}>
                  <Users size={20} color="#64748b" />
                  <input
                    type="number"
                    style={styles.input}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    min="1"
                    max={property.bedrooms * 2}
                  />
                </div>
              </div>

              <div style={styles.priceBreakdown}>
                <h4 style={styles.breakdownTitle}>Price Breakdown</h4>
                <div style={styles.breakdownRow}>
                  <span style={styles.breakdownLabel}>${property.price} × 3 nights</span>
                  <span style={styles.breakdownValue}>${property.price * 3}</span>
                </div>
                <div style={styles.breakdownRow}>
                  <span style={styles.breakdownLabel}>Service fee</span>
                  <span style={styles.breakdownValue}>$50</span>
                </div>
                <div style={styles.divider} />
                <div style={styles.breakdownRow}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalValue}>${calculateTotal() + 50}</span>
                </div>
              </div>

              <button style={styles.confirmButton} onClick={handleBooking}>
                <Check size={20} color="#ffffff" style={{ marginRight: '8px' }} />
                <span>Confirm Booking</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={styles.successOverlay}>
          <div style={styles.successModal}>
            <div style={styles.successIcon}>
              <Check size={48} color="#ffffff" />
            </div>
            <h3 style={styles.successTitle}>Booking Confirmed!</h3>
            <p style={styles.successText}>
              Your reservation at {property.name} has been confirmed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    paddingBottom: '100px',
  },
  imageSection: {
    backgroundColor: '#ffffff',
    paddingBottom: '20px',
  },
  imageContainer: {
    position: 'relative',
    height: '400px',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 2,
  },
  indicator: {
    width: '8px',
    height: '8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  indicatorActive: {
    width: '32px',
    backgroundColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    backgroundColor: '#ffffff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s ease',
    zIndex: 3,
  },
  actionButtons: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    gap: '12px',
    zIndex: 3,
  },
  actionButton: {
    width: '44px',
    height: '44px',
    borderRadius: '22px',
    backgroundColor: '#ffffff',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
  },
  thumbnailGallery: {
    display: 'flex',
    gap: '12px',
    padding: '0 20px',
    overflowX: 'auto',
  },
  thumbnail: {
    minWidth: '100px',
    height: '80px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'none',
    padding: 0,
  },
  thumbnailActive: {
    borderColor: '#3b82f6',
    transform: 'scale(1.05)',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  scrollContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    gap: '16px',
  },
  headerLeft: {
    flex: 1,
  },
  propertyName: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  locationText: {
    fontSize: '16px',
    color: '#64748b',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: '#fef3c7',
    padding: '10px 16px',
    borderRadius: '12px',
  },
  ratingText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#92400e',
  },
  reviewsText: {
    fontSize: '14px',
    color: '#92400e',
  },
  typeTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#dbeafe',
    padding: '8px 16px',
    borderRadius: '10px',
    marginBottom: '24px',
  },
  typeTagText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e40af',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  tabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    backgroundColor: '#ffffff',
    padding: '6px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  tab: {
    flex: 1,
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabActive: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabContent: {
    minHeight: '300px',
  },
  fadeIn: {
    animation: 'fadeIn 0.3s ease',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 16px 0',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#475569',
    marginBottom: '20px',
  },
  addressCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f0f9ff',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
  },
  address: {
    fontSize: '14px',
    color: '#1e40af',
    fontWeight: '500',
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px',
  },
  amenityCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#ffffff',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
  },
  amenityIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b',
  },
  hostCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
  },
  hostImage: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    objectFit: 'cover',
  },
  hostInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  hostName: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e293b',
  },
  hostLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  hostStats: {
    display: 'flex',
    gap: '16px',
    marginTop: '8px',
  },
  hostStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  hostStatText: {
    fontSize: '13px',
    color: '#475569',
    fontWeight: '500',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.05)',
    zIndex: 10,
  },
  priceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  priceLabel: {
    fontSize: '13px',
    color: '#64748b',
  },
  price: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#10b981',
  },
  priceNight: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#64748b',
  },
  bookButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: '16px 32px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  bookButtonText: {
    fontSize: '16px',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    maxWidth: '500px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideUp 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0,
  },
  modalClose: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  modalBody: {
    padding: '24px',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  inputLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#f8fafc',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '15px',
    color: '#1e293b',
  },
  priceBreakdown: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  breakdownTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 16px 0',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  breakdownLabel: {
    fontSize: '14px',
    color: '#64748b',
  },
  breakdownValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '16px 0',
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#10b981',
  },
  confirmButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    color: '#ffffff',
    padding: '16px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  },
  successOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  successModal: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    maxWidth: '400px',
    animation: 'scaleIn 0.3s ease',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: '#10b981',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 12px 0',
  },
  successText: {
    fontSize: '16px',
    color: '#64748b',
    margin: 0,
  },
};