export function parseDate(date: Date | string | number) {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    throw new Error("Invalid date provided");
  }

  // Cache computed values
  let _monthName: string | undefined;
  let _dayName: string | undefined;

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

/**
 * Format an IANA timezone string into human-friendly metadata.
 * Returns local time, full zone name, and relative offset (e.g. "3h ahead").
 */
export function formatTimezoneMetadata(ianaString: string) {
  try {
    const now = new Date();

    // 1. Local Time for Target Zone
    const timeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaString,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const localTime = timeFormatter.format(now);

    // 2. Full Timezone Name (e.g. "Pacific Standard Time")
    const nameFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: ianaString,
      timeZoneName: "long",
    });
    const timezoneName =
      nameFormatter.formatToParts(now).find((p) => p.type === "timeZoneName")
        ?.value || "";

    // 3. Relative Offset Calculation
    // We compare the date string representation to find the hour difference
    const targetDate = new Date(
      now.toLocaleString("en-US", { timeZone: ianaString }),
    );
    const localDate = new Date(now.toLocaleString("en-US"));
    const diffHours = Math.round(
      (targetDate.getTime() - localDate.getTime()) / 3600000,
    );

    let relativeContext = "Same time";
    if (diffHours > 0) relativeContext = `${diffHours}h ahead`;
    else if (diffHours < 0) relativeContext = `${Math.abs(diffHours)}h behind`;

    return {
      localTime,
      timezoneName,
      relativeContext,
      fullDisplay: `${localTime} · ${timezoneName} (${relativeContext})`,
    };
  } catch {
    console.warn("Invalid timezone string:", ianaString);
    return null;
  }
}

/**
 * Format country timezone info.
 * Shows capital local time and a descriptive range if multiple zones exist.
 */
export function formatCountryTimezoneMetadata(
  timezones: string[] | undefined,
  capitalTz: string | null | undefined,
) {
  // 1. Capital Time (Primary UX)
  const capitalMetadata = capitalTz ? formatTimezoneMetadata(capitalTz) : null;

  // 2. Multi-timezone logic
  const count = timezones?.length || 0;
  let rangeLabel = "";

  if (count > 1) {
    // Standardize offsets: "UTC+05:00" -> number
    const offsets = (timezones || [])
      .map((tz) => {
        const match = tz.match(/UTC([+-]\d+):?(\d+)?/);
        if (!match) return null;
        const hours = parseInt(match[1]);
        const mins = parseInt(match[2] || "0");
        return hours + (mins / 60) * (hours < 0 ? -1 : 1);
      })
      .filter((o): o is number => o !== null)
      .sort((a, b) => a - b);

    if (offsets.length > 0) {
      const min = offsets[0];
      const max = offsets[offsets.length - 1];
      const formatOffset = (n: number) =>
        `GMT${n >= 0 ? "+" : ""}${Math.floor(n)}${
          n % 1 !== 0 ? ":" + Math.round((n % 1) * 60) : ""
        }`;

      rangeLabel =
        min === max
          ? formatOffset(min)
          : `${formatOffset(min)} to ${formatOffset(max)}`;
    }
  } else if (count === 1 && timezones) {
    rangeLabel = timezones[0].replace("UTC", "GMT");
  }

  return {
    localTime: capitalMetadata?.localTime || null,
    timezoneName: capitalMetadata?.timezoneName || null,
    relativeContext: capitalMetadata?.relativeContext || null,
    count,
    rangeLabel,
    spansTimezones: count > 1,
  };
}
