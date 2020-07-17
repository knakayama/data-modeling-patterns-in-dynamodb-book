import { DynamoDBUtils } from '@test/utils/dynamodb-table-utils'
import { Session } from '@externals/drivers/database/session-interfaces'
import { DynamoDB } from 'aws-sdk'
import { Chance } from 'chance'
import { v4 as uuidv4 } from 'uuid'

const chance = new Chance.Chance()

export class SessionTableUtils {
  private static toSession(v: DynamoDB.DocumentClient.AttributeMap): Session {
    return {
      userName: v.UserName,
      createdAt: v.CreatedAt,
      expiresAt: v.ExpiresAt,
      sessionToken: v.SessionToken,
      tTL: v.TTL,
    }
  }

  static generateSession(): Session {
    return {
      createdAt: chance.date().toISOString(),
      expiresAt: chance.date().toISOString(),
      sessionToken: uuidv4(),
      tTL: chance.second(),
      userName: chance.string({ pool: 'abc123-' }),
    }
  }

  static generateSessions(itemCount = 1): Session[] {
    const sessions: Session[] = []
    for (let i: number = itemCount; i > 0; i -= 1) {
      sessions.push(SessionTableUtils.generateSession())
    }
    return sessions
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
    const bookWriteRequests: DynamoDB.DocumentClient.WriteRequest[] = SessionTableUtils.toWriteRequests(
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

  async findSessions(): Promise<Session[]> {
    const param: DynamoDB.DocumentClient.ScanInput = {
      TableName: this.tableName,
    }
    const response = await this.dynamoDBD.scan(param).promise()

    if (!response.Items) {
      return []
    }
    return response.Items.map(SessionTableUtils.toSession)
  }
}
