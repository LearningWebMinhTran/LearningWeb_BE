import User from '../models/User.js';
import { createCrudRouter } from './_crud.js';

export default createCrudRouter(User as any);
