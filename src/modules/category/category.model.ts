import { Model, type IMongoloquentSchema, type IMongoloquentTimestamps } from "mongoloquent";

export interface ICategory extends IMongoloquentSchema, IMongoloquentTimestamps {
  name: string;
}

export class Category extends Model<ICategory> {
  protected $collection = 'categories';
  protected $useTimestamps = true;

  static $schema: ICategory;
}
