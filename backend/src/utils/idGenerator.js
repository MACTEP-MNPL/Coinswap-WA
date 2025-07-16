import { customAlphabet } from 'nanoid';
import { ulid } from 'ulid';


export const createUserId = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);


export const createApplicationId = () => ulid();