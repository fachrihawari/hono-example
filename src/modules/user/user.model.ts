import { Model, type IMongoloquentSchema, type IMongoloquentTimestamps } from "mongoloquent";

interface IUser extends IMongoloquentSchema, IMongoloquentTimestamps {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'reseller';
}

export class User extends Model<IUser> {
  protected $collection = 'users';

  static $schema: IUser;
}
