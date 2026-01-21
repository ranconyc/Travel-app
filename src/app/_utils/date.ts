export function parseDate(date: Date | string | number) {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    throw new Error("Invalid date provided");
  }

  // Cache computed values
  let _monthName: string | undefined;
  let _dayName: string | undefined;
  let _weekNumber: number | undefined;

  return {
    original: d,

    // Use getters - only compute when accessed
    get formatted() {
      return {
        get full() {
          return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        },
        get short() {
          return d.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
        get numeric() {
          return d.toLocaleDateString("en-US");
        },
        get iso() {
          return d.toISOString().split("T")[0];
        },
      };
    },

    get month() {
      return {
        get name() {
          if (!_monthName) {
            _monthName = d.toLocaleDateString("en-US", { month: "long" });
          }
          return _monthName;
        },
        get nameShort() {
          return d.toLocaleDateString("en-US", { month: "short" });
        },
        number: d.getMonth() + 1,
        index: d.getMonth(),
      };
    },

    get day() {
      return {
        get name() {
          if (!_dayName) {
            _dayName = d.toLocaleDateString("en-US", { weekday: "long" });
          }
          return _dayName;
        },
        get nameShort() {
          return d.toLocaleDateString("en-US", { weekday: "short" });
        },
        number: d.getDate(),
        ofWeek: d.getDay(),
        get ofYear() {
          const start = new Date(d.getFullYear(), 0, 0);
          const diff = d.getTime() - start.getTime();
          return Math.floor(diff / 86400000);
        },
      };
    },

    get year() {
      return {
        full: d.getFullYear(),
        short: d.getFullYear().toString().slice(-2),
      };
    },

    get time() {
      const hours = d.getHours();
      return {
        hours24: hours,
        hours12: hours % 12 || 12,
        minutes: d.getMinutes(),
        seconds: d.getSeconds(),
        milliseconds: d.getMilliseconds(),
        period: hours >= 12 ? ("PM" as const) : ("AM" as const),
      };
    },

    get relative() {
      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      return {
        get isToday() {
          const tomorrow = new Date(todayStart);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return d >= todayStart && d < tomorrow;
        },
        isPast: d < now,
        isFuture: d > now,
      };
    },
  };
}

export function formatDate(date: Date | string | number) {
  return parseDate(date).formatted.short;
}
