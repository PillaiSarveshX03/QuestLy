// server/utils/awardXp.js
const User = require('../models/User');

async function awardXp(userId, amount) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.xp += amount;
  let leveledUp = false;

  // Level Threshold = Level * 100 XP
  while (user.xp >= user.level * 100) {
    user.xp -= user.level * 100;
    user.level += 1;
    leveledUp = true;
  }

  await user.save();
  return { user, leveledUp };
}

module.exports = awardXp;