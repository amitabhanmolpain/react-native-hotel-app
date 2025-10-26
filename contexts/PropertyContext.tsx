import { createContext, useContext, useState, ReactNode } from 'react';

interface Property {
  id: string;
  name: string;
  type: 'hotel' | 'house';
  city: string;
  state: string;
  address: string;
  phone: string;
  price: number;
  rating: number;
  reviews: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  images: string[];
  amenities: string[];
  host: string;
  hostImage: string;
  featured: boolean;
  totalRooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  parking?: string;
  garden?: boolean;
}

interface Booking {
  id: string;
  propertyId: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Omit<Property, 'id' | 'rating' | 'reviews' | 'featured'>) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status'>) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const initialProperties: Property[] = [
  {
    id: '1',
    name: 'Luxury Beach Resort',
    type: 'hotel',
    city: 'Miami Beach',
    state: 'FL',
    address: '123 Ocean Drive, Miami Beach, FL 33139',
    phone: '+1 305-555-0123',
    price: 280,
    rating: 4.8,
    reviews: 342,
    bedrooms: 1,
    bathrooms: 1,
    description: 'Experience luxury beachfront living at its finest. Our resort offers stunning ocean views, world-class amenities, and unparalleled service. Wake up to the sound of waves and enjoy pristine sandy beaches just steps from your room.',
    images: [
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Room Service', 'TV', 'Coffee Maker', 'Pool'],
    host: 'Luxury Resorts Inc.',
    hostImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    featured: true,
    totalRooms: 50,
  },
  {
    id: '2',
    name: 'Mountain View Villa',
    type: 'house',
    city: 'Aspen',
    state: 'CO',
    address: '456 Mountain Road, Aspen, CO 81611',
    phone: '+1 970-555-0456',
    price: 450,
    rating: 4.9,
    reviews: 128,
    bedrooms: 4,
    bathrooms: 3,
    description: 'A stunning villa nestled in the mountains with breathtaking panoramic views. Perfect for families or groups seeking a luxurious mountain getaway. Features include a gourmet kitchen, spacious living areas, and a private hot tub.',
    images: [
      'https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Air Conditioning', 'Kitchen', 'TV', 'Coffee Maker', 'Hot Tub'],
    host: 'Sarah Mountain Homes',
    hostImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    featured: true,
    squareFeet: 3500,
    yearBuilt: 2018,
    parking: 'Garage',
    garden: true,
  },
  {
    id: '3',
    name: 'Downtown Boutique Hotel',
    type: 'hotel',
    city: 'New York',
    state: 'NY',
    address: '789 5th Avenue, New York, NY 10022',
    phone: '+1 212-555-0789',
    price: 320,
    rating: 4.7,
    reviews: 567,
    bedrooms: 1,
    bathrooms: 1,
    description: 'Modern boutique hotel in the heart of Manhattan. Steps away from world-class shopping, dining, and entertainment. Experience the energy of NYC in style and comfort.',
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800',
    ],
    amenities: ['WiFi', 'Air Conditioning', 'TV', 'Coffee Maker'],
    host: 'NYC Hotels Group',
    hostImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    featured: false,
    totalRooms: 30,
  },
];

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addProperty = (property: Omit<Property, 'id' | 'rating' | 'reviews' | 'featured'>) => {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      rating: 0,
      reviews: 0,
      featured: false,
    };
    setProperties((prev) => [newProperty, ...prev]);
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'status'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      status: 'confirmed',
    };
    setBookings((prev) => [newBooking, ...prev]);
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty, bookings, addBooking }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}
