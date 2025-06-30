const { supabase } = require('../lib/supabaseClient');

// Example: Get all jobs for a user
exports.getJobs = async (req, res) => {
  const userId = req.params.userId;

  const { data: jobs, error } = await supabase
    .from('job')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(jobs);
};
