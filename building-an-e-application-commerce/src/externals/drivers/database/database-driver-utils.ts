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

  static toOrderPK(orderId: string): string {
    return `ORDER#${orderId}`
  }

  static toOrderItemPK(orderId: string, itemId: string): string {
    return `ORDER#${orderId}#ITEM#${itemId}`
  }

  static toItemPK(itemId: string): string {
    return `ITEM#${itemId}`
  }
}
