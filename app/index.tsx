import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Lock, Mail } from 'lucide-react-native';
import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUserAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isSignUp && !name) {
      Alert.alert('Error', 'Please enter your name');
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
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              id: authData.user.id,
              name,
              email,
            }]);

          if (insertError) throw insertError;

          await AsyncStorage.setItem('userName', name);
          Alert.alert('Success', 'Account created successfully!');
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
            .from('users')
            .select('name')
            .eq('id', data.user.id)
            .maybeSingle();

          if (userError) {
            console.error('Error fetching user data:', userError);
          } else if (userData) {
            await AsyncStorage.setItem('userName', userData.name);
          }

          router.push('/(user)/home');
        }
      }
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessOwner = () => {
    router.push('/business/auth');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a365d', '#2d5a88', '#4a7ba7']}
        style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>

            <View style={styles.header}>
              <Text style={styles.title}>StayBooker</Text>
              <Text style={styles.subtitle}>Find your perfect stay</Text>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>{isSignUp ? 'Create Account' : 'Welcome Back'}</Text>

              {isSignUp && (
                <View style={styles.inputContainer}>
                  <User color="#4a7ba7" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#999"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Mail color="#4a7ba7" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock color="#4a7ba7" size={20} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                onPress={handleUserAuth}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.switchText}>
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.businessButton}
              onPress={handleBusinessOwner}
              activeOpacity={0.8}>
              <Text style={styles.businessButtonText}>I'm a Business Owner</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>List your property and reach thousands of travelers</Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7f0',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a365d',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#f9fafb',
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
  primaryButton: {
    backgroundColor: '#4a7ba7',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4a7ba7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  switchText: {
    color: '#4a7ba7',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#fff',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  businessButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  businessButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#e0e7f0',
    fontSize: 13,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
