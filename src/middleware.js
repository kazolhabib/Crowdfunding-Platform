import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fundflow-super-secret-key-change-me-in-production"
);

const ROLE_DASHBOARDS = {
  Supporter: "/dashboard/supporter",
  Creator: "/dashboard/creator",
  Admin: "/dashboard/admin",
};

const ROLE_ROUTES = {
  Supporter: [
    "/dashboard/supporter",
    "/dashboard/explore",
    "/dashboard/my-contributions",
    "/dashboard/purchase-credit",
    "/dashboard/payment-history",
  ],
  Creator: [
    "/dashboard/creator",
    "/dashboard/add-campaign",
    "/dashboard/my-campaigns",
    "/dashboard/review-contributions",
    "/dashboard/withdrawals",
    "/dashboard/creator-payments",
  ],
  Admin: [
    "/dashboard/admin",
    "/dashboard/campaign-approvals",
    "/dashboard/manage-users",
    "/dashboard/manage-campaigns",
    "/dashboard/admin-withdrawals",
    "/dashboard/reports",
  ],
};

function isAllowedRoute(pathname, role) {
  return ROLE_ROUTES[role]?.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (!isDashboardRoute && !isAuthRoute) return NextResponse.next();
  if (!token) {
    return isDashboardRoute
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const dashboard = ROLE_DASHBOARDS[payload.role];
    if (!dashboard) throw new Error("Invalid role");
    if (isAuthRoute) return NextResponse.redirect(new URL(dashboard, request.url));
    if (pathname === "/dashboard") return NextResponse.next();
    if (!isAllowedRoute(pathname, payload.role)) {
      return NextResponse.redirect(new URL(dashboard, request.url));
    }
    return NextResponse.next();
  } catch {
    const response = isDashboardRoute
      ? NextResponse.redirect(new URL("/login", request.url))
      : NextResponse.next();
    response.cookies.set({ name: "token", value: "", path: "/", expires: new Date(0) });
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
