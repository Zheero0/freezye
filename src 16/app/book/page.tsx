
import { BookingForm } from '@/components/BookingForm';
import { Header } from '@/components/Header';
import { Droplets } from 'lucide-react';

export default function BookPage() {
  return (
    <div className="bg-background/0 text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-16 flex-1 flex items-center justify-center">
        <div className="w-full max-w-3xl">
          <div className="relative z-20">
            <BookingForm />
          </div>
        </div>
      </main>
    </div>
  );
}

    