import { UserDetail } from "../lib/definitions";
import { Post, PostMedia } from "../lib/fakebook/definitions";

export const UserStorage = new Map<string, UserDetail>();
export const FbPostStorage = new Map<string, Post>();
export const FbMediaStorage = new Map<string, PostMedia>();
