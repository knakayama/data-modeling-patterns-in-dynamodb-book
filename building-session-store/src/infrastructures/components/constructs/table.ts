import { Construct } from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class Table extends Construct {
  readonly table: dynamodb.Table

  constructor(readonly scope: Construct, readonly id: string) {
    super(scope, id)

    this.table = new dynamodb.Table(this, 'Table', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'SessionToken',
        type: dynamodb.AttributeType.STRING,
      },
      timeToLiveAttribute: 'TTL',
    })

    this.table.addGlobalSecondaryIndex({
      indexName: 'UserName',
      partitionKey: {
        name: 'UserName',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.KEYS_ONLY,
    })
  }
}
