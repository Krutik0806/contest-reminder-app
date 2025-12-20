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
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Contest starts in 15 minutes!
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

// Generate direct calendar URLs for various calendar services
export const getCalendarUrls = (contest) => {
  const start = new Date(contest.startTime);
  const durationMatch = contest.duration.toString().match(/(\d+)/);
  const durationMinutes = durationMatch ? parseInt(durationMatch[0]) : 120;
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const formatGoogleDate = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const description = `Platform: ${contest.platform}\nDuration: ${contest.duration}\n\nContest Link: ${contest.link}`;
  
  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(contest.name)}&dates=${formatGoogleDate(start)}/${formatGoogleDate(end)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(contest.platform)}&sf=true&output=xml`,
    
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(contest.name)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(contest.platform)}`,
    
    office365: `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(contest.name)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(contest.platform)}`,
    
    yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${encodeURIComponent(contest.name)}&st=${formatGoogleDate(start)}&et=${formatGoogleDate(end)}&desc=${encodeURIComponent(description)}&in_loc=${encodeURIComponent(contest.platform)}`
  };
};
