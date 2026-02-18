// Temporary stub components to fix type errors
// These should be replaced with actual implementations

import React from 'react';
import { TrackingParams, EmailTheme } from '../types';

interface StubProps {
  section: any;
  tracking: TrackingParams;
  theme?: EmailTheme;
}

// Editorial components
export const QuoteSection: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const AuthorSignature: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const ProductRecommendations: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const TipsList: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const SocialCTA: React.FC<StubProps> = ({ section }) => React.createElement('div');

// Commerce components
export const ProductShowcase: React.FC<StubProps> = ({ section }) => React.createElement('div');

// Engagement components
export const RewardProgress: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const MonthlyChallenge: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const Leaderboard: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const SpecialOffers: React.FC<StubProps> = ({ section }) => React.createElement('div');

// Content components
export const FeaturedStories: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const StoryGrid: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const EventsList: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const PhotoGallery: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const CTAWithStats: React.FC<StubProps> = ({ section }) => React.createElement('div');

// Modern components
export const CircleImageGrid: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const DarkCTAModal: React.FC<StubProps> = ({ section }) => React.createElement('div');
export const InteractiveContentCards: React.FC<StubProps> = ({ section }) => React.createElement('div');