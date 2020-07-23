import { DatabaseDriverUtils } from '@externals/drivers/database/database-driver-utils'
import { DynamoDB } from 'aws-sdk'
import { IOrder, Item } from '@externals/drivers/database/customer-interfaces'
import { CustomerName } from '@modules/validators/customer-name'

export class CustomerDatabaseDriver {
  constructor(
    private readonly _dynamoDBD = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
    })
  ) {}

  private static toOrder(v: DynamoDB.DocumentClient.AttributeMap): IOrder {
    return {
      orderId: v.OrderId,
      createdAt: v.CreatedAt,
      amount: v.Amount,
      numberItems: v.NumberItems,
      status: v.Status,
      items: v.map((item: Item) => ({
        itemId: item.itemId,
        description: item.description,
        price: item.price,
      })),
    }
  }

  async findOrdersByCustomerName(
    customerName: CustomerName
  ): Promise<IOrder[]> {
    const param: DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.APP_TABLE!,
      KeyConditionExpression: '#PK = :PK AND begins_with(#SK, :SK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      ExpressionAttributeValues: {
        ':PK': DatabaseDriverUtils.toCustomerPK(customerName.customerName),
        ':SK': DatabaseDriverUtils.toOrderSK(''),
      },
      ScanIndexForward: false,
      Limit: 11,
    }
    const response = await this._dynamoDBD.query(param).promise()

    if (!response.Items) {
      return []
    }

    return response.Items.map(CustomerDatabaseDriver.toOrder)
  }
}
