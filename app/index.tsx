import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MotiView, AnimatePresence } from "moti";
import Svg, { Circle } from "react-native-svg";
import { User, Lock, Mail } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabaseClient"; // keep your existing import (no change)

export default function AuthScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // UI/animation states
  const [cardLayout, setCardLayout] = useState({ w: 0, h: 0, x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });

  const handleUserAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (isSignUp && !name) {
      Alert.alert("Error", "Please enter your name");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          const { error: insertError } = await supabase.from("users").insert([
            {
              id: authData.user.id,
              name,
              email,
            },
          ]);

          if (insertError) throw insertError;

          await AsyncStorage.setItem("userName", name);
          Alert.alert("Success", "Account created successfully!");
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("name")
            .eq("id", data.user.id)
            .maybeSingle();

          if (userError) {
            console.error("Error fetching user data:", userError);
          } else if (userData) {
            await AsyncStorage.setItem("userName", userData.name);
          }

          router.push("/(user)/home");
        }
      }
    } catch (error: any) {
      Alert.alert("Authentication Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessOwner = () => {
    router.push("/business/auth");
  };

  // Card layout measured for calculating tilt center
  const onCardLayout = (e: LayoutChangeEvent) => {
    const { layout } = e.nativeEvent;
    setCardLayout({ w: layout.width, h: layout.height, x: layout.x, y: layout.y });
  };

  // Touch move on card to compute tilt
  const onCardTouchMove = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    const touch = e.nativeEvent;
    // locationX and locationY are relative to the card if on the card's responder
    const x = touch.locationX;
    const y = touch.locationY;

    // calculate percent offset from center (-1..1)
    const px = (x - cardLayout.w / 2) / (cardLayout.w / 2);
    const py = (y - cardLayout.h / 2) / (cardLayout.h / 2);

    // clamp
    const clamp = (v: number) => Math.max(-1, Math.min(1, v));
    const nx = clamp(px);
    const ny = clamp(py);

    // Rotate ranges (gentle) — use negative for natural tilt
    const rotateRange = 8; // degrees
    const rx = -ny * rotateRange;
    const ry = nx * rotateRange;

    // scale slightly when touched
    setTilt({ rx, ry, scale: 1.02 });
  };

  const onCardTouchEnd = () => {
    // reset
    setTilt({ rx: 0, ry: 0, scale: 1 });
  };

  return (
    <View style={styles.container}>
      {/* Background gradient + subtle animated glows using SVG */}
      <LinearGradient
        colors={["#0b1020", "#0f1724", "#0b0f1a"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Big soft SVG glows */}
      <Svg style={styles.svgGlow} width="100%" height="100%" pointerEvents="none">
        <Circle cx="10%" cy="15%" r="220" fill="#6b21a8" opacity="0.12" />
        <Circle cx="85%" cy="82%" r="240" fill="#7c3aed" opacity="0.10" />
        <Circle cx="50%" cy="50%" r="400" fill="#7c3aed" opacity="0.03" />
      </Svg>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <MotiView
              from={{ opacity: 0, translateY: 10, scale: 0.95 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: "timing", duration: 650 }}
            >
              <Text style={styles.title}>StayBooker</Text>
              {/* <Text style={styles.subtitle}>Find your perfect stay</Text> */}
            </MotiView>
          </View>

          <MotiView
            onLayout={onCardLayout}
            style={styles.cardWrapper}
            // animate rotation and scale from tilt state
            animate={{
              transform: [
                { perspective: 1400 },
                { rotateX: `${tilt.rx}deg` },
                { rotateY: `${tilt.ry}deg` },
                { scale: tilt.scale },
              ],
            }}
            transition={{
              type: "spring",
              damping: 18,
              stiffness: 120,
            }}
            // attach touch handlers to control tilt
            onTouchMove={onCardTouchMove}
            onTouchEnd={onCardTouchEnd}
            onTouchCancel={onCardTouchEnd}
          >
            {/* Glass / frosted backdrop */}
            <BlurView intensity={50} tint="dark" style={styles.glassCard}>
              {/* inner animated glow border */}
              <MotiView
                style={styles.glowBorder}
                from={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ loop: true, type: "timing", duration: 2400, repeatReverse: true }}
              />

              {/* subtle inner pattern overlay */}
              <View style={styles.innerPattern} />

              <View style={styles.cardContent}>
                {/* logo */}
                <MotiView
                  from={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", duration: 700 }}
                  style={styles.logoCircle}
                >
                  <Text style={styles.logoText}>S</Text>
                </MotiView>

                <Text style={styles.cardTitle}>{isSignUp ? "Create Account" : "Welcome Back"}</Text>
                <Text style={styles.cardSubtitle}>Sign in to continue to StayBooker</Text>

                {/* Form */}
                <View style={{ width: "100%", marginTop: 10 }}>
                  {isSignUp && (
                    <MotiView
                      from={{ opacity: 0, translateY: 6 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{ delay: 50 }}
                    >
                      <View style={styles.inputContainer}>
                        <User color="#c7def7" size={18} style={styles.inputIcon} />
                        <TextInput
                          style={styles.input}
                          placeholder="Full Name"
                          placeholderTextColor="#9aa6b8"
                          value={name}
                          onChangeText={setName}
                        />
                      </View>
                    </MotiView>
                  )}

                  <MotiView
                    from={{ opacity: 0, translateY: 8 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 90 }}
                  >
                    <View style={styles.inputContainer}>
                      <Mail color="#c7def7" size={18} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#9aa6b8"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </View>
                  </MotiView>

                  <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 130 }}
                  >
                    <View style={styles.inputContainer}>
                      <Lock color="#c7def7" size={18} style={styles.inputIcon} />
                      <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#9aa6b8"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                    </View>
                  </MotiView>

                  <MotiView
                    from={{ opacity: 0, translateY: 12 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 170 }}
                  >
                    <TouchableOpacity
                      style={[styles.primaryButton, loading && styles.buttonDisabled]}
                      onPress={handleUserAuth}
                      disabled={loading}
                      activeOpacity={0.85}
                    >
                      <MotiView
                        style={styles.buttonInner}
                        from={{ translateX: -80, opacity: 0 }}
                        animate={{ translateX: 0, opacity: 1 }}
                        transition={{ type: "timing", duration: 600 }}
                      >
                        {loading ? (
                          <ActivityIndicator color="#071128" />
                        ) : (
                          <Text style={styles.primaryButtonText}>
                            {isSignUp ? "Sign Up" : "Sign In"}
                          </Text>
                        )}
                      </MotiView>
                    </TouchableOpacity>
                  </MotiView>

                  <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={{ marginTop: 12 }}>
                    <Text style={styles.switchText}>
                      {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </MotiView>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.businessButton} onPress={handleBusinessOwner} activeOpacity={0.85}>
            <Text style={styles.businessButtonText}>I'm a Business Owner</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>List your property and reach thousands of travelers</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#061024" },
  svgGlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    alignItems: "center",
  },
  header: { alignItems: "center", marginBottom: 18 },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#bcd3f0",
  },

  cardWrapper: {
    width: "100%",
    maxWidth: 420,
    marginVertical: 6,
    alignItems: "center",
  },

  glassCard: {
    width: "100%",
    borderRadius: 18,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
    backgroundColor: "rgba(8,12,20,0.35)",
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },

  glowBorder: {
    position: "absolute",
    inset: 0 as any,
    borderRadius: 18,
    // a faint, soft gradient-like border mimic:
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 2,
  },

  innerPattern: {
    position: "absolute",
    inset: 0 as any,
    opacity: 0.03,
    backgroundColor: "transparent",
  },

  cardContent: {
    alignItems: "center",
  },

  logoCircle: {
    width: 62,
    height: 62,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    marginBottom: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    backgroundClip: "text" as any,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
    textAlign: "center",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#d1dbe9",
    opacity: 0.7,
    marginTop: 3,
    marginBottom: 10,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.02)",
    height: 48,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.95,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#dbeafe",
  },

  primaryButton: {
    backgroundColor: "#e6f0ff",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    overflow: "hidden",
  },
  buttonInner: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  primaryButtonText: {
    color: "#071128",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonDisabled: { opacity: 0.6 },

  switchText: {
    color: "#c7def7",
    textAlign: "center",
    marginTop: 12,
    fontSize: 13,
  },

  divider: {
    width: "100%",
    maxWidth: 420,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 26,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  dividerText: {
    color: "#c7def7",
    paddingHorizontal: 12,
    fontSize: 12,
    fontWeight: "700",
  },

  businessButton: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(124,58,237,0.12)",
    width: "100%",
    maxWidth: 420,
  },
  businessButtonText: {
    color: "#e6f0ff",
    fontSize: 15,
    fontWeight: "700",
  },

  footer: {
    marginTop: 16,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  footerText: {
    color: "#c7def7",
    fontSize: 13,
    textAlign: "center",
  },
});
