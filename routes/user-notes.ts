import UserNote from '../models/UserNote.js';
import { createCrudRouter } from './_crud.js';

export default createCrudRouter(UserNote as any);
