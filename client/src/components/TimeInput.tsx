import { useCallback, useEffect, useState } from 'react';

interface TimeInputProps {
  value: string;           // stored as "08:00 AM" / "10:00 PM"
  onChange: (val: string) => void;
  className?: string;
  required?: boolean;
  style?: React.CSSProperties;
  id?: string;
}

/**
 * Converts a 24-hour time string "HH:MM" to "hh:mm AM/PM"
 */
export function to12h(time24: string): string {
  const [hStr, mStr] = time24.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  const period = h >= 12 ? 'PM' : 'AM';
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${String(h).padStart(2, '0')}:${m} ${period}`;
}

/**
 * Converts "hh:mm AM/PM" back to "HH:MM" (for the native input value)
 */
export function to24h(time12: string): string {
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '';
  let h = parseInt(match[1], 10);
  const m = match[2];
  const period = match[3].toUpperCase();
  if (period === 'AM' && h === 12) h = 0;
  else if (period === 'PM' && h !== 12) h += 12;
  return `${String(h).padStart(2, '0')}:${m}`;
}

/**
 * TimeInput — shows a native time picker (24h system in browser)
 * but stores and emits the value as "hh:mm AM/PM" automatically.
 *
 * Usage:
 *   <TimeInput value={form.time} onChange={v => setForm({ ...form, time: v })} />
 */
export default function TimeInput({ value, onChange, className, required, style, id }: TimeInputProps) {
  // Derive the 24h value for the native <input type="time">
  const to24hSafe = useCallback((v: string) => {
    if (!v) return '';
    // Already in 24h format (e.g. "08:00")
    if (/^\d{2}:\d{2}$/.test(v)) return v;
    return to24h(v);
  }, []);

  const [nativeVal, setNativeVal] = useState(() => to24hSafe(value));

  // Sync if parent changes value externally
  useEffect(() => {
    setNativeVal(to24hSafe(value));
  }, [value, to24hSafe]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value; // "HH:MM"
    setNativeVal(raw);
    if (raw) {
      onChange(to12h(raw));     // emit "hh:mm AM/PM" to parent
    } else {
      onChange('');
    }
  };

  return (
    <div style={{ position: 'relative', ...style }}>
      <input
        id={id}
        type="time"
        value={nativeVal}
        onChange={handleChange}
        required={required}
        className={className}
        style={{
          width: '100%',
          colorScheme: 'dark',
        }}
      />
      {/* AM/PM badge shown when a value is selected */}
      {nativeVal && (
        <span style={{
          position: 'absolute',
          right: '2.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '0.7rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          color: parseInt(nativeVal.split(':')[0]) >= 12 ? '#f59e0b' : '#60a5fa',
          background: parseInt(nativeVal.split(':')[0]) >= 12 ? 'rgba(245,158,11,0.12)' : 'rgba(96,165,250,0.12)',
          padding: '1px 6px',
          borderRadius: '4px',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {parseInt(nativeVal.split(':')[0]) >= 12 ? 'PM' : 'AM'}
        </span>
      )}
    </div>
  );
}
