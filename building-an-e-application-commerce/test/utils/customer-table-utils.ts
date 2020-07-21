import { DynamoDBUtils } from '@test/utils/dynamodb-table-utils'
import { DynamoDB } from 'aws-sdk'
import { Customer } from '@externals/drivers/database/customer'

export class CustomerTableUtils {
  private static toCustomer(v: DynamoDB.DocumentClient.AttributeMap): Customer {
    return {
      userName: v.UserName,
      emailAddress: v.EmailAddress,
      name: v.Name,
      address: v.Address,
    }
  }

  static toWriteRequests<T>(
    items: T[]
  ): DynamoDB.DocumentClient.WriteRequest[] {
    const writeRequests: DynamoDB.DocumentClient.WriteRequest[] = []

    for (const item of items.values()) {
      writeRequests.push({
        PutRequest: {
          Item: item,
        },
      })
    }

    return writeRequests
  }

  dynamoDBD: DynamoDB.DocumentClient

  tableName: string

  constructor(tableName: string) {
    this.tableName = tableName
    this.dynamoDBD = DynamoDBUtils.dynamoDBD
  }

  async batchWriteItems<T>(items: T[]): Promise<void> {
    const bookWriteRequests: DynamoDB.DocumentClient.WriteRequest[] = CustomerTableUtils.toWriteRequests(
      items
    )
    const param: DynamoDB.DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [this.tableName]: bookWriteRequests,
      },
    }
    await this.dynamoDBD.batchWrite(param).promise()
  }

  async createTable(): Promise<void> {
    await DynamoDBUtils.createTable(this.tableName)
  }

  async deleteTable(): Promise<void> {
    await DynamoDBUtils.deleteTable(this.tableName)
  }

  async findCustomerByUserName(userName: string): Promise<Customer> {
    const param: DynamoDB.DocumentClient.GetItemInput = {
      TableName: this.tableName,
      Key: {
        PK: `CUSTOMER#${userName}`,
        SK: `CUSTOMER#${userName}`,
      },
    }
    const response = await this.dynamoDBD.get(param).promise()

    if (!response.Item) {
      throw new Error('Not found')
    }
    return CustomerTableUtils.toCustomer(response.Item)
  }
}
