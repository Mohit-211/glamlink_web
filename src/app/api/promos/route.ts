import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import promosListingService from '@/lib/features/promos/server/promosListingService';
import { collection, addDoc, serverTimestamp, getDocs, query, getFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser, getPublicFirebaseApp } from "@/lib/firebase/serverApp";
import { mockPromos } from '@/lib/features/promos/mockData';
import { FEATURE_FLAGS } from "@/lib/config/features";

// Path to the promos config file (fallback)
const PROMOS_CONFIG_PATH = path.join(process.cwd(), 'lib/pages/promos/config/promos.json');

// Auto-seed mock promos when database is empty (server-side with auth)
async function seedMockPromosIfEmpty(db: any, userId?: string) {
  try {
    // Check if auto-seeding is disabled
    if (FEATURE_FLAGS.DISABLE_AUTO_SEEDING) {
      console.log('API: Auto-seeding disabled by feature flag');
      return;
    }

    console.log('API: Checking if database needs seeding...');

    // Check if promos collection is empty
    const promosQuery = query(collection(db, 'promos'));
    const snapshot = await getDocs(promosQuery);

    if (!snapshot.empty) {
      console.log("Checking API for records... found records, displaying them...");
      return;
    }

    console.log('Checking API records... no records found, inserting records now...');

    // Insert mock promos
    for (const mockPromo of mockPromos) {
      const promoData = {
        title: mockPromo.title,
        description: mockPromo.description,
        image: mockPromo.image,
        link: mockPromo.link,
        ctaText: mockPromo.ctaText,
        startDate: mockPromo.startDate,
        endDate: mockPromo.endDate,
        popupDisplay: mockPromo.popupDisplay || mockPromo.title,
        visible: mockPromo.visible !== false,
        featured: mockPromo.featured || false,
        category: mockPromo.category || 'All',
        discount: mockPromo.discount || 0,
        priority: mockPromo.priority || 5,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        metadata: {
          source: 'server-auto-seed',
          seededAt: new Date().toISOString(),
          seededBy: userId || 'anonymous-server'
        }
      };

      const docRef = await addDoc(collection(db, 'promos'), promoData);
      console.log(`API: Seeded promo: ${mockPromo.title} with ID: ${docRef.id}`);
    }

    console.log('records inserted successfully, displaying them...');

  } catch (error) {
    console.error('API: Error seeding mock promos:', error);
  }
}

/**
 * GET /api/promos - Get all visible promos
 */
