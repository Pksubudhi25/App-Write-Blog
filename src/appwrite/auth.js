import conf from '../conf/conf.js'; // Ensure this path is correct

import { Client, Account, ID } from 'appwrite'; // Ensure these imports are correct based on your Appwrite SDK version

export class AuthService {
    client = new Client();
    account;

    constructor() {
        // Initialize Appwrite Client
        this.client
            .setEndpoint(conf.appwriteUrl) // Your Appwrite Endpoint
            .setProject(conf.appwriteProjectId); // Your Appwrite Project ID
        this.account = new Account(this.client); // Initialize Account service
    }

    async createAccount({ email, password, name }) {
        try {
            // Create a new account
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Automatically log in after account creation
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error; // Rethrow error to be handled by the caller
        }
    }

    async login({ email, password }) {
        try {
            // Create a new email session
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error; // Rethrow error to be handled by the caller
        }
    }

    async getCurrentUser() {
        try {
            // Get the current logged-in user
            return await this.account.get();
        } catch (error) {
            throw error; // Rethrow error to be handled by the caller
        }
    }

    async logout() {
        try {
            // Delete all sessions for the current user
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service ::logout::error ", error);
        }
    }
}

const authService = new AuthService();
export default authService;
