import { DataLoaders } from '../dataloader/types/dataLoaders';

declare global {
  interface IGraphQLContext {
    loaders: DataLoaders;
  }
}
