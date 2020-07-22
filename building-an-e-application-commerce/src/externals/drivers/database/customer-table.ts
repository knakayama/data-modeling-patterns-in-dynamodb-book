import { OrderRequest } from '@externals/drivers/database/order-request'
import { DatabaseDriverUtils } from '@externals/drivers/database/database-driver-utils'
import { DynamoDB } from 'aws-sdk'
import { IOrder } from '@externals/drivers/database/customer-interfaces'
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import ksuid = require('ksuid')
import * as dayjs from 'dayjs'
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
    }
  }
  async placeOrder(orderRequest: OrderRequest): Promise<void> {
    const date = dayjs()
    const orderId = ksuid.randomSync().string
    const param: DynamoDB.DocumentClient.PutItemInput = {
      ConditionExpression:
        'attribute_not_exists(#PK) AND attribute_not_exists(#SK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
        '#SK': 'SK',
      },
      Item: {
        PK: DatabaseDriverUtils.toCustomerPK(orderRequest.customerName),
        SK: DatabaseDriverUtils.toOrderSK(orderId),
        OrderId: orderId,
        CreatedAt: date.toISOString(),
        Amount: orderRequest.amount,
        NumberItems: orderRequest.numberItems,
      },
      TableName: process.env.APP_TABLE!,
    }
    await this._dynamoDBD.put(param).promise()
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
