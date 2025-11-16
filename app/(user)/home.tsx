import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Svg, { Circle } from "react-native-svg";
import {
  Search,
  MapPin,
  Star,
  Heart,
  SlidersHorizontal,
  User as UserIcon,
  Calendar,
  Users,
  Bed,
  Wifi,
  Coffee,
  Dumbbell,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../supabaseClient";

export default function EnhancedUserHomeScreen() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [guests, setGuests] = useState<string>("2 Adults, 1 Room");
  const [userName, setUserName] = useState("Guest");
  const [loading, setLoading] = useState(true);

  /* =============== FETCH USERNAME + DATA =============== */
  useEffect(() => {
    loadUserName();
    initializeDates();
    fetchProperties();
  }, []);

  const loadUserName = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("name")
          .eq("id", user.id)
          .maybeSingle();

        if (userData?.name) setUserName(userData.name);
        else {
          const storedName = await AsyncStorage.getItem("userName");
          if (storedName) setUserName(storedName);
        }
      }
    } catch (e) {}
  };

  const initializeDates = () => {
    const today = new Date();
    const tmr = new Date(today);
    tmr.setDate(tmr.getDate() + 1);
    const after = new Date(tmr);
    after.setDate(after.getDate() + 2);

    setCheckInDate(tmr.toISOString().split("T")[0]);
    setCheckOutDate(after.toISOString().split("T")[0]);
  };

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "available")
        .order("created_at", { ascending: false });

      if (data) {
        const formatted = data.map((p) => ({
          id: p.id,
          name: p.name,
          type: p.type,
          city: p.city,
          state: p.state,
          location: p.location,
          price: p.price,
          rating: p.rating || 0,
          reviews: p.reviews || 0,
          bedrooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0,
          description: p.description || "",
          images: Array.isArray(p.images) ? p.images : [],
          amenities: p.amenities || "",
          status: p.status,
          featured: p.featured || false,
        }));
        setProperties(formatted);
      }
    } finally {
      setLoading(false);
    }
  };

  /* =============== FILTER DATA =============== */
  const filteredProperties = properties.filter(
    (p: any) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredProperties = filteredProperties.filter((p: any) => p.featured);

  const allProperties = filteredProperties;

  /* =============== FAVORITE TOGGLE =============== */
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const formatDate = (ds: string) => {
    const date = new Date(ds);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Fallback/sample data for UI when backend returns no offers/events
  const specialOffers: Array<any> = [
    {
      id: "offer-1",
      title: "Weekend Escape – 30% Off",
      property: "Seaside Resort",
      image:
        "https://images.unsplash.com/photo-1501117716987-c8e6bfb9f1d1?q=80&w=1080&auto=format&fit=crop",
      discount: "30% OFF",
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      color: "#ef4444",
    },
    {
      id: "offer-2",
      title: "Midweek Saver – 20% Off",
      property: "City Center Hotel",
      image:
        "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?q=80&w=1080&auto=format&fit=crop",
      discount: "20% OFF",
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      color: "#f59e0b",
    },
  ];

  const upcomingEvents: Array<any> = [
    {
      id: "event-1",
      title: "Live Jazz Night",
      venue: "Seaside Resort",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1080&auto=format&fit=crop",
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      attendees: 42,
      ticketPrice: 499,
      category: "Music",
    },
    {
      id: "event-2",
      title: "Weekend Yoga Retreat",
      venue: "City Center Hotel",
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1080&auto=format&fit=crop",
      date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      attendees: 18,
      ticketPrice: 799,
      category: "Wellness",
    },
  ];

  /* ======================================================
     =====================  UI START  =====================
     ====================================================== */

  return (
    <View style={styles.container}>
      {/* --------- Neon Background + Glow --------- */}
      <LinearGradient
        colors={["#0b1020", "#0c1122", "#0b0f1a"]}
        style={StyleSheet.absoluteFill}
      />

      <Svg width="100%" height="100%" style={styles.bgGlow}>
        <Circle cx="14%" cy="8%" r="220" fill="#7c3aed" opacity="0.12" />
        <Circle cx="82%" cy="88%" r="260" fill="#6b21a8" opacity="0.10" />
        <Circle cx="50%" cy="50%" r="420" fill="#8b5cf6" opacity="0.05" />
      </Svg>

      {/* =============== HEADER =============== */}
      <BlurView intensity={40} tint="dark" style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Welcome back</Text>
            <Text style={styles.username}>{userName}</Text>
          </View>

          <TouchableOpacity style={styles.profileButton}>
            <UserIcon size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <BlurView intensity={30} tint="dark" style={styles.searchBar}>
            <Search color="#cbd5e1" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search hotels, destinations..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </BlurView>

          <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
            <SlidersHorizontal color="#fff" size={22} />
          </TouchableOpacity>
        </View>
      </BlurView>
      {/* ======================================================
          QUICK BOOKING CARD — Neon / Glass Theme
      ====================================================== */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BlurView intensity={45} tint="dark" style={styles.quickBookingCard}>
          <View style={styles.quickBookingHeader}>
            <View style={styles.quickBookingTitleRow}>
              <Bed color="#60a5fa" size={26} />
              <Text style={styles.quickBookingTitle}>Book Your Stay</Text>
            </View>
            <Text style={styles.quickBookingSubtitle}>
              Find your perfect room
            </Text>
          </View>

          {/* DATE + GUEST INPUTS */}
          <View style={styles.quickBookingInputs}>
            <View style={styles.dateInputRow}>
              {/* CHECK-IN */}
              <TouchableOpacity
                style={styles.dateInput}
                activeOpacity={0.8}
                onPress={() => {
                  const today = new Date();
                  const tomorrow = new Date(today);
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setCheckInDate(tomorrow.toISOString().split("T")[0]);
                }}
              >
                <Calendar size={18} color="#cbd5e1" />
                <View style={styles.dateInputText}>
                  <Text style={styles.dateLabel}>Check-in</Text>
                  <Text style={styles.dateValue}>
                    {checkInDate
                      ? new Date(checkInDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Select date"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* CHECK-OUT */}
              <TouchableOpacity
                style={styles.dateInput}
                activeOpacity={0.8}
                onPress={() => {
                  const checkIn = new Date(checkInDate);
                  const next = new Date(checkIn);
                  next.setDate(next.getDate() + 1);
                  setCheckOutDate(next.toISOString().split("T")[0]);
                }}
              >
                <Calendar size={18} color="#cbd5e1" />
                <View style={styles.dateInputText}>
                  <Text style={styles.dateLabel}>Check-out</Text>
                  <Text style={styles.dateValue}>
                    {checkOutDate
                      ? new Date(checkOutDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Select date"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* GUESTS INPUT */}
            <TouchableOpacity
              style={styles.guestsInput}
              activeOpacity={0.8}
              onPress={() => {
                Alert.alert("Guests", "Select number of guests", [
                  { text: "1 Adult, 1 Room", onPress: () => setGuests("1 Adult, 1 Room") },
                  { text: "2 Adults, 1 Room", onPress: () => setGuests("2 Adults, 1 Room") },
                  { text: "2 Adults, 2 Rooms", onPress: () => setGuests("2 Adults, 2 Rooms") },
                  { text: "Cancel", style: "cancel" },
                ]);
              }}
            >
              <Users size={18} color="#cbd5e1" />
              <View style={styles.dateInputText}>
                <Text style={styles.dateLabel}>Guests</Text>
                <Text style={styles.dateValue}>{guests}</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* SEARCH BUTTON */}
          <TouchableOpacity
            style={styles.searchRoomsButton}
            activeOpacity={0.9}
            onPress={() => {
              if (!checkInDate || !checkOutDate) {
                Alert.alert("Missing Dates", "Please select check-in and check-out dates");
                return;
              }

              const checkIn = new Date(checkInDate);
              const checkOut = new Date(checkOutDate);

              if (checkOut <= checkIn) {
                Alert.alert("Invalid Dates", "Check-out must be after check-in");
                return;
              }

              const nights = Math.ceil(
                (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
              );

              Alert.alert(
                "Search Results",
                `Searching rooms:\n\nCheck-in: ${checkIn.toLocaleDateString()}\nCheck-out: ${checkOut.toLocaleDateString()}\nNights: ${nights}\nGuests: ${guests}\n\nShowing all available properties.`,
                [{ text: "OK" }]
              );
            }}
          >
            <Search size={20} color="#fff" />
            <Text style={styles.searchRoomsButtonText}>Search Rooms</Text>
          </TouchableOpacity>
        </BlurView>
        {/* ======================================================
            SPECIAL OFFERS — Neon Cards + Dark Overlay
        ====================================================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Special Offers</Text>
              <Text style={styles.sectionSubtitle}>Limited time deals</Text>
            </View>

            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offersScroll}
          >
            {specialOffers.map((offer) => (
              <TouchableOpacity
                key={offer.id}
                style={styles.offerCard}
                activeOpacity={0.9}
              >
                <Image source={{ uri: offer.image }} style={styles.offerImage} />

                {/* DARK GRADIENT OVERLAY */}
                <LinearGradient
                  colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.85)"]}
                  style={styles.offerOverlay}
                >
                  {/* DISCOUNT BADGE */}
                  <View style={[styles.discountBadge, { backgroundColor: offer.color }]}>
                    <Text style={styles.discountText}>{offer.discount}</Text>
                  </View>

                  {/* CARD CONTENT */}
                  <BlurView intensity={30} tint="dark" style={styles.offerContent}>
                    <Text style={styles.offerTitle} numberOfLines={2}>
                      {offer.title}
                    </Text>

                    <View style={styles.offerLocation}>
                      <MapPin size={14} color="#a5b4fc" />
                      <Text style={styles.offerLocationText} numberOfLines={1}>
                        {offer.property}
                      </Text>
                    </View>

                    {/* VALID UNTIL */}
                    <View style={styles.offerFooter}>
                      <View style={styles.validUntilContainer}>
                        <Calendar size={12} color="#cbd5e1" />
                        <Text style={styles.validUntilText}>
                          Valid until {formatDate(offer.validUntil)}
                        </Text>
                      </View>
                    </View>

                    {/* BOOK NOW BUTTON */}
                    <TouchableOpacity
                      style={styles.bookNowButton}
                      activeOpacity={0.85}
                      onPress={() => {
                        const match = properties.find((p) =>
                          p.name.toLowerCase().includes(offer.property.toLowerCase())
                        );
                        if (match) router.push(`/(user)/property/${match.id}`);
                        else if (properties.length > 0)
                          router.push(`/(user)/property/${properties[0].id}`);
                      }}
                    >
                      <Text style={styles.bookNowButtonText}>Book Now</Text>
                    </TouchableOpacity>
                  </BlurView>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ======================================================
            POPULAR AMENITIES — Neon Chips
        ====================================================== */}
        <View style={styles.amenitiesSection}>
          <Text style={styles.amenitiesTitle}>Popular Amenities</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.amenitiesScroll}
          >
            <TouchableOpacity style={styles.amenityChip} activeOpacity={0.7}>
              <Wifi size={18} color="#60a5fa" />
              <Text style={styles.amenityChipText}>Free WiFi</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.amenityChip} activeOpacity={0.7}>
              <Coffee size={18} color="#60a5fa" />
              <Text style={styles.amenityChipText}>Breakfast</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.amenityChip} activeOpacity={0.7}>
              <Dumbbell size={18} color="#60a5fa" />
              <Text style={styles.amenityChipText}>Gym</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.amenityChip} activeOpacity={0.7}>
              <Bed size={18} color="#60a5fa" />
              <Text style={styles.amenityChipText}>Pool</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* ======================================================
            FEATURED HOTELS — Neon Gradient Cards
        ====================================================== */}
        {searchQuery === "" && featuredProperties.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Featured Hotels</Text>
                <Text style={styles.sectionSubtitle}>Handpicked for you</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScroll}
            >
              {featuredProperties.map((property) => (
                <TouchableOpacity
                  key={property.id}
                  style={styles.featuredCard}
                  activeOpacity={0.9}
                  onPress={() =>
                    router.push(`/(user)/property/${property.id}`)
                  }
                >
                  {/* IMAGE */}
                  <Image
                    source={{
                      uri:
                        property.images && property.images.length > 0
                          ? property.images[0]
                          : 'https://via.placeholder.com/400x300?text=No+Image',
                    }}
                    style={styles.featuredImage}
                  />

                  {/* FAVORITE HEART */}
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    activeOpacity={0.8}
                    onPress={() => toggleFavorite(property.id)}
                  >
                    <Heart
                      size={20}
                      color={
                        favorites.includes(property.id)
                          ? "#f87171"
                          : "#ffffff"
                      }
                      fill={
                        favorites.includes(property.id)
                          ? "#f87171"
                          : "transparent"
                      }
                    />
                  </TouchableOpacity>

                  {/* GRADIENT OVERLAY */}
                  <LinearGradient
                    colors={[
                      "rgba(0,0,0,0)",
                      "rgba(0,0,0,0.8)",
                      "rgba(0,0,0,0.9)",
                    ]}
                    style={styles.featuredOverlay}
                  >
                    <View style={styles.featuredContent}>
                      <Text
                        style={styles.featuredName}
                        numberOfLines={1}
                      >
                        {property.name}
                      </Text>

                      <View style={styles.featuredLocation}>
                        <MapPin size={14} color="#e2e8f0" />
                        <Text style={styles.featuredLocationText}>
                          {property.city}, {property.state}
                        </Text>
                      </View>

                      <View style={styles.featuredFooter}>
                        {property.rating > 0 && (
                          <View style={styles.ratingBadge}>
                            <Star
                              size={12}
                              color="#fbbf24"
                              fill="#fbbf24"
                            />
                            <Text style={styles.ratingText}>
                              {property.rating}
                            </Text>
                          </View>
                        )}

                        <Text style={styles.featuredPrice}>
                          ₹{property.price}/night
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ======================================================
            UPCOMING EVENTS — Neon Cards + Blue Highlights
        ====================================================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Upcoming Events</Text>
              <Text style={styles.sectionSubtitle}>
                Book tickets for exclusive events
              </Text>
            </View>

            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {upcomingEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                activeOpacity={0.9}
              >
                {/* EVENT IMAGE */}
                <Image
                  source={{ uri: event.image }}
                  style={styles.eventImage}
                />

                {/* CATEGORY TAG */}
                <View style={styles.eventCategoryBadge}>
                  <Text style={styles.eventCategoryText}>
                    {event.category}
                  </Text>
                </View>

                {/* EVENT CARD CONTENT */}
                <BlurView
                  intensity={35}
                  tint="dark"
                  style={styles.eventContent}
                >
                  <Text
                    style={styles.eventTitle}
                    numberOfLines={2}
                  >
                    {event.title}
                  </Text>

                  {/* LOCATION */}
                  <View style={styles.eventLocation}>
                    <MapPin size={14} color="#94a3b8" />
                    <Text
                      style={styles.eventLocationText}
                      numberOfLines={1}
                    >
                      {event.venue}
                    </Text>
                  </View>

                  {/* DATE + ATTENDEES */}
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetailItem}>
                      <Calendar size={14} color="#cbd5e1" />
                      <Text style={styles.eventDetailText}>
                        {formatDate(event.date)}
                      </Text>
                    </View>

                    <View style={styles.eventDetailItem}>
                      <Users size={14} color="#cbd5e1" />
                      <Text style={styles.eventDetailText}>
                        {event.attendees} attending
                      </Text>
                    </View>
                  </View>

                  {/* FOOTER */}
                  <View style={styles.eventFooter}>
                    <View>
                      <Text style={styles.eventPriceLabel}>From</Text>
                      <Text style={styles.eventPrice}>
                        ₹{event.ticketPrice}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.bookTicketButton}
                      activeOpacity={0.85}
                      onPress={() =>
                        router.push("/(user)/CreateEventScreen")
                      }
                    >
                      <Text style={styles.bookTicketButtonText}>
                        Book Ticket
                      </Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* ======================================================
            ALL PROPERTIES — Neon Glass List
        ====================================================== */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : "All Properties"}
              </Text>
              <Text style={styles.sectionSubtitle}>
                {allProperties.length} properties available
              </Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#60a5fa" />
              <Text style={styles.loadingText}>Loading properties...</Text>
            </View>
          ) : allProperties.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No properties found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search
              </Text>
            </View>
          ) : (
            allProperties.map((property) => (
              <TouchableOpacity
                key={property.id}
                style={styles.propertyCard}
                activeOpacity={0.9}
                onPress={() =>
                  router.push(`/(user)/property/${property.id}`)
                }
              >
                <Image
                  source={{
                    uri:
                      property.images && property.images.length > 0
                        ? property.images[0]
                        : 'https://via.placeholder.com/400x300?text=No+Image',
                  }}
                  style={styles.propertyImage}
                />

                <BlurView intensity={35} tint="dark" style={styles.propertyContent}>
                  {/* HEADER */}
                  <View style={styles.propertyHeader}>
                    <View style={styles.propertyInfo}>
                      <Text
                        style={styles.propertyName}
                        numberOfLines={1}
                      >
                        {property.name}
                      </Text>

                      <View style={styles.propertyLocation}>
                        <MapPin size={14} color="#94a3b8" />
                        <Text style={styles.propertyLocationText}>
                          {property.city}, {property.state}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => toggleFavorite(property.id)}
                    >
                      <Heart
                        size={22}
                        color={
                          favorites.includes(property.id)
                            ? "#f87171"
                            : "#cbd5e1"
                        }
                        fill={
                          favorites.includes(property.id)
                            ? "#f87171"
                            : "transparent"
                        }
                      />
                    </TouchableOpacity>
                  </View>

                  {/* DETAILS */}
                  <View style={styles.propertyDetails}>
                    <View style={styles.propertyTag}>
                      <Text style={styles.propertyTagText}>
                        {property.type === "hotel"
                          ? "Hotel"
                          : "House"}
                      </Text>
                    </View>

                    <Text style={styles.propertyDetailText}>
                      {property.bedrooms} bed • {property.bathrooms} bath
                    </Text>
                  </View>

                  {/* FOOTER */}
                  <View style={styles.propertyFooter}>
                    {property.rating > 0 ? (
                      <View style={styles.ratingContainer}>
                        <Star
                          size={16}
                          color="#fbbf24"
                          fill="#fbbf24"
                        />
                        <Text style={styles.propertyRating}>
                          {property.rating}
                        </Text>
                        <Text style={styles.propertyReviews}>
                          ({property.reviews})
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.newPropertyBadge}>New</Text>
                    )}

                    <Text style={styles.propertyPrice}>
                      ₹{property.price}
                      <Text style={styles.priceUnit}>/night</Text>
                    </Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ======================================================
            CTA BANNER — Event Hosting Neon Card
        ====================================================== */}
        <BlurView intensity={35} tint="dark" style={styles.eventHostingBanner}>
          <View style={styles.eventHostingContent}>
            <Text style={styles.eventHostingTitle}>
              Need a Venue for Your Event?
            </Text>

            <Text style={styles.eventHostingSubtitle}>
              Book premium halls and event spaces
            </Text>

            <TouchableOpacity
              style={styles.eventHostingButton}
              activeOpacity={0.85}
              onPress={() => router.push("/(user)/CreateEventScreen")}
            >
              <Calendar size={18} color="#60a5fa" />
              <Text style={styles.eventHostingButtonText}>
                Browse Event Venues
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

