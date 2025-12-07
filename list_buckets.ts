
import { createClient } from './src/lib/supabase/server';

async function listBuckets() {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.listBuckets();
  if (error) console.error('Error:', error);
  else console.log('Buckets:', data?.map(b => b.name));
}

listBuckets();

