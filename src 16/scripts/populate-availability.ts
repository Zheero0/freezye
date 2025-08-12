
import { db } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format } from 'date-fns';

const availabilityCollection = collection(db, 'availability');

/**
 * Populates the availability for the current month.
 * Monday-Saturday: 8am-6pm (hourly)
 * Sunday: 10am-4pm (hourly)
 */
async function populateMonth() {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const daysInMonth = eachDayOfInterval({ start, end });

  console.log(`Populating availability for ${format(now, 'MMMM yyyy')}...`);

  const promises = daysInMonth.map(async (day) => {
    const dayOfWeek = getDay(day); // Sunday = 0, Monday = 1, etc.
    const dateString = format(day, 'yyyy-MM-dd');
    let slots: string[] = [];

    if (dayOfWeek >= 1 && dayOfWeek <= 6) { // Monday to Saturday
      for (let hour = 8; hour <= 18; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
      }
    } else { // Sunday
      for (let hour = 10; hour <= 16; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
      }
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
  console.log('Finished populating availability for the month.');
}

populateMonth().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});
