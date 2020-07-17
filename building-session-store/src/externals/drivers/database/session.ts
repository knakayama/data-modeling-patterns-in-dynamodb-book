import { Session } from '@externals/drivers/database/session-interfaces'
import { ValidatorUtils } from '@modules/utils/validator'
import { DynamoDB } from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import * as dayjs from 'dayjs'
import { NotFoundResult } from '@presenters/errors'
import { ErrorCodes } from '@presenters/error-codes'

export class SessionDatabaseDriver {
  constructor(
    private readonly _dynamoDBD = new DynamoDB.DocumentClient({
      apiVersion: '2012-08-10',
    })
  ) {}

  private static toSession(v: DynamoDB.DocumentClient.AttributeMap): Session {
    return {
      userName: v.UserName,
      createdAt: v.CreatedAt,
      expiresAt: v.ExpiresAt,
      sessionToken: v.SessionToken,
      tTL: v.TTL,
    }
  }

  async createSessionToken(userName: string): Promise<void> {
    const date = dayjs()
    const param: DynamoDB.DocumentClient.PutItemInput = {
      ConditionExpression: 'attribute_not_exists(#SESSION)',
      ExpressionAttributeNames: {
        '#SESSION': 'Session',
      },
      Item: {
        SessionToken: uuidv4(),
        UserName: userName,
        CreatedAt: date.toISOString(),
        ExpiresAt: date.add(7, 'day').toISOString(),
        TTL: date.unix(),
      },
      TableName: process.env.SESSION_TABLE!,
    }
    await this._dynamoDBD.put(param).promise()
  }

  async findSessionBySessionToken(sessionToken: string): Promise<Session> {
    const date = dayjs()
    const param: DynamoDB.DocumentClient.QueryInput = {
      KeyConditionExpression: '#SessionToken = :SessionToken',
      FilterExpression: '#TTL <= :Epoch',
      ExpressionAttributeNames: {
        '#SessionToken': 'SessionToken',
        '#TTL': 'TTL',
      },
      ExpressionAttributeValues: {
        ':SessionToken': sessionToken,
        ':Epoch': date.unix(),
      },
      TableName: process.env.SESSION_TABLE!,
    }

    const response = await this._dynamoDBD.query(param).promise()

    if (!response.Items) {
      return {} as Session
    }

    return response.Items.map(SessionDatabaseDriver.toSession)[0]
  }

  async deleteSessionTokensByUserName(userName: string): Promise<void> {
    const param: DynamoDB.DocumentClient.QueryInput = {
      KeyConditionExpression: '#UserName = :UserName',
      IndexName: process.env.USER_NAME,
      ExpressionAttributeNames: {
        '#UserName': 'UserName',
      },
      ExpressionAttributeValues: {
        ':UserName': userName,
      },
      TableName: process.env.SESSION_TABLE!,
    }

    const response = await this._dynamoDBD.query(param).promise()

    if (!response.Items || ValidatorUtils.isEmptyArray(response.Items)) {
      throw new NotFoundResult(
        ErrorCodes.NotFound,
        `User ${userName} does not have any session tokens.`
      )
    }
    console.log(`response.Items: ${JSON.stringify(response.Items)}`)
    this.deleteSessionTokens(response.Items.map((item) => item.SessionToken))
  }

  async deleteSessionTokens(sessionTokens: string[]): Promise<void> {
    console.log(`sessionTokens: ${JSON.stringify(sessionTokens)}`)
    const writeRequests: DynamoDB.DocumentClient.WriteRequest[] = sessionTokens.flatMap(
      (sessionToken) => ({
        DeleteRequest: {
          Key: {
            SessionToken: sessionToken,
          },
        },
      })
    )

    const param: DynamoDB.DocumentClient.BatchWriteItemInput = {
      RequestItems: {
        [process.env.SESSION_TABLE!]: writeRequests,
      },
    }
    await this._dynamoDBD.batchWrite(param).promise()
  }
}
