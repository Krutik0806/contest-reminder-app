export const generateICS = (contest) => {
  const start = new Date(contest.startTime);
  const durationMatch = contest.duration.match(/(\d+)/);
  const durationHours = durationMatch ? parseInt(durationMatch[0]) : 2;
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000);

  const formatDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Contest Reminder//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${contest._id}@contestreminder.app
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
SUMMARY:${contest.name}
DESCRIPTION:Platform: ${contest.platform}\\nDuration: ${contest.duration}\\nLink: ${contest.link}
URL:${contest.link}
LOCATION:${contest.platform}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT1H
ACTION:DISPLAY
DESCRIPTION:Contest starts in 1 hour!
END:VALARM
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:Contest starts in 30 minutes!
END:VALARM
END:VEVENT
END:VCALENDAR`;

  return icsContent;
};

export const downloadICS = (contest) => {
  const icsContent = generateICS(contest);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = `${contest.name.replace(/[^a-z0-9]/gi, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
