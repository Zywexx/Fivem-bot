const fs = require('fs');
const path = require('path');

function isUserBanned(userId) {
  const banlistPath = path.join(__dirname, '../data/banlist.json');
  const banlist = JSON.parse(fs.readFileSync(banlistPath, 'utf8'));
  return banlist[userId] || false;
}

function hasActiveRegistration(userId) {
  const registrationsPath = path.join(__dirname, '../data/registrations.json');
  const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
  return registrations[userId] || false;
}

function saveRegistration(userId, data) {
  const registrationsPath = path.join(__dirname, '../data/registrations.json');
  const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
  registrations[userId] = data;
  fs.writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));
}

function deleteRegistration(userId) {
  const registrationsPath = path.join(__dirname, '../data/registrations.json');
  const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
  delete registrations[userId];
  fs.writeFileSync(registrationsPath, JSON.stringify(registrations, null, 2));
}

function banUser(userId, reason, moderatorId) {
  const banlistPath = path.join(__dirname, '../data/banlist.json');
  const banlist = JSON.parse(fs.readFileSync(banlistPath, 'utf8'));
  banlist[userId] = {
    reason: reason,
    moderator: moderatorId,
    timestamp: new Date().toISOString()
  };
  fs.writeFileSync(banlistPath, JSON.stringify(banlist, null, 2));
}

function unbanUser(userId) {
  const banlistPath = path.join(__dirname, '../data/banlist.json');
  const banlist = JSON.parse(fs.readFileSync(banlistPath, 'utf8'));
  delete banlist[userId];
  fs.writeFileSync(banlistPath, JSON.stringify(banlist, null, 2));
}

module.exports = {
  isUserBanned,
  hasActiveRegistration,
  saveRegistration,
  deleteRegistration,
  banUser,
  unbanUser
};