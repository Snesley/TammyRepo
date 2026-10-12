import { auth } from '../../src/oauth.js';
export const onRequestGet = ({ request, env }) => auth(request, env);
