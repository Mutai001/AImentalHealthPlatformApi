
import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIUsers, TSUsers, users, } from "../drizzle/schema";

//FEtch all users
export const usersService = async (limit?: number): Promise<TSUsers[] | null> => {
    if (limit) {
        return await db.query.users.findMany({
            limit: limit
        });
    }
    return await db.query.users.findMany();
}

//Fetch a single user
export const getuserservice = async (id: number): Promise<TIUsers | undefined> => {
    return await db.query.users.findFirst({
        where: eq(users.id, id)
    })
}

//Create a user
export const createuserservice = async (user: TIUsers) => {
    await db.insert(users).values(user)
    return "user created successfully";
}

//Update a user
export const updateuserservice = async (id: number, user: TIUsers) => {
    await db.update(users).set(user).where(eq(users.id, id))
    return "user updated successfully";
}

//Delete a user
export const deleteuserservice = async (id: number) => {
    await db.delete(users).where(eq(users.id, id))
    return "user deleted successfully";
}
