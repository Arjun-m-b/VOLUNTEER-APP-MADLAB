import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createPerson, addCaseNote } from '../lib/api';
import { intakeFormSchema } from '../types/formSchema';
import { colors } from '../theme/colors';

import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Checkbox from '../components/ui/Checkbox';
import AudioRecorder from '../components/AudioRecorder';

const steps = [
  { title: 'Core Identity', icon: 'person', desc: 'Basic personal information' },
  { title: 'The Narrative', icon: 'mic', desc: 'Voice-recorded story' },
  { title: 'Family', icon: 'people', desc: 'Family connections' },
  { title: 'Service Track', icon: 'shield-checkmark', desc: 'Needs and status' },
];

export default function IntakeScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();

  const form = useForm({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      fullName: '', nativeScriptNames: '', dateOfBirth: '', gender: 'Prefer not to say', 
      nationality: '', preferredLanguage: '', voiceNarrative: '', translatedNarrative: '',
      isTravelingAlone: false, familyMembers: [], missingRelatives: [],
      urgentNeeds: [], initialScreeningStatus: true, vulnerabilityMarker: 'Low',
    },
  });

  const { control, handleSubmit, watch, trigger, setValue } = form;
  const { fields: familyFields, append: appendFamily, remove: removeFamily } = useFieldArray({ control, name: 'familyMembers' });
  const { fields: missingFields, append: appendMissing, remove: removeMissing } = useFieldArray({ control, name: 'missingRelatives' });

  const watchedValues = watch();
  
  const isCurrentStepReady = currentStep === 0 
    ? !!(watchedValues.fullName?.trim() && watchedValues.nationality?.trim() && watchedValues.preferredLanguage?.trim() && watchedValues.gender)
    : true;

  const nextStep = async () => {
    let valid = false;
    if (currentStep === 0) valid = await trigger(['fullName', 'nationality', 'preferredLanguage', 'gender']);
    else valid = true; // Other steps have optional fields usually

    if (valid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    const genderMap = { 'Male': 'MALE', 'Female': 'FEMALE', 'Non-binary': 'OTHER', 'Prefer not to say': 'PREFER_NOT_TO_SAY' };
    const nameParts = values.fullName.trim().split(/\s+/);
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '-';
    const urgentNeeds = values.urgentNeeds || [];
    const familyMembers = (values.familyMembers || []).map(m => m.value).filter(Boolean);
    const missingRelatives = (values.missingRelatives || []).map(r => r.value).filter(Boolean);

    const payload = {
      caseType: 'ASYLUM_SEEKER',
      firstName, lastName,
      dateOfBirth: values.dateOfBirth || undefined,
      gender: genderMap[values.gender] || 'PREFER_NOT_TO_SAY',
      nationality: values.nationality,
      originCountry: values.nationality,
      languages: values.preferredLanguage ? [values.preferredLanguage] : [],
      asylumNarrative: values.voiceNarrative || '',
      translatedNarrative: values.translatedNarrative || '',
      flags: {
        medicalEmergency: urgentNeeds.includes('Medical'),
        unaccompaniedMinor: values.isTravelingAlone && !values.dateOfBirth ? true : false,
        traffickingIndicator: false,
        asylumClaim: true,
        familySeparated: missingRelatives.length > 0,
      },
    };

    try {
      const data = await createPerson(payload);
      
      const noteLines = ['[INTAKE FORM SUBMISSION]'];
      if (values.nativeScriptNames) noteLines.push(`Native script name: ${values.nativeScriptNames}`);
      noteLines.push(`Traveling alone: ${values.isTravelingAlone ? 'Yes' : 'No'}`);
      noteLines.push(`Vulnerability marker: ${values.vulnerabilityMarker}`);
      if (urgentNeeds.length > 0) noteLines.push(`Urgent needs: ${urgentNeeds.join(', ')}`);
      if (familyMembers.length > 0) noteLines.push(`Family members present: ${familyMembers.join(', ')}`);
      if (missingRelatives.length > 0) noteLines.push(`Missing relatives: ${missingRelatives.join(', ')}`);
      if (values.translatedNarrative) noteLines.push(`Translated narrative: ${values.translatedNarrative}`);

      try { await addCaseNote(data.person._id, noteLines.join('\n')); } catch (e) {}
      
      form.reset();
      setCurrentStep(0);
      navigation.navigate('Submitted', { person: data.person, caseFile: data.caseFile });
    } catch (err) {
      Alert.alert('Submission Failed', err.message || 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.stepperContainer}>
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;

            return (
              <React.Fragment key={idx}>
                <View style={[
                  styles.stepDot, 
                  isCompleted ? styles.stepDotCompleted : isCurrent ? styles.stepDotActive : styles.stepDotInactive
                ]}>
                  <Ionicons name={step.icon} size={20} color={isCompleted ? colors.white : isCurrent ? '#451a03' : colors.gray400} />
                </View>
                {idx < steps.length - 1 && (
                  <View style={styles.stepLine} />
                )}
              </React.Fragment>
            );
          })}
        </View>
        <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
        <Text style={styles.stepDesc}>{steps[currentStep].desc}</Text>

        <View style={styles.formCard}>
          {currentStep === 0 && (
            <View style={styles.fields}>
              <Controller control={control} name="fullName" render={({ field: { onChange, value } }) => <Input label={<Text>Full Name <Text style={{color: colors.amber600}}>*</Text></Text>} required onChangeText={onChange} value={value} error={form.formState.errors.fullName?.message} />} />
              <Controller control={control} name="nativeScriptNames" render={({ field: { onChange, value } }) => <Input label="Native Script Names" onChangeText={onChange} value={value} />} />
              <Controller control={control} name="dateOfBirth" render={({ field: { onChange, value } }) => <Input label="Date of Birth / Est. Age" placeholder="YYYY-MM-DD or Age" onChangeText={onChange} value={value} />} />
              <Controller control={control} name="gender" render={({ field: { onChange, value } }) => <Select label={<Text>Gender <Text style={{color: colors.amber600}}>*</Text></Text>} required selectedValue={value} onValueChange={onChange} items={[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Non-binary', value: 'Non-binary'}, {label: 'Prefer not to say', value: 'Prefer not to say'}]} />} />
              <Controller control={control} name="nationality" render={({ field: { onChange, value } }) => <Input label={<Text>Nationality <Text style={{color: colors.amber600}}>*</Text></Text>} required onChangeText={onChange} value={value} error={form.formState.errors.nationality?.message} />} />
              <Controller control={control} name="preferredLanguage" render={({ field: { onChange, value } }) => <Select label={<Text>Preferred Language <Text style={{color: colors.amber600}}>*</Text></Text>} required selectedValue={value} onValueChange={onChange} items={[{label: 'Select language', value: ''}, {label: 'English', value: 'English'}, {label: 'Spanish', value: 'Spanish'}, {label: 'Arabic', value: 'Arabic'}, {label: 'French', value: 'French'}, {label: 'Swahili', value: 'Swahili'}, {label: 'Ukrainian', value: 'Ukrainian'}, {label: 'Russian', value: 'Russian'}, {label: 'Hindi', value: 'Hindi'}, {label: 'Pashto', value: 'Pashto'}, {label: 'Dari', value: 'Dari'}, {label: 'Farsi', value: 'Farsi'}, {label: 'Other', value: 'Other'}]} error={form.formState.errors.preferredLanguage?.message} />} />
            </View>
          )}

          {currentStep === 1 && (
            <View style={styles.fields}>
              <Text style={styles.label}>Refugee Narrative</Text>
              <AudioRecorder 
                preferredLanguage={watchedValues.preferredLanguage || 'English'}
                initialValue={watchedValues.voiceNarrative}
                initialTranslation={watchedValues.translatedNarrative}
                onTranscriptionUpdate={val => setValue('voiceNarrative', val)}
                onTranslationUpdate={val => setValue('translatedNarrative', val)}
              />
            </View>
          )}

          {currentStep === 2 && (
            <View style={styles.fields}>
              <Controller control={control} name="isTravelingAlone" render={({ field: { onChange, value } }) => <Checkbox label="Traveling Alone" description="Check if you are not traveling with family members" checked={value} onChange={onChange} />} />
              
              <Text style={styles.sectionHeader}>Family Members Present</Text>
              {familyFields.map((field, idx) => (
                <View key={field.id} style={styles.row}>
                  <Controller control={control} name={`familyMembers.${idx}.value`} render={({ field: { onChange, value } }) => <Input placeholder="Family member name" style={{ flex: 1 }} onChangeText={onChange} value={value} />} />
                  <Button title="Rem" variant="outline" onPress={() => removeFamily(idx)} style={styles.smBtn} />
                </View>
              ))}
              <Button title="Add Family Member" variant="outline" onPress={() => appendFamily({ value: '' })} />

              <Text style={[styles.sectionHeader, { marginTop: 16 }]}>Missing Relatives</Text>
              {missingFields.map((field, idx) => (
                <View key={field.id} style={styles.row}>
                  <Controller control={control} name={`missingRelatives.${idx}.value`} render={({ field: { onChange, value } }) => <Input placeholder="Missing relative name" style={{ flex: 1 }} onChangeText={onChange} value={value} />} />
                  <Button title="Rem" variant="outline" onPress={() => removeMissing(idx)} style={styles.smBtn} />
                </View>
              ))}
              <Button title="Add Missing Relative" variant="outline" onPress={() => appendMissing({ value: '' })} />
            </View>
          )}

          {currentStep === 3 && (
            <View style={styles.fields}>
              <Text style={styles.sectionHeader}>Urgent Needs</Text>
              {['Medical', 'Food', 'Shelter', 'Legal', 'Protection'].map((need) => (
                <Controller key={need} control={control} name="urgentNeeds" render={({ field: { onChange, value } }) => (
                  <Checkbox label={need} checked={value?.includes(need)} onChange={(checked) => {
                    const next = checked ? [...(value || []), need] : (value || []).filter(n => n !== need);
                    onChange(next);
                  }} />
                )} />
              ))}

              <Controller control={control} name="vulnerabilityMarker" render={({ field: { onChange, value } }) => (
                <Select label="Vulnerability Marker" selectedValue={value} onValueChange={onChange} style={{ marginTop: 16 }} items={[{label: 'Low', value: 'Low'}, {label: 'Medium', value: 'Medium'}, {label: 'High', value: 'High'}]} />
              )} />
            </View>
          )}

          <View style={styles.navRow}>
            <Button title="Previous" variant="outline" onPress={prevStep} disabled={currentStep === 0} style={{ flex: 1, marginRight: 8 }} />
            {currentStep < steps.length - 1 ? (
              <Button title="Next" onPress={nextStep} disabled={!isCurrentStepReady} style={{ flex: 1, marginLeft: 8, opacity: isCurrentStepReady ? 1 : 0.5 }} />
            ) : (
              <Button title="Submit" onPress={handleSubmit(onSubmit)} loading={isSubmitting} style={{ flex: 1, marginLeft: 8 }} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16, backgroundColor: colors.gray50 },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, paddingTop: 10, paddingHorizontal: 20 },
  stepDot: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  stepDotInactive: { backgroundColor: colors.gray200, borderColor: colors.gray200 },
  stepDotActive: { backgroundColor: colors.amber200, borderColor: colors.amber400 },
  stepDotCompleted: { backgroundColor: colors.emerald600, borderColor: colors.emerald200 },
  stepLine: { flex: 1, height: 4, backgroundColor: colors.gray300, marginHorizontal: 4, borderRadius: 2 },
  stepTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center', color: colors.gray900 },
  stepDesc: { fontSize: 14, textAlign: 'center', color: colors.gray500, marginBottom: 24, marginTop: 4 },
  formCard: { backgroundColor: colors.white, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: colors.gray200, elevation: 2 },
  fields: { gap: 16, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', color: colors.gray700 },
  sectionHeader: { fontSize: 15, fontWeight: '600', color: colors.gray900, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  smBtn: { width: 60, height: 48, paddingHorizontal: 0 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: colors.gray100, paddingTop: 16 },
});
