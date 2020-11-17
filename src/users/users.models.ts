import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import {ObjectType, Field, Int} from '@nestjs/graphql'
import {GraphQLModel} from '../common/graphql';

@ObjectType()
@Entity()
export class User extends GraphQLModel<User> {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number

  @Column()
  @Field()
  username: string

  @Column()
  password: string

  @Column()
  @Field()
  email: string

  @Column()
  @Field()
  isAdmin: boolean
}