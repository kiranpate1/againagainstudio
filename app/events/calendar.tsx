import { useRef, useEffect, useState } from "react";

type props = {};

export default function Calendar(props: props) {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    const endDate = new Date(today);
    endDate.setMonth(today.getMonth() + 3);

    const tempDays: Date[] = [];
    const currentDate = new Date(today);

    while (currentDate <= endDate) {
      tempDays.push(new Date(currentDate));
      // Using native Date setDate handles month rollovers and leap years automatically
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDays(tempDays);
  }, []);

  return (
    <div className="absolute inset-[auto_0_0_0]">
      <div className="relative w-full overflow-x-scroll pt-8 pb-2">
        <div className="w-max flex gap-8 items-center px-4" ref={calendarRef}>
          {days.map((day, index) => {
            const showMonth =
              day.getDate() === 1 || (index === 0 && day.getDate() <= 27);

            return (
              <div key={day.toISOString()} className="relative">
                {showMonth && (
                  <div className="absolute bottom-full left-0 mb-1 text-xs font-semibold whitespace-nowrap text-gray-500">
                    {day.toLocaleString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                )}
                {day.toDateString()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