/* ==========================================================
   =====================  FULL STYLES  ======================
   ========================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },

  /* BACKGROUND GLOW */
  bgGlow: {
    position: "absolute",
    top: 0,
    left: 0,
  },

  /* HEADER */
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  greeting: {
    fontSize: 14,
    color: "#a5b4fc",
  },
  username: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  /* SEARCH */
  searchContainer: {
    flexDirection: "row",
    gap: 12,
  },
  searchBar: {
    flex: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#f1f5f9",
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  scrollView: { flex: 1 },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* QUICK BOOKING */
  quickBookingCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  quickBookingHeader: { marginBottom: 20 },
  quickBookingTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  quickBookingTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  quickBookingSubtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    marginTop: 4,
  },
  quickBookingInputs: {
    gap: 12,
    marginBottom: 16,
  },
  dateInputRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 12,
  },
  guestsInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    gap: 12,
  },
  dateInputText: { flex: 1 },
  dateLabel: {
    color: "#94a3b8",
    fontSize: 12,
    marginBottom: 2,
  },
  dateValue: {
    color: "#f8fafc",
    fontWeight: "600",
    fontSize: 14,
  },
  searchRoomsButton: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 14,
  },
  searchRoomsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* SECTIONS */
  section: { marginBottom: 28 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionSubtitle: {
    color: "#94a3b8",
    fontSize: 14,
  },
  seeAllText: {
    color: "#60a5fa",
    fontWeight: "600",
    fontSize: 15,
  },

  /* SPECIAL OFFERS */
  offersScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
  offerCard: {
    width: 300,
    height: 360,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  offerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  offerOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  discountBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  discountText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  offerContent: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  offerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  offerLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  offerLocationText: {
    color: "#d1d5db",
    fontSize: 13,
    flex: 1,
  },
  offerFooter: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  validUntilContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  validUntilText: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  bookNowButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  bookNowButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  /* AMENITIES */
  amenitiesSection: { marginHorizontal: 20, marginBottom: 28 },
  amenitiesTitle: {
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  amenitiesScroll: { gap: 12 },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  amenityChipText: {
    color: "#60a5fa",
    fontSize: 14,
    fontWeight: "600",
  },

  /* FEATURED HOTELS */
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
  featuredCard: {
    width: 280,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  featuredImage: {
    width: "100%",
    height: 180,
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  featuredContent: {},
  featuredName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  featuredLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  featuredLocationText: {
    color: "#e2e8f0",
    fontSize: 14,
  },
  featuredFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
  },
  ratingText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  featuredPrice: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  /* EVENTS */
  eventCard: {
    width: 280,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  eventImage: {
    width: "100%",
    height: 160,
  },
  eventCategoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(59,130,246,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  eventCategoryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  eventContent: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  eventTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventLocation: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  eventLocationText: {
    color: "#cbd5e1",
    fontSize: 13,
    flex: 1,
  },
  eventDetails: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  eventDetailItem: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  eventDetailText: {
    color: "#cbd5e1",
    fontSize: 12,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventPriceLabel: {
    color: "#94a3b8",
    fontSize: 12,
  },
  eventPrice: {
    color: "#22c55e",
    fontSize: 20,
    fontWeight: "bold",
  },
  bookTicketButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
  },
  bookTicketButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  /* PROPERTY LIST */
  propertyCard: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  propertyImage: {
    width: 120,
    height: "100%",
  },
  propertyContent: {
    flex: 1,
    padding: 14,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  propertyInfo: {
    flex: 1,
    marginRight: 8,
  },
  propertyName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  propertyLocation: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  propertyLocationText: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  propertyDetails: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  propertyTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(59,130,246,0.2)",
  },
  propertyTagText: {
    color: "#60a5fa",
    fontWeight: "600",
    fontSize: 11,
  },
  propertyDetailText: {
    color: "#cbd5e1",
    fontSize: 13,
  },
  propertyFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  propertyRating: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  propertyReviews: {
    color: "#94a3b8",
    fontSize: 12,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22c55e",
  },
  priceUnit: {
    fontSize: 12,
    color: "#94a3b8",
  },
  newPropertyBadge: {
    color: "#22c55e",
    backgroundColor: "rgba(34,197,94,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: "600",
    fontSize: 12,
  },

  /* CTA */
  eventHostingBanner: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  eventHostingContent: { alignItems: "center" },
  eventHostingTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  eventHostingSubtitle: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  eventHostingButton: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "#3b82f6",
  },
  eventHostingButtonText: {
    color: "#60a5fa",
    fontWeight: "600",
    fontSize: 15,
  },

  bottomPadding: {
    height: 40,
  },

  /* LOADING / EMPTY STATES */
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#94a3b8",
    fontSize: 16,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 6,
    fontWeight: "600",
  },
  emptySubtext: {
    color: "#94a3b8",
    fontSize: 14,
  },
});
