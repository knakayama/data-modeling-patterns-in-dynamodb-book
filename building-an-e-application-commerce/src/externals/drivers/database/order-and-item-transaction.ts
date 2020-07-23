import { DynamoDB } from 'aws-sdk'
import { DatabaseDriverUtils } from '@externals/drivers/database/database-driver-utils'
import { OrderRequest } from '@modules/validators/order-request'
// https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
import ksuid = require('ksuid')
import * as dayjs from 'dayjs'

export class OrderAndItemTransactionDriver {
  constructor(
    private readonly _dynamoDBD = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
    })
  ) {}

  async placeOrder(orderRequest: OrderRequest): Promise<void> {
    const date = dayjs()
    const orderId = ksuid.randomSync().string
    const transactItems: DynamoDB.DocumentClient.TransactWriteItem[] = [
      {
        Put: {
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
            GSI1PK: DatabaseDriverUtils.toOrderPK(orderId),
            GSI1SK: DatabaseDriverUtils.toOrderPK(orderId),
          },
          TableName: process.env.APP_TABLE!,
        },
      },
    ]
    orderRequest.orderItems.forEach((item) => {
      transactItems.push({
        Put: {
          ConditionExpression:
            'attribute_not_exists(#PK) AND attribute_not_exists(#SK)',
          ExpressionAttributeNames: {
            '#PK': 'PK',
            '#SK': 'SK',
          },
          Item: {
            PK: DatabaseDriverUtils.toOrderItemPK(orderId, item.itemId),
            SK: DatabaseDriverUtils.toOrderItemPK(orderId, item.itemId),
            OrderId: orderId,
            ItemId: item.itemId,
            Description: item.description,
            Price: item.price,
            GSI1PK: DatabaseDriverUtils.toOrderPK(orderId),
            GSI1SK: DatabaseDriverUtils.toItemPK(item.itemId),
          },
          TableName: process.env.APP_TABLE!,
        },
      })
    })
    const param: DynamoDB.DocumentClient.TransactWriteItemsInput = {
      TransactItems: transactItems,
    }
    await this._dynamoDBD.transactWrite(param).promise()
  }
}
