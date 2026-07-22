export interface PlatformStatsOverview {
  shops_total: number;
  shops_active: number;
  shops_inactive: number;
  shops_new_this_week: number;
  shops_new_this_month: number;
  revenue_total: number;
  revenue_cash: number;
  revenue_credit: number;
  sales_count: number;
  average_basket: number;
  total_debt: number;
  stock_value_total: number;
}

export interface MonthlyCount {
  month: string;
  count: number;
}

export interface DailyRevenue {
  date: string;
  total: number;
}

export interface MonthlyRevenue {
  month: string;
  total: number;
}

export interface DailySalesCount {
  date: string;
  count: number;
}

export interface PlatformStatsTrends {
  new_shops_by_month: MonthlyCount[];
  revenue_by_day: DailyRevenue[];
  revenue_by_month: MonthlyRevenue[];
  sales_count_by_day: DailySalesCount[];
}

export interface ShopRevenueRanking {
  shop_id: string;
  shop_name: string;
  revenue: number;
  sales_count: number;
}

export interface ShopSalesCountRanking {
  shop_id: string;
  shop_name: string;
  sales_count: number;
  revenue: number;
}

export interface ShopNeverSold {
  shop_id: string;
  shop_name: string;
  created_at: string;
}

export interface ShopInactive14d {
  shop_id: string;
  shop_name: string;
  last_order_at: string;
}

export interface PlatformStatsRankings {
  top_shops_by_revenue: ShopRevenueRanking[];
  top_shops_by_sales_count: ShopSalesCountRanking[];
  shops_never_sold: ShopNeverSold[];
  shops_inactive_14d: ShopInactive14d[];
}

export interface PlatformStats {
  overview: PlatformStatsOverview;
  trends: PlatformStatsTrends;
  rankings: PlatformStatsRankings;
}
