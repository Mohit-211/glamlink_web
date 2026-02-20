/**
 * Profile Preferences API
 * GET and PATCH endpoints for user preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_PREFERENCES } from '@/lib/features/profile-settings/preferences/config';
import type { UserPreferences } from '@/lib/features/profile-settings/preferences/types';

/**
 * GET /api/profile/preferences
 * Returns user's preferences, creates defaults if none exist
 */
export async function GET(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prefsRef = doc(db, `users/${currentUser.uid}/settings/preferences`);
    const prefsDoc = await getDoc(prefsRef);

    if (!prefsDoc.exists()) {
      // Create default preferences
      const defaults = {
        ...DEFAULT_PREFERENCES,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(prefsRef, defaults);

      return NextResponse.json({
        preferences: DEFAULT_PREFERENCES
      });
    }

    const data = prefsDoc.data();
    return NextResponse.json({
      preferences: {
        theme: data.theme,
        reducedMotion: data.reducedMotion,
        language: data.language,
        timezone: data.timezone,
        currency: data.currency,
        dateFormat: data.dateFormat,
        timeFormat: data.timeFormat,
        measurementUnit: data.measurementUnit
      } as UserPreferences
    });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/profile/preferences
 * Updates specific preference fields
 * Body: Partial<UserPreferences>
 */
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates: Partial<UserPreferences> = await request.json();

    // Validate keys
    const validKeys: (keyof UserPreferences)[] = [
      'theme', 'reducedMotion', 'language', 'timezone',
      'currency', 'dateFormat', 'timeFormat', 'measurementUnit'
    ];

    const invalidKeys = Object.keys(updates).filter(
      key => !validKeys.includes(key as keyof UserPreferences)
    );

    if (invalidKeys.length > 0) {
      return NextResponse.json(
        { error: `Invalid fields: ${invalidKeys.join(', ')}` },
        { status: 400 }
      );
    }

    const prefsRef = doc(db, `users/${currentUser.uid}/settings/preferences`);

    // Check if preferences document exists
    const prefsDoc = await getDoc(prefsRef);

    if (!prefsDoc.exists()) {
      // Create new preferences document with updates
      const newPrefs = {
        ...DEFAULT_PREFERENCES,
        ...updates,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(prefsRef, newPrefs);

      return NextResponse.json({
        success: true,
        preferences: {
          theme: newPrefs.theme,
          reducedMotion: newPrefs.reducedMotion,
          language: newPrefs.language,
          timezone: newPrefs.timezone,
          currency: newPrefs.currency,
          dateFormat: newPrefs.dateFormat,
          timeFormat: newPrefs.timeFormat,
          measurementUnit: newPrefs.measurementUnit
        } as UserPreferences
      });
    }

    // Update existing preferences
    await updateDoc(prefsRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });

    const updatedDoc = await getDoc(prefsRef);
    const data = updatedDoc.data();

    if (!data) {
      throw new Error('Failed to retrieve updated preferences');
    }

    return NextResponse.json({
      success: true,
      preferences: {
        theme: data.theme,
        reducedMotion: data.reducedMotion,
        language: data.language,
        timezone: data.timezone,
        currency: data.currency,
        dateFormat: data.dateFormat,
        timeFormat: data.timeFormat,
        measurementUnit: data.measurementUnit
      } as UserPreferences
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}
