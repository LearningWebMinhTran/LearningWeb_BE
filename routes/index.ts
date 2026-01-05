import { Hono } from 'hono';

import auth from './auth.js';
import assets from './assets.js';
import categories from './categories.js';
import contents from './contents.js';
import courses from './courses.js';
import users from './users.js';
import userNotes from './user-notes.js';

const routes = new Hono();

routes.route('/auth', auth);
routes.route('/assets', assets);
routes.route('/categories', categories);
routes.route('/contents', contents);
routes.route('/courses', courses);
routes.route('/users', users);
routes.route('/user-notes', userNotes);

export default routes;
