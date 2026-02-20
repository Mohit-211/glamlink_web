import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db as clientDb } from '@/lib/config/firebase';
import { DEFAULT_FAQS } from '@/lib/features/support-bot/config';
import type { FAQ } from '@/lib/features/support-bot/types';

// GET - Fetch FAQs
export async function GET(request: NextRequest) {
  try {
    if (!clientDb) {
      // Return default FAQs if database unavailable
      return NextResponse.json({
        success: true,
        faqs: DEFAULT_FAQS.map((f, i) => ({ ...f, id: `default-${i}` })),
        source: 'default',
      });
    }

    // Try to fetch from Firestore
    try {
      const faqsCollection = collection(clientDb, 'support_faqs');
      const q = query(
        faqsCollection,
        where('isActive', '==', true),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const faqs: FAQ[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as FAQ[];

        return NextResponse.json({
          success: true,
          faqs,
          source: 'firestore',
        });
      }
    } catch (firestoreError) {
      console.log('FAQs collection not found, using defaults');
    }

    // Return default FAQs if collection doesn't exist or is empty
    return NextResponse.json({
      success: true,
      faqs: DEFAULT_FAQS.map((f, i) => ({ ...f, id: `default-${i}` })),
      source: 'default',
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    // Return defaults on error
    return NextResponse.json({
      success: true,
      faqs: DEFAULT_FAQS.map((f, i) => ({ ...f, id: `default-${i}` })),
      source: 'default',
    });
  }
}
