import { OrderRequest } from '@externals/drivers/database/order-request'
import { DatabaseDriverUtils } from '@externals/drivers/database/database-driver-utils'
import { DynamoDB } from 'aws-sdk'
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import ksuid = require('ksuid')
import * as dayjs from 'dayjs'

export class CustomerDatabaseDriver {
  constructor(
    private readonly _dynamoDBD = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
    })
  ) {}

  async placeOrder(orderRequest: OrderRequest): Promise<void> {
    const date = dayjs()
    const orderId = ksuid.randomSync().string
    const param: DynamoDB.DocumentClient.PutItemInput = {
      ConditionExpression: 'attribute_not_exists(#PK)',
      ExpressionAttributeNames: {
        '#PK': 'PK',
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
}
