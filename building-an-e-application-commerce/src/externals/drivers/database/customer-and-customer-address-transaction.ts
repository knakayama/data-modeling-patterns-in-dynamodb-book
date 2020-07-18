import { UserRequest } from '@externals/drivers/database/customer-interfaces'
import { DynamoDB } from 'aws-sdk'
import { DatabaseDriverUtils } from '@externals/drivers/database/database-driver-utils'

export class CusAndCusAddrTransactionDriver {
  constructor(
    private readonly _dynamoDBD = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
    })
  ) {}

  async createCustomer(user: UserRequest): Promise<void> {
    const transactItems: DynamoDB.DocumentClient.TransactWriteItem[] = [
      {
        Put: {
          ConditionExpression: 'attribute_not_exists(PK)',
          Item: {
            PK: DatabaseDriverUtils.toCustomerPK(user.userName),
            SK: DatabaseDriverUtils.toCustomerPK(user.userName),
            UserName: user.userName,
            EmailAddress: user.emailAddress,
            Name: user.name,
          },
          TableName: process.env.APP_TABLE!,
        },
      },
      {
        Put: {
          ConditionExpression: 'attribute_not_exists(PK)',
          Item: {
            PK: DatabaseDriverUtils.toCustomerEmailPK(user.emailAddress),
            SK: DatabaseDriverUtils.toCustomerEmailPK(user.emailAddress),
            UserName: user.userName,
            EmailAddress: user.emailAddress,
          },
          TableName: process.env.APP_TABLE!,
        },
      },
    ]
    const param: DynamoDB.DocumentClient.TransactWriteItemsInput = {
      TransactItems: transactItems,
    }
    await this._dynamoDBD.transactWrite(param).promise()
  }
}
