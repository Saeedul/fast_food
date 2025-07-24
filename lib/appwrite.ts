import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.karim.fastfood",
    projectID: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
}

// We added a " ! " at the end of each environment variable to tell TypeScript that we are sure these variables will not be undefined. This is useful when we are certain that these values will be provided in the environment, such as during the build process or in a production environment.


// Here, we'll need to create a function that will create a new user account, their session and also store them within the database as soon as they create an account. So, let's start by creating a new Appwrite client and exporting it. This will allow us to use the Appwrite SDK throughout our application.

// Function to create a new Appwrite client, and export it for use in other parts of the application.

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectID)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

// Function to create and register a user

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {

        // create a new account on Appwrite using the new unique Id, email, password, and name.
        const newAccount = await account.create(ID.unique(), email, password, name)

        // if a new account wasnt created, we throw an error
        if (!newAccount) throw Error;

        // if user has been created then we try to automatically sign the user in afte the account creation process.
        await signIn({ email, password });

        // creating a new user in the database with the same email, name, and unique ID.

        // Here, This generates an avatar image using the user's initials and then stores it into the database.
        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, accountId: newAccount.$id, avatar: avatarUrl }
        );
    } catch (e) {
        throw new Error(e as string);

    }
}
// A seperate function to sign in the user after account creation. This will allow us to keep the createUser function clean and focused on account creation.
// We will be using this function in the createUser function to automatically sign in the user after account creation. And also we will be using it standalone in the app when the user just wants to sign in.
export const signIn = async ({ email, password }: SignInParams) => {
    // Within this second function, we sign the user in by creating the user session using their email and passoword.
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}