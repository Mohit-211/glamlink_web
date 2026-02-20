import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  userType: 'client' | 'professional';
  brandId?: string; // Associated brand for brand owners
  createdAt: Date;
  updatedAt: Date;
  phoneNumber?: string;
  newsletterSubscribed?: boolean;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  preferences?: {
    skinType?: string;
    concerns?: string[];
    favoriteServices?: string[];
  };
}

class AuthService {
  constructor() {
    // AuthService initialized
  }
  
  private checkAuth() {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized. Check your environment variables.');
    }
  }

  async signUp(email: string, password: string, displayName: string, userType: 'client' | 'professional', newsletterSubscribed: boolean = false) {
    try {
      this.checkAuth();
      const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      // Create brand for non-super-admin users
      let brandId: string | undefined;
      if (email !== 'admin@glamlink.com') {
        brandId = `brand_${user.uid}`;
        
        // Create the brand document
        if (!db) throw new Error('Database not initialized');
        await setDoc(doc(db, 'brands', brandId), {
          id: brandId,
          name: displayName || "My Brand",
          tagline: "Welcome to my brand",
          mission: "",
          description: "",
          profileImage: "/default-brand-image.jpg",
          isFollowing: false,
          followerCount: 0,
          productCount: 0,
          certifiedProviderCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName,
        userType: userType,
        brandId,
        newsletterSubscribed,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (!db) throw new Error('Database not initialized');
      await setDoc(doc(db, 'users', user.uid), userProfile);

      if (userType === 'professional') {
        if (!db) throw new Error('Database not initialized');
        await setDoc(doc(db, 'professionals', user.uid), {
          userId: user.uid,
          services: [],
          portfolio: [],
          rating: 0,
          reviewCount: 0,
          availability: {},
          verified: false,
          createdAt: new Date()
        });
      }

      return { user, userProfile };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account');
    }
  }

  async signIn(email: string, password: string) {
    try {
      this.checkAuth();
      const userCredential = await signInWithEmailAndPassword(auth!, email, password);
      const userProfile = await this.getUserProfile(userCredential.user.uid);
      return { user: userCredential.user, userProfile };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  async signInWithGoogle() {
    try {
      this.checkAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth!, provider);
      
      let userProfile = await this.getUserProfile(result.user.uid);
      
      if (!userProfile) {
        // Create brand for non-super-admin users
        let brandId: string | undefined;
        if (result.user.email !== 'admin@glamlink.com') {
          brandId = `brand_${result.user.uid}`;
          
          // Create the brand document
          if (!db) throw new Error('Database not initialized');
          await setDoc(doc(db, 'brands', brandId), {
            id: brandId,
            name: result.user.displayName || "My Brand",
            tagline: "Welcome to my brand",
            mission: "",
            description: "",
            profileImage: "/default-brand-image.jpg",
            isFollowing: false,
            followerCount: 0,
            productCount: 0,
            certifiedProviderCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
        
        userProfile = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName!,
          photoURL: result.user.photoURL || undefined,
          userType: 'client',
          brandId,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        if (!db) throw new Error('Database not initialized');
        await setDoc(doc(db, 'users', result.user.uid), userProfile);
      }
      
      return { user: result.user, userProfile };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in with Google');
    }
  }

  async signOutUser() {
    try {
      this.checkAuth();
      await signOut(auth!);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  async resetPassword(email: string) {
    try {
      this.checkAuth();
      await sendPasswordResetEmail(auth!, email);
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset email');
    }
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      if (!db) return null;
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as UserProfile;
      }
      return null;
    } catch (error) {
      // Error fetching user profile
      return null;
    }
  }

  async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
    try {
      if (!db) throw new Error('Database not initialized');
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { ...updates, updatedAt: new Date() }, { merge: true });
      
      if (updates.displayName || updates.photoURL) {
        const user = auth?.currentUser;
        if (user) {
          await updateProfile(user, {
            displayName: updates.displayName || user.displayName,
            photoURL: updates.photoURL || user.photoURL
          });
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  onAuthStateChange(callback: (user: User | null, userProfile: UserProfile | null) => void) {
    if (!auth) {
      // Auth not initialized
      return () => {};
    }
    return onAuthStateChanged(auth, async (user) => {
      // Firebase onAuthStateChanged triggered
      
      if (user) {
        try {
          const userProfile = await this.getUserProfile(user.uid);
          // getUserProfile completed
          callback(user, userProfile);
        } catch (error) {
          // getUserProfile error
          callback(user, null);
        }
      } else {
        callback(null, null);
      }
    });
  }

  getCurrentUser() {
    const user = auth?.currentUser;
    // Getting current user
    return user;
  }
}

export default new AuthService();