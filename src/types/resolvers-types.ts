import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  IntString: any;
};

export type AddFeeMutationResponse = MutationResponse & {
  __typename?: 'AddFeeMutationResponse';
  code: Scalars['Int'];
  message: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type ComputeTransactionFeeResponse = MutationResponse & {
  __typename?: 'ComputeTransactionFeeResponse';
  AppliedFeeID?: Maybe<Scalars['String']>;
  AppliedFeeValue?: Maybe<Scalars['Int']>;
  ChargeAmount?: Maybe<Scalars['Int']>;
  SettlementAmount?: Maybe<Scalars['Int']>;
  code: Scalars['Int'];
  message: Scalars['String'];
  status?: Maybe<Scalars['String']>;
  success: Scalars['Boolean'];
};

export type CustomerType = {
  BearsFee: Scalars['Boolean'];
  EmailAddress: Scalars['String'];
  FullName: Scalars['String'];
  ID: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  fees: AddFeeMutationResponse;
};

export type MutationFeesArgs = {
  FeeConfigurationSpec: Scalars['String'];
};

export type MutationResponse = {
  code: Scalars['Int'];
  message: Scalars['String'];
  success: Scalars['Boolean'];
};

export type PaymentEntityType = {
  Brand: Scalars['String'];
  Country: Scalars['String'];
  ID: Scalars['Int'];
  Issuer: Scalars['String'];
  Number: Scalars['String'];
  SixID: Scalars['IntString'];
  Type: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  computeTransactionFee: ComputeTransactionFeeResponse;
};

export type QueryComputeTransactionFeeArgs = {
  Amount: Scalars['Int'];
  Currency: Scalars['String'];
  CurrencyCountry: Scalars['String'];
  Customer: CustomerType;
  ID: Scalars['Int'];
  PaymentEntity: PaymentEntityType;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    {[key in TKey]: TResult},
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    {[key in TKey]: TResult},
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AddFeeMutationResponse: ResolverTypeWrapper<AddFeeMutationResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  ComputeTransactionFeeResponse: ResolverTypeWrapper<ComputeTransactionFeeResponse>;
  CustomerType: CustomerType;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  IntString: ResolverTypeWrapper<Scalars['IntString']>;
  Mutation: ResolverTypeWrapper<{}>;
  MutationResponse:
    | ResolversTypes['AddFeeMutationResponse']
    | ResolversTypes['ComputeTransactionFeeResponse'];
  PaymentEntityType: PaymentEntityType;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AddFeeMutationResponse: AddFeeMutationResponse;
  Boolean: Scalars['Boolean'];
  ComputeTransactionFeeResponse: ComputeTransactionFeeResponse;
  CustomerType: CustomerType;
  Int: Scalars['Int'];
  IntString: Scalars['IntString'];
  Mutation: {};
  MutationResponse:
    | ResolversParentTypes['AddFeeMutationResponse']
    | ResolversParentTypes['ComputeTransactionFeeResponse'];
  PaymentEntityType: PaymentEntityType;
  Query: {};
  String: Scalars['String'];
}>;

export type AddFeeMutationResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['AddFeeMutationResponse'] = ResolversParentTypes['AddFeeMutationResponse']
> = ResolversObject<{
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ComputeTransactionFeeResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ComputeTransactionFeeResponse'] = ResolversParentTypes['ComputeTransactionFeeResponse']
> = ResolversObject<{
  AppliedFeeID?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  AppliedFeeValue?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  ChargeAmount?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  SettlementAmount?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface IntStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['IntString'], any> {
  name: 'IntString';
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  fees?: Resolver<
    ResolversTypes['AddFeeMutationResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationFeesArgs, 'FeeConfigurationSpec'>
  >;
}>;

export type MutationResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['MutationResponse'] = ResolversParentTypes['MutationResponse']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'AddFeeMutationResponse' | 'ComputeTransactionFeeResponse',
    ParentType,
    ContextType
  >;
  code?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  computeTransactionFee?: Resolver<
    ResolversTypes['ComputeTransactionFeeResponse'],
    ParentType,
    ContextType,
    RequireFields<
      QueryComputeTransactionFeeArgs,
      | 'Amount'
      | 'Currency'
      | 'CurrencyCountry'
      | 'Customer'
      | 'ID'
      | 'PaymentEntity'
    >
  >;
}>;

export type Resolvers<ContextType = any> = ResolversObject<{
  AddFeeMutationResponse?: AddFeeMutationResponseResolvers<ContextType>;
  ComputeTransactionFeeResponse?: ComputeTransactionFeeResponseResolvers<ContextType>;
  IntString?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  MutationResponse?: MutationResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;
