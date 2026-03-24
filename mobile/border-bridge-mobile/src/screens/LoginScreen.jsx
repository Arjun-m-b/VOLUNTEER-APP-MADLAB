import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../lib/api';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { colors } from '../theme/colors';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginScreen() {
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values) {
    setApiError('');
    try {
      const data = await loginUser(values.email, values.password);
      await login(data.user, data.token);
    } catch (err) {
      setApiError(err.message || 'Login failed. Please check your credentials.');
    }
  }

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={36} color={colors.white} />
          </View>
          <Text style={styles.brandTitle}>Border Bridge</Text>
          <Text style={styles.brandSubtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.card}>
          {apiError ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={16} color={colors.red700} style={{ marginRight: 6 }} />
              <Text style={styles.errorText}>{apiError}</Text>
            </View>
          ) : null}

          <Controller control={control} name="email" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Email" required placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" autoComplete="email" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.email?.message} style={styles.inputGap} />
          )} />

          <Controller control={control} name="password" render={({ field: { onChange, onBlur, value } }) => (
            <Input label="Password" required placeholder="••••••••" secureTextEntry autoComplete="password" onChangeText={onChange} onBlur={onBlur} value={value} error={errors.password?.message} style={styles.inputGap} />
          )} />

          <Button title={isSubmitting ? 'Signing in…' : 'Sign In'} onPress={handleSubmit(onSubmit)} loading={isSubmitting} size="lg" style={styles.submitBtn} textStyle={{ fontSize: 18, fontWeight: '600' }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, backgroundColor: colors.gray50 },
  container: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  brandRow: { alignItems: 'center', marginBottom: 32 },
  iconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.emerald600, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  brandTitle: { fontSize: 30, fontWeight: '700', color: colors.gray900, marginBottom: 8 },
  brandSubtitle: { fontSize: 16, color: colors.gray600 },
  card: { backgroundColor: colors.white, borderRadius: 8, padding: 32, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 1, borderColor: colors.gray100 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.red50, borderWidth: 1, borderColor: colors.red100, borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: colors.red700, fontSize: 13, flex: 1 },
  inputGap: { marginBottom: 24 },
  submitBtn: { marginTop: 8, paddingVertical: 16 },
});
