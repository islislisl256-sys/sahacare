import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  // حماية المسارات الخاصة بكل الأدوار
  matcher: ["/dashboard/:path*", "/admin/:path*", "/provider/:path*"],
};
