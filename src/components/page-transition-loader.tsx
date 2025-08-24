
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import BrandedLoader from './branded-loader';

export default function PageTransitionLoader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true); // Start with loading true for initial load
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // This effect will run on initial load and whenever the path changes.
        // We set loading to true to show the loader, then set a timeout
        // to hide it. This gives the impression of a loading state.
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 750); // Simulate loading time

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    return (
        <>
            {isLoading ? (
                 <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm">
                    <BrandedLoader 
                        title="Loading..."
                        description="Please wait while we prepare your content."
                        isStatic={true}
                    />
                 </div>
            ) : (
                children
            )}
        </>
    );
}
