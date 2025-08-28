
'use client';

import { Suspense } from 'react';
import PageTransitionLoader from './page-transition-loader';

export default function SuspenseWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<PageTransitionLoader.Skeleton />}>
            <PageTransitionLoader>
                {children}
            </PageTransitionLoader>
        </Suspense>
    );
}
