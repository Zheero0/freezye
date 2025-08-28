
'use client';

import AnimatedSweets from './animated-sweets';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Candy } from 'lucide-react';

interface BrandedLoaderProps {
    title?: string;
    description: string;
    isStatic?: boolean;
}

export default function BrandedLoader({ title = "Freezye", description, isStatic = false }: BrandedLoaderProps) {
    return (
        <>
            <div className="fixed inset-0 bg-accent -z-10">
                <AnimatedSweets isStatic={isStatic}/>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <Card className="max-w-sm text-center">
                    <CardHeader>
                       <div className="animate-pulse mx-auto h-12 w-12 text-primary">
                           <Candy className="h-full w-full" />
                       </div>
                       <CardTitle className="font-headline text-2xl">{title}</CardTitle>
                       <CardDescription>{description}</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </>
    );
}
