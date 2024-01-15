import { type User, type UserLink } from "~/server/db/schema";

export type UserWithLink = User & { userLink?: UserLink };
