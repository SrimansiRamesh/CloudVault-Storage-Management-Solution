"use server"

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";

const getUserByEmail = async(email:string) => { 
    const {database} = await createAdminClient();
    const result=await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", email)]
    )
    return result.total>0? result.documents[0] : null;
}
const handleError=(error:unknown,message:string) => {
    console.log(error,message);
    throw error;
}
const sendEmailOTP = async({email}:{email:string}) => {
    const {account} = await createAdminClient();

    try{
        const session=await account.createEmailToken(ID.unique(), email);
        return session.userId;
    }catch(error){
        handleError(error, "Failed to send EMail OTP");
    }
    
}
export const createAccount = async({fullName,email}:{fullName:string;email:string;}) => {
  const existingUser=await getUserByEmail(email);
  const accountId=await sendEmailOTP({email});
  if(!accountId){
    throw new Error("Failed to send OTP");
  }
  if(!existingUser){
    const {database} = await createAdminClient();
    await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        ID.unique(),
        {
            fullName,
            email,
            avatar:'https://i.pinimg.com/736x/7b/8c/d8/7b8cd8b068e4b9f80b4bcf0928d7d499.jpg',
            accountId
        }
    );
    }
    return parseStringify({accountId});

}