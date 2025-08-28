
'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import BrandedLoader from './branded-loader';

function PageTransitionLoader({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setIsLoading(true);

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 750); 

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

PageTransitionLoader.Skeleton = function PageTransitionLoaderSkeleton() {
    return (
        <BrandedLoader
            title="Loading..."
            description="Please wait while we prepare your content."
            isStatic={true}
        />
    )
}

export default PageTransitionLoader;
