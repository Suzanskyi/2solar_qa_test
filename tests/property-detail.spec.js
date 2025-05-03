const { test, expect } = require('./fixtures/fixtures');
const path = require('path');
const fs = require('fs');

test('Download brochure from property detail page via extracted URL', async ({ propertyDetailPage, homePage, page, request }) => {
    await propertyDetailPage.gotoTestProperty();

    // Get the actual href of the brochure download link
    const brochureLink = await page.getAttribute('a:has-text("Download brochure")', 'href');
    expect(brochureLink).toBeTruthy();

    const downloadUrl = brochureLink.startsWith('http') ? brochureLink : new URL(brochureLink, page.url()).toString();
    console.log(`Resolved download URL: ${downloadUrl}`);

    // Fetch brochure via API request context
    const response = await request.get(downloadUrl);
    expect(response.ok()).toBeTruthy();

    const buffer = await response.body();
    const filename = 'downloaded_brochure.pdf'; // Adjust based on expected file type or use content-disposition header if needed
    const filePath = path.resolve(__dirname, filename);

    // Write the file to disk
    fs.writeFileSync(filePath, buffer);
    console.log(`File saved at: ${filePath}`);

    // Validate that file exists and has content
    expect(fs.existsSync(filePath)).toBeTruthy();
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);
    console.log(`Downloaded file size: ${stats.size} bytes`);

    // Cleanup
    fs.unlinkSync(filePath);
    console.log('Downloaded file deleted after test');
});
