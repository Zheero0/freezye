
import type { SVGProps } from 'react';
import { Rocket, Sparkles, Star } from 'lucide-react';

export const Icons = {
  rocket: (props: SVGProps<SVGSVGElement>) => (
    <Rocket {...props} />
  ),
  sparkles: (props: SVGProps<SVGSVGElement>) => (
    <Sparkles {...props} />
  ),
    star: (props: SVGProps<SVGSVGElement>) => (
        <Star {...props} />
    )
};
