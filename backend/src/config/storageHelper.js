const supabaseAdmin = require('./supabaseAdminClient');

const getSignedUrlIfNeeded = async (urlOrPath) => {
  if (!urlOrPath) return null;
  
  // If it's already a signed URL (contains token=), return as is
  if (urlOrPath.includes('token=')) {
    return urlOrPath;
  }
  
  // Try to extract the relative storage path
  let storagePath = urlOrPath;
  if (urlOrPath.startsWith('http')) {
    try {
      const decodeUrl = decodeURIComponent(urlOrPath);
      const searchStr = 'Deposit Proof/';
      const index = decodeUrl.indexOf(searchStr);
      if (index !== -1) {
        storagePath = decodeUrl.substring(index + searchStr.length);
      } else {
        // Fallback: try parsing with split
        const parts = urlOrPath.split('/Deposit%20Proof/');
        if (parts.length > 1) {
          storagePath = decodeURIComponent(parts[1]);
        } else {
          return urlOrPath;
        }
      }
    } catch (e) {
      console.error('Error parsing URL in getSignedUrlIfNeeded:', e);
      return urlOrPath;
    }
  }
  
  try {
    const { data, error } = await supabaseAdmin
      .storage
      .from('Deposit Proof')
      .createSignedUrl(storagePath, 60 * 60 * 24 * 7); // 7 days expiry
    
    if (error) {
      console.error('Error signing path:', storagePath, error.message);
      return urlOrPath; // fallback
    }
    return data.signedUrl;
  } catch (err) {
    console.error('Error in getSignedUrlIfNeeded:', err);
    return urlOrPath;
  }
};

module.exports = { getSignedUrlIfNeeded };
