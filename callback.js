import { callback } from '../../src/oauth.js';
export const onRequestGet = ({ request, env }) => callback(request, env);
