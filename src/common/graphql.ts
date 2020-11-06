export abstract class GraphQLModel<T> {
  constructor(init?: Partial<T>) {
    Object.assign(this, init)
  }
}