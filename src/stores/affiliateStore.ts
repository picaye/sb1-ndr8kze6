import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AffiliateStats {
  clicks: number;
  conversions: number;
}

export interface Affiliate {
  id: string;
  name: string;
  website: string;
  logo: string;
  commission: number;
  description: string;
  features: string[];
  minInvestment: number;
  maxInvestment: number;
  trackingCode: string;
  stats: AffiliateStats;
}

interface AffiliateState {
  affiliates: Affiliate[];
  addAffiliate: (affiliate: Affiliate) => void;
  updateAffiliate: (id: string, data: Partial<Affiliate>) => void;
  removeAffiliate: (id: string) => void;
  incrementClicks: (id: string) => void;
  incrementConversions: (id: string) => void;
}

export const useAffiliateStore = create<AffiliateState>()(
  persist(
    (set) => ({
      affiliates: [], // Remove all third party services
      addAffiliate: (affiliate) =>
        set((state) => ({
          affiliates: [...state.affiliates, affiliate]
        })),
      updateAffiliate: (id, data) =>
        set((state) => ({
          affiliates: state.affiliates.map((affiliate) =>
            affiliate.id === id ? { ...affiliate, ...data } : affiliate
          )
        })),
      removeAffiliate: (id) =>
        set((state) => ({
          affiliates: state.affiliates.filter((affiliate) => affiliate.id !== id)
        })),
      incrementClicks: (id) =>
        set((state) => ({
          affiliates: state.affiliates.map((affiliate) =>
            affiliate.id === id
              ? {
                  ...affiliate,
                  stats: {
                    ...affiliate.stats,
                    clicks: affiliate.stats.clicks + 1
                  }
                }
              : affiliate
          )
        })),
      incrementConversions: (id) =>
        set((state) => ({
          affiliates: state.affiliates.map((affiliate) =>
            affiliate.id === id
              ? {
                  ...affiliate,
                  stats: {
                    ...affiliate.stats,
                    conversions: affiliate.stats.conversions + 1
                  }
                }
              : affiliate
          )
        }))
    }),
    {
      name: 'affiliate-storage'
    }
  )
);