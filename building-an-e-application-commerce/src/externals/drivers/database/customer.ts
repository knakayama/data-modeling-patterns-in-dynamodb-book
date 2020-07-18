import { UserRequest } from '@externals/drivers/database/customer-interfaces'
import { DynamoDB } from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import * as dayjs from 'dayjs'

export class CustomerDatabaseDriver {
  constructor(
    private readonly _dynamoDBD = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
    })
  ) {}

  async createCustomer(user: UserRequest): Promise<void> {
    const date = dayjs()
    const param: DynamoDB.DocumentClient.PutItemInput = {
      ConditionExpression: 'attribute_not_exists(#SESSION)',
      ExpressionAttributeNames: {
        '#SESSION': 'Session',
      },
      Item: {
        SessionToken: uuidv4(),
        UserName: user.userName,
        CreatedAt: date.toISOString(),
        ExpiresAt: date.add(7, 'day').toISOString(),
        TTL: date.unix(),
      },
      TableName: process.env.APP_TABLE!,
    }
    await this._dynamoDBD.put(param).promise()
  }
}
