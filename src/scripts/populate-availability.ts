
'use server';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { addDays, eachDayOfInterval, getDay, format } from 'date-fns';

const availabilityCollection = collection(db, 'availability');

/**
 * Populates the availability for the next 90 days from today.
 * Monday-Saturday: 8am-6pm (30-min intervals)
 * Sunday: 10am-4pm (30-min intervals)
 */
async function populateNext90Days() {
  const today = new Date();
  const ninetyDaysFromNow = addDays(today, 90);
  const dateInterval = eachDayOfInterval({ start: today, end: ninetyDaysFromNow });

  console.log(`Populating availability for the next 90 days...`);

  const promises = dateInterval.map(async (day) => {
    const dayOfWeek = getDay(day); // Sunday = 0, Monday = 1, etc.
    const dateString = format(day, 'yyyy-MM-dd');
    let slots: string[] = [];

    if (dayOfWeek >= 1 && dayOfWeek <= 6) { // Monday to Saturday
      for (let hour = 8; hour < 18; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
        slots.push(`${String(hour).padStart(2, '0')}:30`);
      }
      slots.push('18:00');
    } else { // Sunday
      for (let hour = 10; hour < 16; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
        slots.push(`${String(hour).padStart(2, '0')}:30`);
      }
      slots.push('16:00');
    }

    try {
      const docRef = doc(availabilityCollection, dateString);
      await setDoc(docRef, { slots });
      console.log(`Successfully added ${slots.length} slots for ${dateString}`);
    } catch (error) {
      console.error(`Failed to add slots for ${dateString}:`, error);
    }
  });

  await Promise.all(promises);
  console.log('Finished populating availability.');
}

populateNext90Days().then(() => {
  console.log("Script finished. Exiting process.");
  setTimeout(() => process.exit(0), 2000); // Allow time for logs to flush
}).catch((error) => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
