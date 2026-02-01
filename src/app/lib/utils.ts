export const formatDateTime = (datetime: Date | string) => {
  let targetDateTime: Date;
  if (datetime instanceof String) {
    targetDateTime = new Date(datetime);
  } else if (datetime instanceof Date) {
    targetDateTime = datetime;
  } else {
    return "###";
  }

  const d = new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(targetDateTime);

  const get = (type: string) => d.find(p => p.type === type)?.value;

  return `${get('day')}-${get('month')}-${get('year')} ${get('hour')}:${get('minute')}`;
}
