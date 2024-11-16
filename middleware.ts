import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/", // Redirect to the home page for sign-in
  },
});

export const config = {
  matcher: [
    "/users/:path*", // Apply middleware to all routes under /users
    "/conversations/:path*", //Apply the middleware to all routes under /conversations
  ],
};
