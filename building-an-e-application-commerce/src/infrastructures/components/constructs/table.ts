import { Construct } from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class Table extends Construct {
  readonly table: dynamodb.Table

  constructor(readonly scope: Construct, readonly id: string) {
    super(scope, id)

    this.table = new dynamodb.Table(this, 'Table', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'SK',
        type: dynamodb.AttributeType.STRING,
      },
      timeToLiveAttribute: 'TTL',
    })

    this.table.addGlobalSecondaryIndex({
      indexName: 'GSI1',
      partitionKey: {
        name: 'GSI1PK',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'GSI1SK',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    })
  }
}
