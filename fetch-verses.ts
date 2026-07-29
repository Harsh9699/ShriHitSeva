import https from 'https';

const url1 = 'https://bhaktipath.wordpress.com/2025/03/29/%E0%A5%A3%E0%A5%A6%E0%A5%AF-%E0%A5%A5-%E0%A4%AD%E0%A4%95%E0%A5%8D%E0%A4%A4-%E0%A4%A8%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%B2%E0%A5%80-%E0%A4%B9%E0%A4%BF%E0%A4%A4-%E0%A4%A7%E0%A5%8D%E0%A4%B0/';
const url2 = 'https://bhaktipath.wordpress.com/2025/03/29/%e0%a5%a3%e0%a5%a6%e0%a5%af-%e0%a5%a5-%e0%a4%ad%e0%a4%95%e0%a5%8d%e0%a4%a4-%e0%a4%a8%e0%a4%be%e0%a4%ae%e0%a4%be%e0%a4%b2%e0%a5%80-%e0%a4%b9%e0%a4%bf%e0%a4%a4-%e0%a4%a7%e0%a5%8d%e0%a4%b0/';

function fetchPage(url: string) {
  console.log("Fetching:", url);
  https.get(url, (res) => {
    console.log("Status:", res.statusCode);
    if (res.headers.location) {
      console.log("Redirects to:", res.headers.location);
      fetchPage(res.headers.location);
      return;
    }
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log("Bytes fetched:", data.length);
      const cleanContent = data.replace(/<[^>]*>/g, '\n');
      const lines = cleanContent.split('\n').map(l => l.trim()).filter(Boolean);
      console.log("Lines count:", lines.length);
      
      // Let's print any lines starting with a number and containing 'व्यास' or 'हरिवंश' or around them
      // Or let's print lines 100 to 250 of the cleaned page content where the main verses usually reside
      for (let idx = 0; idx < lines.length; idx++) {
        const line = lines[idx];
        if (line.includes('व्यास') || line.includes('लड़ैती') || line.includes('मीरा') || line.includes('लड़ाइ')) {
          console.log(`--- MATCH at ${idx}: ${line}`);
          for (let j = Math.max(0, idx - 15); j <= Math.min(lines.length - 1, idx + 20); j++) {
            console.log(`[${j}] ${lines[j]}`);
          }
          console.log("--------------------------------");
          break; // only print first match to avoid clutter
        }
      }
    });
  }).on('error', (err) => {
    console.error("Error:", err);
  });
}

fetchPage(url1);
