Building Session Store
======================

- An example table
  - https://docs.google.com/spreadsheets/d/1VX0O-4GmMz5Gv47kp3TS7UMjv-NCw481AtqPSLNkjh0/edit#gid=118597764

## Notes

- ISO8609 is sortable and useful so that we don't combine that with TTL which is for DynamoDB TTL
- DynamoDB TTL states that it will delete items within 48 hours. To avoid returning unnecessary items, we can use filterExpression.
