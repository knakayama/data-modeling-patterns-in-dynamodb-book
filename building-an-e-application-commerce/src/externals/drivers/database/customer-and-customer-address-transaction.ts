import { DynamoDB } from 'aws-sdk'
import { DatabaseDriverUtils } from '@externals/drivers/database/database-driver-utils'
import { Customer } from '@externals/drivers/database/customer'

export class CusAndCusAddrTransactionDriver {
  constructor(
    private readonly _dynamoDBD = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
    })
  ) {}

  async createCustomer(customer: Customer): Promise<void> {
    const transactItems: DynamoDB.DocumentClient.TransactWriteItem[] = [
      {
        Put: {
          ConditionExpression: 'attribute_not_exists(PK)',
          Item: {
            PK: DatabaseDriverUtils.toCustomerPK(customer.userName),
            SK: DatabaseDriverUtils.toCustomerPK(customer.userName),
            UserName: customer.userName,
            EmailAddress: customer.emailAddress,
            Name: customer.name,
            Address: customer.address,
          },
          TableName: process.env.APP_TABLE!,
        },
      },
      {
        Put: {
          ConditionExpression: 'attribute_not_exists(PK)',
          Item: {
            PK: DatabaseDriverUtils.toCustomerEmailPK(customer.emailAddress),
            SK: DatabaseDriverUtils.toCustomerEmailPK(customer.emailAddress),
            UserName: customer.userName,
            EmailAddress: customer.emailAddress,
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
