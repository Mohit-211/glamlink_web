import { BaseSectionStyling } from '../fields/typography';

export interface CoinDropContent extends BaseSectionStyling {
  type: 'coin-drop';
  monthlyChallenge?: {
    title: string;
    description: string;
    coinReward: number;
    steps: string[];
    deadline?: string;
    participants?: number;
  };
  waysToEarn: {
    action: string;
    coins: number;
    icon?: string;
    frequency?: string;
  }[];
  featuredRewards: {
    name: string;
    coinCost: number;
    value?: number;
    image?: string;
  }[];
  leaderboard?: {
    name: string;
    coins: number;
    image?: string;
    badge?: string;
  }[];
  specialOffers?: {
    title: string;
    description: string;
    discount: string;
    minCoins: number;
    endsIn?: string;
  }[];
  userBalance?: number;
}