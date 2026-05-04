import { withAuth } from 'next-auth/middleware';

export default withAuth({ pages: { signIn: '/login' } });

export const config = {
  matcher: ['/drafts/:path*', '/planner/:path*', '/notes/:path*'],
};