export async function GET(request: NextRequest) {
  try {
    console.log('API: Fetching promos...');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const stats = searchParams.get('stats') === 'true';

    // Get authenticated Firebase instance
    const { db, currentUser } = await getAuthenticatedAppForUser();

    // For GET, we allow unauthenticated reads (public access)
    // But we need db for Firebase operations
    if (!db) {
      console.log('API: No authenticated db available');

      // Check if file fallback is disabled
      if (FEATURE_FLAGS.DISABLE_FILE_FALLBACK) {
        console.log('API: File fallback disabled, returning mock data');

        // Final fallback to mock data
        let filteredPromos = mockPromos.filter(promo => promo.visible !== false);

        if (category && category !== 'All') {
          filteredPromos = filteredPromos.filter(promo => promo.category === category);
        }

        const featuredPromos = filteredPromos.filter(promo => promo.featured);

        return NextResponse.json({
          success: true,
          data: {
            promos: filteredPromos,
            featuredPromos: featuredPromos
          }
        });
      }

      // Fall back to file system if no auth and not disabled
      try {
        const promosData = await fs.readFile(PROMOS_CONFIG_PATH, 'utf-8');
        const filePromos = JSON.parse(promosData);

        // Filter file promos based on query parameters
        let filteredPromos = filePromos.filter((promo: any) => promo.visible !== false);

        if (category && category !== 'All') {
          filteredPromos = filteredPromos.filter((promo: any) => promo.category === category);
        }

        const featuredPromos = filteredPromos.filter((promo: any) => promo.featured);

        console.log(`API: Returning ${filteredPromos.length} promos from file system`);

        return NextResponse.json({
          success: true,
          data: {
            promos: filteredPromos,
            featuredPromos: featuredPromos
          }
        });
      } catch (error) {
        console.log('API: No file system promos found, returning mock data');

        // Final fallback to mock data
        let filteredPromos = mockPromos.filter(promo => promo.visible !== false);

        if (category && category !== 'All') {
          filteredPromos = filteredPromos.filter(promo => promo.category === category);
        }

        const featuredPromos = filteredPromos.filter(promo => promo.featured);

        return NextResponse.json({
          success: true,
          data: {
            promos: filteredPromos,
            featuredPromos: featuredPromos
          }
        });
      }
    }

    // Seed mock promos if database is empty (only with authenticated db)
    if (currentUser) {
      await seedMockPromosIfEmpty(db, currentUser.uid);
    }

    let promos;
    let featuredPromos = [];
    let statsData = null;

    if (stats) {
      // Return stats instead of promos
      statsData = await promosListingService.getPromoStats();
      console.log('API: Returning promo stats:', statsData);

      return NextResponse.json({
        success: true,
        data: {
          stats: statsData
        }
      });
    } else if (featured) {
      // Return only featured promos
      featuredPromos = await promosListingService.getFeaturedPromos();
      console.log(`API: Returning ${featuredPromos.length} featured promos`);

      return NextResponse.json({
        success: true,
        data: {
          promos: featuredPromos,
          featuredPromos: featuredPromos
        }
      });
    } else if (category) {
      // Return promos by category
      promos = await promosListingService.getPromosByCategory(category);
      console.log(`API: Returning ${promos.length} promos for category ${category}`);

      return NextResponse.json({
        success: true,
        data: {
          promos: promos,
          featuredPromos: []
        }
      });
    } else {
      // First, try to get promos from Firebase
      let allPromos = await promosListingService.getPublicPromos();
      let featured = await promosListingService.getFeaturedPromos();

      // If Firebase is empty, check if we should use fallbacks and migration
      if (allPromos.length === 0 && currentUser) {
        console.log('API: Firebase is empty, checking fallback options...');

        // Check if migration is disabled
        if (FEATURE_FLAGS.DISABLE_MIGRATION) {
          console.log('API: Migration disabled by feature flag, using mock data');
          allPromos = mockPromos.filter(promo => promo.visible !== false);
          featured = allPromos.filter(promo => promo.featured);
        } else {
          // Check if file fallback is disabled
          if (FEATURE_FLAGS.DISABLE_FILE_FALLBACK) {
            console.log('API: File fallback disabled, using mock data');
            allPromos = mockPromos.filter(promo => promo.visible !== false);
            featured = allPromos.filter(promo => promo.featured);
          } else {
            console.log('API: Attempting file system migration...');
            try {
              const promosData = await fs.readFile(PROMOS_CONFIG_PATH, 'utf-8');
              const filePromos = JSON.parse(promosData);

              // If we found file promos, migrate them to Firebase
              if (filePromos.length > 0) {
                console.log(`API: Migrating ${filePromos.length} promos to Firebase...`);

                // Add each promo to Firebase
                for (const promo of filePromos) {
                  const promoData = {
                    title: promo.title,
                    description: promo.description,
                    image: promo.image,
                    link: promo.link,
                    ctaText: promo.ctaText,
                    startDate: promo.startDate,
                    endDate: promo.endDate,
                    popupDisplay: promo.popupDisplay || promo.title,
                    visible: promo.visible !== false,
                    featured: promo.featured || false,
                    category: promo.category || 'All',
                    discount: promo.discount || 0,
                    priority: promo.priority || 5,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                metadata: {
                      source: 'file-system-migration',
                      migratedAt: new Date().toISOString(),
                      userId: currentUser.uid
                    }
                  };

                  try {
                    await addDoc(collection(db, 'promos'), promoData);
                    console.log(`API: Migrated promo: ${promo.title}`);
                  } catch (error) {
                    console.error(`API: Failed to migrate promo ${promo.title}:`, error);
                  }
                }

                // Return the file promos for now
                allPromos = filePromos.filter((promo: any) => promo.visible !== false);
                featured = allPromos.filter((promo: any) => promo.featured);
              } else {
                console.log('API: No file system promos found, using mock data fallback');
                allPromos = mockPromos.filter(promo => promo.visible !== false);
                featured = allPromos.filter(promo => promo.featured);
              }
            } catch (error) {
              console.log('API: No file system promos found, using mock data fallback');
              allPromos = mockPromos.filter(promo => promo.visible !== false);
              featured = allPromos.filter(promo => promo.featured);
            }
          }
        }
      }

      promos = allPromos;
      featuredPromos = featured;

      console.log(`API: Returning ${promos.length} total promos, ${featuredPromos.length} featured`);
    }

    // Return response
    return NextResponse.json({
      success: true,
      data: {
        promos: promos,
        featuredPromos: featuredPromos,
        stats: statsData
      }
    });

  } catch (error) {
    console.error('API: Error fetching promos:', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to fetch promotions. Please try again later.'
    }, { status: 500 });
  }
}

/**
 * POST /api/promos - Create a new promo (authenticated)
 */
export async function POST(request: NextRequest) {
  const timestamp = new Date().toISOString();

  try {
    console.log(`[${timestamp}] API: Creating new promo...`);

    // Get authenticated app for Firestore operations
    const { db, currentUser } = await getAuthenticatedAppForUser();

    if (!currentUser || !db) {
      console.log(`[${timestamp}] ❌ Authentication required`);
      return NextResponse.json({
        success: false,
        error: "Authentication required"
      }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'image', 'link', 'ctaText', 'startDate', 'endDate'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      console.error(`[${timestamp}] Missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    // Prepare promo data for Firestore
    const promoData = {
      title: body.title,
      description: body.description,
      image: body.image,
      link: body.link,
      ctaText: body.ctaText,
      startDate: body.startDate,
      endDate: body.endDate,
      popupDisplay: body.popupDisplay || body.title,
      visible: body.visible !== false,
      featured: body.featured || false,
      category: body.category || 'All',
      discount: body.discount || 0,
      priority: body.priority || 5,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      metadata: {
        userAgent: request.headers.get('user-agent'),
        ip: request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown',
        source: 'authenticated-submission',
        userId: currentUser.uid
      }
    };

    // Store in Firestore with authenticated db
    const promosCollection = collection(db, 'promos');
    const docRef = await addDoc(promosCollection, promoData);

    console.log(`[${timestamp}] ✅ Promo stored successfully with ID: ${docRef.id}`);

    // Return success response
    const response = {
      success: true,
      message: "Promo created successfully!",
      promoId: docRef.id,
      title: body.title
    };

    console.log(`[${timestamp}] ✅ Promo processed successfully:`, response);
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error(`[${timestamp}] ❌ Promo creation error:`, error);

    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json({
      success: false,
      error: "Failed to create promo. Please try again later.",
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    }, { status: 500 });
  }
}