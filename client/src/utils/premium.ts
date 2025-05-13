import { checkPremium as checkPremiumAPI } from '@/service/premium';

export type PremiumStatus = 'active' | 'cancelled' | 'expired' | 'none';

export interface PremiumCheckResult {
  isPremium: boolean;
  status: PremiumStatus;
  endDate?: string;
  message?: string;
}

/**
 * Kiểm tra trạng thái premium của người dùng
 * @param accessToken - Access token của người dùng
 * @returns Promise<PremiumCheckResult>
 */
export async function checkPremium(accessToken: string): Promise<PremiumCheckResult> {
  try {
    const response = await checkPremiumAPI(accessToken);
    if (!response.data) {
      throw new Error('Không có dữ liệu trả về');
    }
    
    const { premiumStatus, endDate, message } = response.data;
    
    // Nếu API trả về null hoặc undefined cho premiumStatus, coi như 'none'
    if (!premiumStatus) {
      return {
        isPremium: false,
        status: 'none',
        message: ''  // Không hiển thị thông báo gì
      };
    }
    
    // Xử lý các trạng thái cụ thể
    switch (premiumStatus) {
      case 'active':
        return {
          isPremium: true,
          status: 'active',
          endDate,
          message: message || 'Gói Premium đang hoạt động'
        };
      case 'cancelled':
        return {
          isPremium: true, // Vẫn giữ quyền Premium cho đến khi hết hạn
          status: 'cancelled',
          endDate,
          message: message || 'Gói Premium sẽ hết hạn vào ' + new Date(endDate || '').toLocaleDateString('vi-VN')
        };
      case 'expired':
        return {
          isPremium: false, // Chỉ set false khi đã hết hạn
          status: 'expired',
          message: message || 'Gói Premium đã hết hạn'
        };
      case 'none':
        return {
          isPremium: false,
          status: 'none',
          message: ''  // Không hiển thị thông báo gì
        };
      default:
        return {
          isPremium: false,
          status: 'none',
          message: ''  // Không hiển thị thông báo gì
        };
    }
  } catch (error) {
    console.error('Lỗi khi kiểm tra trạng thái Premium:', error);
    return {
      isPremium: false,
      status: 'none',
      message: ''  // Không hiển thị thông báo lỗi
    };
  }
} 