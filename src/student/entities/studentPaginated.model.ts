import Paginated from 'src/common/pagination/pagination';
import { ObjectType } from '@nestjs/graphql';
import { Student } from './student.entity';

@ObjectType()
export class StudentPaginatedModel extends Paginated(Student) {}
