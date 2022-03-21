import {makeExecutableSchema} from '@graphql-tools/schema';
import {readFileSync} from 'fs';
import {resolvers} from './resolvers';

export const typeDefs = readFileSync('./src/schema.graphql').toString('utf-8');
export const schema = makeExecutableSchema({typeDefs, resolvers});
