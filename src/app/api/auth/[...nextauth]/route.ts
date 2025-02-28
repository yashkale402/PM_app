import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        return { _id: user._id.toString(), email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = token._id; // Attach `_id` to session
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
