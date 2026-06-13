export function isAuthRoute(pathname: string): boolean {
  return (
    ['/login', '/register', '/forgot-password'].includes(pathname) ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/auth/')
  );
}

export function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith('/dashboard');
}

export function isPublicSiteRoute(pathname: string): boolean {
  return !isAuthRoute(pathname) && !isDashboardRoute(pathname);
}
