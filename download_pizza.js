const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47",
  "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50",
  "https://images.unsplash.com/photo-1590947132387-15dcd02e6488",
  "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee",
  "https://images.unsplash.com/photo-1528605248644-14dd04cb220b",
  "https://images.unsplash.com/photo-1628840042765-356cda07504e",
  "https://images.unsplash.com/photo-1588315029754-2dd089d39a1a",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
  "https://images.unsplash.com/photo-1510739859556-307ca6ef2caf",
  "https://images.unsplash.com/photo-1595708684082-a173bb3a06c5",
  "https://images.unsplash.com/photo-1601924582970-9238bed497a9",
  "https://images.unsplash.com/photo-1544982503-9f984c14501a",
  "https://images.unsplash.com/photo-1594007654729-407eedc4be65",
  "https://images.unsplash.com/photo-1585238342024-78d387f4a742",
  "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e",
  "https://images.unsplash.com/photo-1555072956-775aafd92305",
  "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c",
  "https://images.unsplash.com/photo-1581873372796-635b67ca2008",
  "https://images.unsplash.com/photo-1593246049226-d773950d9904",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d"
];

const dest = "c:\\Users\\raval\\Desktop\\PizzaPurchasing\\frontend\\src\\assets\\images";

if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
}

async function download(url, filename) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path.join(dest, filename));
        // Use a common user-agent to avoid 403/404 from Unsplash CDN
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        https.get(url + "?auto=format&fit=crop&w=800&q=80", options, (response) => {
            if (response.statusCode === 302 || response.statusCode === 301) {
                https.get(response.headers.location, options, (redirResponse) => {
                    redirResponse.pipe(file);
                    file.on('finish', () => {
                        file.close();
                        resolve();
                    });
                });
            } else if (response.statusCode !== 200) {
                reject(new Error(`Status Code: ${response.statusCode}`));
            } else {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }
        }).on('error', (err) => {
            fs.unlink(path.join(dest, filename), () => {});
            reject(err);
        });
    });
}

(async () => {
    console.log("Starting unique downloads...");
    for (let i = 0; i < urls.length; i++) {
        // Use a different prefix to avoid overwriting the previous 20 if needed, 
        // or just use unique_pizza_ to be clear.
        const filename = `unique_pizza_${i + 1}.jpg`;
        process.stdout.write(`Downloading ${filename}... `);
        try {
            await download(urls[i], filename);
            console.log("Done");
        } catch (err) {
            console.log(`Failed: ${err.message}`);
        }
    }
    console.log("Finished all unique downloads.");
})();
