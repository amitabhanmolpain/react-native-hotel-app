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
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeTouchEvent,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import Svg, { Circle } from "react-native-svg";
import { Building2, Mail, Lock, ArrowLeft } from "lucide-react-native";
import { supabase } from "../supabaseClient";

export default function BusinessAuthScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  const [cardLayout, setCardLayout] = useState({ w: 0, h: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { businessName },
          },
        });
        if (error) throw error;

        Alert.alert(
          "Success",
          "Business registered successfully! Check your email for verification."
        );
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        router.push("/business/(tabs)/dashboard");
      }
    } catch (error: any) {
      Alert.alert("Authentication Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onCardLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setCardLayout({ w: width, h: height });
  };

  const onCardTouchMove = (e: NativeSyntheticEvent<NativeTouchEvent>) => {
    const x = e.nativeEvent.locationX;
    const y = e.nativeEvent.locationY;

    const px = (x - cardLayout.w / 2) / (cardLayout.w / 2);
    const py = (y - cardLayout.h / 2) / (cardLayout.h / 2);

    const clamp = (v: number) => Math.max(-1, Math.min(1, v));

    const nx = clamp(px);
    const ny = clamp(py);

    const rotateRange = 8;

    setTilt({
      rx: -ny * rotateRange,
      ry: nx * rotateRange,
      scale: 1.02,
    });
  };

  const onCardTouchEnd = () => {
    setTilt({ rx: 0, ry: 0, scale: 1 });
  };

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={["#0b1020", "#0e1422", "#0b0f1a"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft SVG glows */}
      <Svg style={styles.glow} width="100%" height="100%" pointerEvents="none">
        <Circle cx="15%" cy="12%" r="210" fill="#6b21a8" opacity="0.12" />
        <Circle cx="85%" cy="85%" r="240" fill="#7c3aed" opacity="0.12" />
        <Circle cx="50%" cy="50%" r="420" fill="#7c3aed" opacity="0.04" />
      </Svg>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/")}
            activeOpacity={0.8}
          >
            <ArrowLeft size={22} color="#fff" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <MotiView
              from={{ opacity: 0, translateY: 12 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ duration: 600 }}
            >
              <Building2 size={54} color="#fff" />
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 150, duration: 650 }}
            >
              <Text style={styles.title}>Business Portal</Text>
              {/* <Text style={styles.subtitle}>Manage your properties</Text> */}
            </MotiView>
          </View>

          {/* Glass card */}
          <MotiView
            onLayout={onCardLayout}
            onTouchMove={onCardTouchMove}
            onTouchEnd={onCardTouchEnd}
            animate={{
              transform: [
                { perspective: 1400 },
                { rotateX: `${tilt.rx}deg` },
                { rotateY: `${tilt.ry}deg` },
                { scale: tilt.scale },
              ],
            }}
            transition={{ type: "spring", damping: 18, stiffness: 120 }}
            style={styles.cardWrapper}
          >
            <BlurView intensity={45} tint="dark" style={styles.glassCard}>
              {/* Glow border */}
              <MotiView
                style={styles.glowBorder}
                from={{ opacity: 0.2 }}
                animate={{ opacity: 0.6 }}
                transition={{
                  loop: true,
                  repeatReverse: true,
                  duration: 2200,
                }}
              />

              <View style={styles.formContent}>
                <Text style={styles.formTitle}>
                  {isSignUp ? "Register Your Business" : "Business Login"}
                </Text>

                {isSignUp && (
                  <View style={styles.inputContainer}>
                    <Building2 color="#c7def7" size={18} style={styles.icon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Business Name"
                      placeholderTextColor="#9aa6b8"
                      value={businessName}
                      onChangeText={setBusinessName}
                    />
                  </View>
                )}

                <View style={styles.inputContainer}>
                  <Mail color="#c7def7" size={18} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Business Email"
                    placeholderTextColor="#9aa6b8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock color="#c7def7" size={18} style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9aa6b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleAuth}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryButtonText}>
                    {isSignUp ? "Register" : "Sign In"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsSignUp(!isSignUp)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.switchText}>
                    {isSignUp
                      ? "Already registered? Sign In"
                      : "New business? Register"}
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </MotiView>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why list with us?</Text>
            <Text style={styles.infoText}>• Reach thousands of travelers</Text>
            <Text style={styles.infoText}>• Easy property management</Text>
            <Text style={styles.infoText}>• Secure payment processing</Text>
            <Text style={styles.infoText}>• 24/7 support</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* =====================  STYLES  ===================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0f1a" },
  glow: { position: "absolute", width: "100%", height: "100%" },
  keyboardView: { flex: 1 },
  scrollContent: { padding: 22, paddingTop: 70 },

  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  header: { alignItems: "center", marginBottom: 40 },
  title: { fontSize: 34, color: "#fff", fontWeight: "800", marginTop: 10 },
  subtitle: { fontSize: 15, color: "#bcd3f0", marginTop: 4 },

  cardWrapper: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 430,
    marginBottom: 30,
  },

  glassCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 22,
    borderRadius: 18,
    overflow: "hidden",
  },

  glowBorder: {
    position: "absolute",
    inset: 0,
    borderRadius: 18,
    shadowColor: "#8b5cf6",
    shadowOpacity: 0.2,
    shadowRadius: 32,
  },

  formContent: { width: "100%", alignItems: "center" },

  formTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 22,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 14,
    paddingHorizontal: 14,
  },

  icon: { marginRight: 12, opacity: 0.85 },

  input: { flex: 1, color: "#dce8ff", fontSize: 15 },

  primaryButton: {
    marginTop: 8,
    backgroundColor: "#e6f0ff",
    height: 50,
    width: "100%",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },

  primaryButtonText: {
    fontSize: 16,
    color: "#081020",
    fontWeight: "700",
  },

  switchText: {
    marginTop: 16,
    color: "#c7def7",
    fontSize: 14,
    textAlign: "center",
  },

  infoCard: {
    marginTop: 18,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  infoTitle: { fontSize: 18, fontWeight: "800", color: "#fff", marginBottom: 12 },
  infoText: { color: "#dbeafe", fontSize: 14, marginBottom: 6 },
});
