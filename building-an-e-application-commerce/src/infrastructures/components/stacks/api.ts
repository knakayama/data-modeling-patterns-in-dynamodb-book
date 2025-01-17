import { Stack, App, StackProps } from '@aws-cdk/core'
import { ApiConstruct } from '@infrastructures/components/constructs/api'
import * as acm from '@aws-cdk/aws-certificatemanager'
import { Table } from '@infrastructures/components/constructs/table'

interface ApiStackProps extends StackProps {
  appTable: Table
  cert: acm.Certificate
  allowedOrigin: string
  domain: string
  hostedZoneId: string
}

export class ApiStack extends Stack {
  readonly api: ApiConstruct

  constructor(
    readonly scope: App,
    readonly name: string,
    readonly props: ApiStackProps
  ) {
    super(scope, name, props)

    this.api = new ApiConstruct(this, 'Api', {
      stageName: 'v1',
      appTable: props.appTable,
      allowedOrigin: props.allowedOrigin,
      cert: props.cert,
      domain: props.domain,
      hostedZoneId: props.hostedZoneId,
    })
  }
}
