export class DatabaseDriverUtils {
  static toCustomerPK(customerName: string): string {
    return `CUSTOMER#${customerName}`
  }

  static toCustomerEmailPK(customerEmail: string): string {
    return `CUSTOMEREMAIL#${customerEmail}`
  }

  static toOrderSK(orderId: string): string {
    return `#ORDER#${orderId}`
  }
}
