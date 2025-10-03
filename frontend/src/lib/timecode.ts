export function secondsToTimecode(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return [hours, minutes, remainingSeconds]
    .map((segment) => segment.toString().padStart(2, '0'))
    .join(':');
}

export function timecodeToSeconds(timecode: string): number {
  const parts = timecode.split(':').map((part) => Number.parseInt(part, 10));

  if (parts.some((part) => Number.isNaN(part))) {
    throw new Error(`Invalid timecode: ${timecode}`);
  }

  const [hours = 0, minutes = 0, seconds = 0] = parts;
  return hours * 3600 + minutes * 60 + seconds;
}
