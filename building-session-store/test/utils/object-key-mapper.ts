import {
  UserName,
  UserNameDocument,
  SessionDocument,
  Session,
} from '@externals/drivers/database/session-interfaces'
import * as voca from 'voca'

export class ObjectKeyMapper {
  static toDeCapitalKeys(
    ary: UserNameDocument[] & SessionDocument[]
  ): UserName[] | Session[] {
    return ary.flatMap((sessionDocument) =>
      Object.fromEntries(
        Object.entries(sessionDocument).map(([k, v]): UserName[] => [
          voca.decapitalize(k),
          v,
        ])
      )
    )
  }

  static toCapitalKeys(
    ary: UserName[] & Session[]
  ): UserNameDocument[] | SessionDocument[] {
    return ary.flatMap((sessionDocument) =>
      Object.fromEntries(
        Object.entries(sessionDocument).map(([k, v]): UserName[] => [
          voca.capitalize(k),
          v,
        ])
      )
    )
  }
}
