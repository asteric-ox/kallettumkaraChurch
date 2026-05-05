import bcrypt from 'bcryptjs';
import Admin from './models/Admin';
import MassTiming from './models/MassTiming';
import Announcement from './models/Announcement';
import ParishCouncil from './models/ParishCouncil';
import Trustee from './models/Trustee';
import FamilyUnit from './models/FamilyUnit';
import SiteSettings from './models/SiteSettings';

export const seedDatabase = async (): Promise<void> => {
  // Admin
  if ((await Admin.countDocuments()) === 0) {
    const hashed = await bcrypt.hash('admin123', 10);
    await Admin.create({ username: 'admin', password: hashed });
    console.log('✅ Admin seeded');
  }

  // Mass Timings
  if ((await MassTiming.countDocuments()) === 0) {
    await MassTiming.insertMany([
      { day: 'Monday',    time: '06:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Monday',    time: '07:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Tuesday',   time: '06:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Tuesday',   time: '07:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Wednesday', time: '06:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Wednesday', time: '05:00 PM', description: 'Holy Qurbana & Novena', category: 'Weekday' },
      { day: 'Thursday',  time: '06:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Thursday',  time: '07:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Friday',    time: '06:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Friday',    time: '07:00 AM', description: 'Holy Qurbana & Way of the Cross', category: 'Weekday' },
      { day: 'Saturday',  time: '06:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Saturday',  time: '07:00 AM', description: 'Holy Qurbana', category: 'Weekday' },
      { day: 'Sunday',    time: '05:45 AM', description: 'First Holy Qurbana', category: 'Sunday' },
      { day: 'Sunday',    time: '07:00 AM', description: 'Second Holy Qurbana', category: 'Sunday' },
      { day: 'Sunday',    time: '10:00 AM', description: 'Third Holy Qurbana', category: 'Sunday' },
      { day: 'Sunday',    time: '06:00 PM', description: 'Fourth Holy Qurbana', category: 'Sunday' },
    ]);
    console.log('✅ Mass timings seeded');
  }

  // Announcements
  if ((await Announcement.countDocuments()) === 0) {
    await Announcement.insertMany([
      { title: 'Annual Parish Feast', content: 'The annual feast will be celebrated on January 20th with solemnity.', date: new Date('2026-01-15'), expiry: new Date('2027-01-25'), pdf_url: '' },
      { title: 'Sunday School Admissions Open', content: 'Admissions for the new academic year of Sunday School (Catechism) are now open.', date: new Date('2026-04-01'), expiry: new Date('2027-05-31'), pdf_url: '' },
      { title: 'Parish Pilgrimage to Arthunkal', content: 'A parish pilgrimage to Arthunkal is being organised for May 15th.', date: new Date('2026-04-20'), expiry: new Date('2027-05-20'), pdf_url: '' },
    ]);
    console.log('✅ Announcements seeded');
  }

  // Parish Council
  if ((await ParishCouncil.countDocuments()) === 0) {
    await ParishCouncil.insertMany([
      { name: 'Fr. Dr. Sebastian Panjikkaran', role: 'Vicar', image_url: '/uploads/panji.jpg', phone: '+91 85477 75750', dob: '14.05.1959', feast_day: 'January 20', normal_mass_time: '6:30 AM', special_mass_time: '' },
      { name: 'Fr. Jeril James', role: 'Assistant Vicar', image_url: '/uploads/jeril.jpg', phone: '+91 73069 57966', dob: '20.03.1996', feast_day: 'October 2', normal_mass_time: '6:30 AM', special_mass_time: '' },
    ]);
    console.log('✅ Parish council seeded');
  }

  // Trustees
  if ((await Trustee.countDocuments()) === 0) {
    await Trustee.insertMany([
      { name: 'Trustee 1', role: 'Trustee', image_url: '', phone: '', dob: '', feast_day: '', installation_date: '' },
      { name: 'Trustee 2', role: 'Trustee', image_url: '', phone: '', dob: '', feast_day: '', installation_date: '' },
      { name: 'Trustee 3', role: 'Trustee', image_url: '', phone: '', dob: '', feast_day: '', installation_date: '' },
    ]);
    console.log('✅ Trustees seeded');
  }

  // Family Units
  if ((await FamilyUnit.countDocuments()) === 0) {
    const unitNames = [
      'St. John', 'St. George', 'Mariyam Thresia', 'Christhuraja', 'St. James',
      'Jesus Christ', "St. Mary's", 'Maria', 'Holy Family', 'St. Joseph',
      'Francis Xavier', 'St. Sebastian', 'St. Antony', 'Infant Jesus', 'Thiruhridayam',
      'St. Alphonsa', 'St. Paul', 'St. Raphel', 'Mother Theresa', 'St. Peter',
      'Maria Goretti', 'Vellamkanni Matha', 'Cherupushpam', 'Chavara Kuriakose', 'St. Thomas'
    ];
    const units = unitNames.map((name, i) => ({
      unit_number: i + 1,
      name,
      show_photo: true,
      president: { name: '—', phone: '—', address: '—', image_url: '' },
      secretary: { name: '—', phone: '—', address: '—', image_url: '' },
      treasurer: { name: '—', phone: '—', address: '—', image_url: '' },
      families: [],
    }));
    await FamilyUnit.insertMany(units);
    console.log('✅ Family units seeded');
  }

  // Site Settings
  if ((await SiteSettings.countDocuments()) === 0) {
    await SiteSettings.create({ key: 'general', maintenance_mode: false, maintenance_message: '' });
    console.log('✅ Site settings seeded');
  }
};
