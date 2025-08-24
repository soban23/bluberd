import {supabase} from '@/lib/supabaseClient';

export async function uploadPostImage(postId: string, file: File) {
  const filePath = `post-images/${postId}_${file.name}`

  const { error: uploadError } = await supabase.storage
    .from('post-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(filePath)

  const postUrl = urlData.publicUrl

  

  return postUrl
}
