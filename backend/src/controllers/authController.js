const { supabase } = require('../lib/supabaseClient');

exports.login = async (req, res) => {
  const { email } = req.body;

  const { data: user, error } = await supabase
    .from('user')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json(user);
};
