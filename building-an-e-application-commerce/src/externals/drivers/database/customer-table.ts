import { DatabaseDriverUtils } from '@externals/drivers/database/database-driver-utils'
import { DynamoDB } from 'aws-sdk'
import {
  IOrderResponse,
  OrderItem,
} from '@externals/drivers/database/customer-interfaces'
import { CustomerOrderRequest } from '@modules/validators/customer-order-request'
import { CustomerOrderItemRequest } from '@modules/validators/customer-order-item-request'
import { NotFoundResult } from '@presenters/errors'
import { ErrorCodes } from '@presenters/error-codes'

export class CustomerDatabaseDriver {
  constructor(
    private readonly _dynamoDBD = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
    })
  ) {}

  private static toOrderResponse(
    v: DynamoDB.DocumentClient.AttributeMap
  ): IOrderResponse {
    return {
      orderId: v.OrderId,
      createdAt: v.CreatedAt,
      amount: v.Amount,
      numberItems: v.NumberItems,
      status: v.Status,
    }
  }

  private static toOrderItemResponse(
    v: DynamoDB.DocumentClient.AttributeMap
  ): OrderItem {
    return {
      itemId: v.ItemId,
      description: v.Description,
      price: v.Price,
    }
  }

  async findOrdersByCustomerName(
    customerName: CustomerOrderRequest
  ): Promise<IOrderResponse[]> {
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

    return response.Items.map(CustomerDatabaseDriver.toOrderResponse)
  }

  async findOrderByCustomerName(
    customerOrderItemRequest: CustomerOrderItemRequest
  ): Promise<IOrderResponse> {
    const param: DynamoDB.DocumentClient.GetItemInput = {
      TableName: process.env.APP_TABLE!,
      Key: {
        PK: DatabaseDriverUtils.toCustomerPK(
          customerOrderItemRequest.customerName
        ),
        SK: DatabaseDriverUtils.toOrderSK(customerOrderItemRequest.orderId),
      },
    }
    const response = await this._dynamoDBD.get(param).promise()

    if (!response.Item) {
      throw new NotFoundResult(
        ErrorCodes.NotFound,
        `${customerOrderItemRequest.customerName} did not place an order ${customerOrderItemRequest.orderId}}.`
      )
    }
    return CustomerDatabaseDriver.toOrderResponse(response.Item)
  }

  async findOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const param: DynamoDB.DocumentClient.QueryInput = {
      TableName: process.env.APP_TABLE!,
      IndexName: process.env.GSI1!,
      KeyConditionExpression:
        '#GSI1PK = :GSI1PK AND begins_with(#GSI1SK, :GSI1SK)',
      ExpressionAttributeNames: {
        '#GSI1PK': 'GSI1PK',
        '#GSI1SK': 'GSI1SK',
      },
      ExpressionAttributeValues: {
        ':GSI1PK': DatabaseDriverUtils.toOrderPK(orderId),
        ':GSI1SK': DatabaseDriverUtils.toItemPK(''),
      },
    }
    const response = await this._dynamoDBD.query(param).promise()

    if (!response.Items) {
      return []
    }

    return response.Items.map(CustomerDatabaseDriver.toOrderItemResponse)
  }
}
