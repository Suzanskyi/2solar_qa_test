const BasePage = require('./BasePage');

class PropertyDetailPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Selectors
    this.downloadBrochureLink = this.getByRole('link', { name: 'Download brochure' });
  }

  /**
   * Navigate to a specific property detail page
   * @param {string} propertyPath - The path to the property detail page
   * @returns {Promise<void>}
   */
  async gotoProperty(propertyPath) {
    return super.goto(`detail/${propertyPath}`);
  }

  /**
   * Navigate to the specific property in the issue description
   * @returns {Promise<void>}
   */
  async gotoTestProperty() {
    return super.goto('detail/koop/lienden/huis-vincent-van-goghstraat-2/43957903/');
  }

  /**
   * Click the "Download brochure" link
   * @returns {Promise<void>}
   */
  async clickDownloadBrochure() {
    return this.tryWithTimeout(
      () => this.downloadBrochureLink.click(),
      'Click Download brochure link',
      10000
    );
  }

  /**
   * Check if a file has been downloaded
   * @param {string} downloadPath - The path where downloads are saved
   * @returns {Promise<boolean>} - True if a file has been downloaded, false otherwise
   */
  async verifyFileDownloaded(downloadPath) {
    // Wait a moment for the download to complete
    await this.page.waitForTimeout(3000);
    
    return this.tryWithTimeout(
      async () => {
        // Check if the download path exists and contains files
        const fs = require('fs');
        const path = require('path');
        
        if (!fs.existsSync(downloadPath)) {
          console.error(`Download path ${downloadPath} does not exist`);
          return false;
        }
        
        const files = fs.readdirSync(downloadPath);
        const downloadedFiles = files.filter(file => !file.endsWith('.crdownload'));
        
        console.log(`Found ${downloadedFiles.length} downloaded files in ${downloadPath}`);
        return downloadedFiles.length > 0;
      },
      'Verify file downloaded',
      10000
    );
  }
}

module.exports = PropertyDetailPage;