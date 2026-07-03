// routes/dsa.js
const express = require('express');
const router = express.Router();
const DSAProblem = require('../models/DSAProblem');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

const getUTCDateKey = (value) => {
  const date = new Date(value);
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    .toISOString()
    .slice(0, 10);
};

const getDayDifference = (dateA, dateB) => {
  const a = new Date(Date.UTC(dateA.getFullYear(), dateA.getMonth(), dateA.getDate()));
  const b = new Date(Date.UTC(dateB.getFullYear(), dateB.getMonth(), dateB.getDate()));
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
};

const calculateStreaks = (uniqueDays) => {
  if (!uniqueDays.length) {
    return { current: 0, max: 0 };
  }

  let maxStreak = 0;
  let currentStreak = 0;
  let streak = 1;

  for (let i = 0; i < uniqueDays.length; i += 1) {
    if (i === 0) {
      streak = 1;
    } else {
      const diff = getDayDifference(
        new Date(`${uniqueDays[i - 1]}T00:00:00Z`),
        new Date(`${uniqueDays[i]}T00:00:00Z`)
      );
      streak = diff === 1 ? streak + 1 : 1;
    }
    maxStreak = Math.max(maxStreak, streak);
  }

  if (uniqueDays[uniqueDays.length - 1] === getUTCDateKey(new Date())) {
    currentStreak = 1;
    for (let i = uniqueDays.length - 2; i >= 0; i -= 1) {
      const diff = getDayDifference(
        new Date(`${uniqueDays[i]}T00:00:00Z`),
        new Date(`${uniqueDays[i + 1]}T00:00:00Z`)
      );
      if (diff === 1) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return { current: currentStreak, max: maxStreak };
};

const normalizeCounts = (map, total) => {
  return Object.keys(map).map((key) => ({
    label: key,
    count: map[key],
    percent: total ? Number(((map[key] / total) * 100).toFixed(1)) : 0,
  }));
};

const buildCurrentMonthRange = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }).map((_, index) => {
    const date = new Date(year, month, index + 1);
    return getUTCDateKey(date);
  });
};

// POST: Add a new problem
router.post('/add', verifyToken, async (req, res) => {
  const { problemName, platform, link, difficulty, topic } = req.body;

  if (!problemName || !platform) {
    return res.status(400).json({ error: 'Problem Name and Platform are required' });
  }

  try {
    const newProblem = new DSAProblem({
      userId: req.user.userId,
      problemName,
      platform,
      link,
      difficulty: difficulty || 'Unknown',
      topic: topic || 'General',
    });

    const savedProblem = await newProblem.save();
    res.status(201).json(savedProblem);
  } catch (err) {
    console.error('Error adding problem:', err);
    res.status(500).json({ error: 'Server error: Failed to add problem' });
  }
});

// GET: Fetch all problems by user
router.get('/', verifyToken, async (req, res) => {
  try {
    const problems = await DSAProblem.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(problems);
  } catch (err) {
    console.error('Error fetching problems:', err);
    res.status(500).json({ error: 'Server error: Failed to fetch problems' });
  }
});

// GET: Paginated solved problem history for the user
router.get('/history', verifyToken, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const [problems, total] = await Promise.all([
      DSAProblem.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      DSAProblem.countDocuments({ userId: req.user.userId }),
    ]);

    res.json({
      problems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (err) {
    console.error('Error fetching solved problem history:', err);
    res.status(500).json({ error: 'Server error: Failed to fetch solved problem history' });
  }
});

// GET: Analytics summary for the user
router.get('/analytics', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('createdAt');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const problems = await DSAProblem.find({ userId: req.user.userId }).sort({ createdAt: 1 });
    const totalSolved = problems.length;
    const todayKey = getUTCDateKey(new Date());

    const dailyCountMap = problems.reduce((acc, item) => {
      const dateKey = getUTCDateKey(item.createdAt);
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    const uniqueDays = Object.keys(dailyCountMap).sort();
    const streaks = calculateStreaks(uniqueDays);
    const accountCreatedKey = user.createdAt
      ? getUTCDateKey(user.createdAt)
      : uniqueDays[0] || todayKey;

    const activeDays = Math.max(
      Math.round(
        (new Date(`${todayKey}T00:00:00Z`).getTime() - new Date(`${accountCreatedKey}T00:00:00Z`).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1,
      1
    );

    const avgPerDay = Number((totalSolved / activeDays || 0).toFixed(2));

    const platformMap = problems.reduce((acc, item) => {
      const key = item.platform || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const difficultyMap = problems.reduce((acc, item) => {
      const key = item.difficulty || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const topicMap = problems.reduce((acc, item) => {
      const key = item.topic || 'General';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const platformDistribution = normalizeCounts(platformMap, totalSolved).sort((a, b) => b.count - a.count);
    const difficultyDistribution = normalizeCounts(difficultyMap, totalSolved).sort((a, b) => b.count - a.count);
    const topicCounts = normalizeCounts(topicMap, totalSolved).sort((a, b) => b.count - a.count);

    const currentMonthDays = buildCurrentMonthRange();
    const dailyTrend = currentMonthDays.map((date) => ({
      date,
      count: dailyCountMap[date] || 0,
    }));

    const recentProblems = [...problems].slice(-5).reverse();
    const topPlatform = platformDistribution[0]?.label || 'N/A';
    const topTopic = topicCounts[0]?.label || 'N/A';

    res.json({
      summary: {
        totalSolved,
        currentStreak: streaks.current,
        maxStreak: streaks.max,
        activeDays,
        avgPerDay,
        topPlatform,
        topTopic,
        totalPlatforms: platformDistribution.length,
        totalTopics: topicCounts.length,
      },
      platformDistribution,
      difficultyDistribution,
      topicCounts,
      dailyTrend,
      recentProblems,
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Server error: Failed to fetch analytics' });
  }
});

// PUT: Update an existing problem
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { problemName, platform, link, difficulty, topic } = req.body;

  try {
    const problem = await DSAProblem.findOneAndUpdate(
      { _id: id, userId: req.user.userId }, // Find by ID and ensure it belongs to the user
      { problemName, platform, link, difficulty: difficulty || 'Unknown', topic: topic || 'General' },
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found or unauthorized' });
    }

    res.json(problem);
  } catch (err) {
    console.error('Error updating problem:', err);
    res.status(500).json({ error: 'Server error: Failed to update problem' });
  }
});

// DELETE: Delete a problem
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await DSAProblem.findOneAndDelete({ _id: id, userId: req.user.userId });

    if (!problem) {
      return res.status(404).json({ error: 'Problem not found or unauthorized' });
    }

    res.status(200).json({ message: 'Problem deleted successfully' });
  } catch (err) {
    console.error('Error deleting problem:', err);
    res.status(500).json({ error: 'Server error: Failed to delete problem' });
  }
});

module.exports = router;
