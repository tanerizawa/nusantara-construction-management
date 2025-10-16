import { Package, DollarSign, Building2, TrendingUp, Users, FileText } from 'lucide-react';

export const ACCOUNT_TYPES = {
  ASSET: 'ASSET',
  LIABILITY: 'LIABILITY',
  EQUITY: 'EQUITY',
  REVENUE: 'REVENUE',
  EXPENSE: 'EXPENSE'
};

export const ACCOUNT_TYPE_LABELS = {
  [ACCOUNT_TYPES.ASSET]: 'Asset',
  [ACCOUNT_TYPES.LIABILITY]: 'Kewajiban',
  [ACCOUNT_TYPES.EQUITY]: 'Ekuitas',
  [ACCOUNT_TYPES.REVENUE]: 'Pendapatan',
  [ACCOUNT_TYPES.EXPENSE]: 'Beban'
};

export const getAccountTypeIcon = (type) => {
  const icons = {
    [ACCOUNT_TYPES.ASSET]: <Package style={{ color: "#32D74B" }} size={16} />,
    [ACCOUNT_TYPES.LIABILITY]: <DollarSign style={{ color: "#FF453A" }} size={16} />,
    [ACCOUNT_TYPES.EQUITY]: <Building2 style={{ color: "#0A84FF" }} size={16} />,
    [ACCOUNT_TYPES.REVENUE]: <TrendingUp style={{ color: "#BF5AF2" }} size={16} />,
    [ACCOUNT_TYPES.EXPENSE]: <Users style={{ color: "#FF9F0A" }} size={16} />
  };
  return icons[type] || <FileText size={16} />;
};

export const getAccountTypeColor = (type) => {
  const colors = {
    [ACCOUNT_TYPES.ASSET]: { bg: 'rgba(50, 215, 75, 0.15)', color: '#32D74B' },
    [ACCOUNT_TYPES.LIABILITY]: { bg: 'rgba(255, 69, 58, 0.15)', color: '#FF453A' },
    [ACCOUNT_TYPES.EQUITY]: { bg: 'rgba(10, 132, 255, 0.15)', color: '#0A84FF' },
    [ACCOUNT_TYPES.REVENUE]: { bg: 'rgba(191, 90, 242, 0.15)', color: '#BF5AF2' },
    [ACCOUNT_TYPES.EXPENSE]: { bg: 'rgba(255, 159, 10, 0.15)', color: '#FF9F0A' }
  };
  return colors[type] || { bg: 'rgba(152, 152, 157, 0.15)', color: '#98989D' };
};

export const ACCOUNT_TYPE_OPTIONS = [
  { value: '', label: 'Semua Tipe' },
  { value: ACCOUNT_TYPES.ASSET, label: ACCOUNT_TYPE_LABELS.ASSET },
  { value: ACCOUNT_TYPES.LIABILITY, label: ACCOUNT_TYPE_LABELS.LIABILITY },
  { value: ACCOUNT_TYPES.EQUITY, label: ACCOUNT_TYPE_LABELS.EQUITY },
  { value: ACCOUNT_TYPES.REVENUE, label: ACCOUNT_TYPE_LABELS.REVENUE },
  { value: ACCOUNT_TYPES.EXPENSE, label: ACCOUNT_TYPE_LABELS.EXPENSE }
];

export const NORMAL_BALANCE_OPTIONS = [
  { value: 'DEBIT', label: 'Debit' },
  { value: 'CREDIT', label: 'Credit' }
];

export const ACCOUNT_LEVEL_OPTIONS = [
  { value: 1, label: '1 - Main Group' },
  { value: 2, label: '2 - Sub Group' },
  { value: 3, label: '3 - Detail Account' },
  { value: 4, label: '4 - Sub Detail' }
];