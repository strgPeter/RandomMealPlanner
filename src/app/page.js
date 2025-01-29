import Image from "next/image";
import styles from "./page.module.css";
import MyCalendar from '@/app/components/calendar/CalendarChart';

export default function Home() {
  return (
      <div>
        <MyCalendar />
      </div>
  );
}
