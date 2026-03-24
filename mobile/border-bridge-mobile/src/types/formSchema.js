import { z } from 'zod';

export const intakeFormSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  nativeScriptNames: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Non-binary', 'Prefer not to say']),
  nationality: z.string().min(1, 'Nationality is required'),
  preferredLanguage: z.string().min(1, 'Preferred Language is required'),
  voiceNarrative: z.string().optional(),
  translatedNarrative: z.string().optional(),
  isTravelingAlone: z.boolean().default(false),
  familyMembers: z.array(z.object({ value: z.string() })).default([]),
  missingRelatives: z.array(z.object({ value: z.string() })).default([]),
  urgentNeeds: z.array(z.enum(['Medical', 'Food', 'Shelter', 'Legal', 'Protection'])).default([]),
  initialScreeningStatus: z.boolean().default(true),
  vulnerabilityMarker: z.enum(['Low', 'Medium', 'High']).default('Low'),
});
