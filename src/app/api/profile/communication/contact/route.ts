import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAppForUser } from '@/lib/firebase/serverApp';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DEFAULT_COMMUNICATION_SETTINGS, CONTACT_METHOD_OPTIONS } from '@/lib/features/profile-settings/communication/config';
import type { ContactMethodConfig, ContactMethod } from '@/lib/features/profile-settings/communication/types';

// POST - Add contact method
export async function POST(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const newMethod: ContactMethodConfig = await request.json();

    // Validate format
    const methodConfig = CONTACT_METHOD_OPTIONS.find(m => m.method === newMethod.method);
    if (!methodConfig) {
      return NextResponse.json({ error: "Invalid contact method" }, { status: 400 });
    }

    if (!methodConfig.validation.test(newMethod.value)) {
      return NextResponse.json({ error: `Invalid ${methodConfig.label} format` }, { status: 400 });
    }

    // Get current methods
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentMethods = brandData?.communicationSettings?.contactMethods || DEFAULT_COMMUNICATION_SETTINGS.contactMethods;

    // Check duplicates
    if (currentMethods.some((m: ContactMethodConfig) => m.method === newMethod.method)) {
      return NextResponse.json({ error: "Contact method already exists" }, { status: 400 });
    }

    // Add method (never primary on creation)
    const updatedMethods = [...currentMethods, { ...newMethod, isPrimary: false }];

    await updateDoc(brandRef, {
      'communicationSettings.contactMethods': updatedMethods,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedMethods });
  } catch (error) {
    console.error('Error adding contact method:', error);
    return NextResponse.json(
      { error: "Failed to add contact method" },
      { status: 500 }
    );
  }
}

// PATCH - Update contact method
export async function PATCH(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const { method, updates } = await request.json();

    // Validate if value changed
    if (updates.value !== undefined) {
      const methodConfig = CONTACT_METHOD_OPTIONS.find(m => m.method === method);
      if (methodConfig && !methodConfig.validation.test(updates.value)) {
        return NextResponse.json({ error: `Invalid ${methodConfig.label} format` }, { status: 400 });
      }
    }

    // Get current methods
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentMethods = brandData?.communicationSettings?.contactMethods || DEFAULT_COMMUNICATION_SETTINGS.contactMethods;

    // Find and update
    const index = currentMethods.findIndex((m: ContactMethodConfig) => m.method === method);
    if (index === -1) {
      return NextResponse.json({ error: "Contact method not found" }, { status: 404 });
    }

    currentMethods[index] = { ...currentMethods[index], ...updates };

    await updateDoc(brandRef, {
      'communicationSettings.contactMethods': currentMethods,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: currentMethods });
  } catch (error) {
    console.error('Error updating contact method:', error);
    return NextResponse.json(
      { error: "Failed to update contact method" },
      { status: 500 }
    );
  }
}

// DELETE - Remove contact method
export async function DELETE(request: NextRequest) {
  try {
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const brandId = `brand_${currentUser.uid}`;
    const { method }: { method: ContactMethod } = await request.json();

    // Cannot remove platform_message
    if (method === 'platform_message') {
      return NextResponse.json(
        { error: "Platform messages cannot be removed" },
        { status: 400 }
      );
    }

    // Get current methods
    const brandRef = doc(db, 'brands', brandId);
    const brandSnap = await getDoc(brandRef);

    if (!brandSnap.exists()) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const brandData = brandSnap.data();
    const currentMethods: ContactMethodConfig[] = brandData?.communicationSettings?.contactMethods || DEFAULT_COMMUNICATION_SETTINGS.contactMethods;

    const methodToRemove = currentMethods.find(m => m.method === method);
    if (!methodToRemove) {
      return NextResponse.json({ error: "Contact method not found" }, { status: 404 });
    }

    // Remove method
    let updatedMethods = currentMethods.filter(m => m.method !== method);

    // If removing primary, assign to platform_message
    if (methodToRemove.isPrimary && updatedMethods.length > 0) {
      const platformMsg = updatedMethods.find(m => m.method === 'platform_message');
      if (platformMsg) {
        platformMsg.isPrimary = true;
      } else {
        updatedMethods[0].isPrimary = true;  // Fallback
      }
    }

    await updateDoc(brandRef, {
      'communicationSettings.contactMethods': updatedMethods,
      'updatedAt': new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: updatedMethods });
  } catch (error) {
    console.error('Error removing contact method:', error);
    return NextResponse.json(
      { error: "Failed to remove contact method" },
      { status: 500 }
    );
  }
}
