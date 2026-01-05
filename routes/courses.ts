import Course from '../models/Course.js';
import { createCrudRouter } from './_crud.js';

export default createCrudRouter(Course as any);
