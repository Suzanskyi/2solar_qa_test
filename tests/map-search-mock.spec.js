const { test, expect } = require('./fixtures/fixtures');

test.describe('Map Search with Mocked Data', () => {
    test('should display mocked property listings', async ({ mapSearchPage, page }) => {
        // Mock response data
        const mockPropertyData = {
            objects: [
                {
                    id: '123456',
                    address: 'Test Street 1',
                    price: 450000,
                    livingArea: 150,
                    rooms: 4,
                    image: 'https://example.com/image1.jpg',
                    coordinates: {
                        lat: 51.4601,
                        lng: 5.6372
                    }
                },
                {
                    id: '789012',
                    address: 'Test Street 2',
                    price: 550000,
                    livingArea: 200,
                    rooms: 5,
                    image: 'https://example.com/image2.jpg',
                    coordinates: {
                        lat: 51.4602,
                        lng: 5.6373
                    }
                }
            ],
            totalCount: 2
        };

        // Intercept API requests
        await page.route('**/api/v1/zoeken/kaart/koop*', async (route) => {
            // Log the intercepted request
            console.log('Intercepted request:', route.request().url());
            
            // Mock the response
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPropertyData)
            });
        });

        await mapSearchPage.goto();

        const propertyElements = await page.locator('[data-test-id="property-marker"]').all();
        expect(propertyElements.length).toBe(2);

        const firstProperty = await page.locator('[data-test-id="property-marker"]').first();
        await firstProperty.hover();
        
        await page.waitForSelector('[data-test-id="property-popup"]');
        
        const propertyAddress = await page.locator('[data-test-id="property-popup"] [data-test-id="property-address"]').textContent();
        expect(propertyAddress).toContain('Test Street 1');

        const propertyPrice = await page.locator('[data-test-id="property-popup"] [data-test-id="property-price"]').textContent();
        expect(propertyPrice).toContain('€ 450.000');

        const markers = await page.locator('[data-test-id="map-marker"]').all();
        expect(markers.length).toBe(2);
    });

    test('should handle API errors gracefully', async ({ mapSearchPage, page }) => {
        // Intercept API requests and return an error
        await page.route('**/api/v1/zoeken/kaart/koop*', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({
                    error: 'Internal Server Error',
                    message: 'Something went wrong'
                })
            });
        });

        await mapSearchPage.goto();

        const errorMessage = await page.locator('[data-test-id="error-message"]').textContent();
        expect(errorMessage).toContain('Er is iets misgegaan');
    });

    test('should handle empty results', async ({ mapSearchPage, page }) => {
        // Intercept API requests and return empty results
        await page.route('**/api/v1/zoeken/kaart/koop*', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    objects: [],
                    totalCount: 0
                })
            });
        });

        await mapSearchPage.goto();

        // Verify no results message is displayed
        const noResultsMessage = await page.locator('[data-test-id="no-results-message"]').textContent();
        expect(noResultsMessage).toContain('Geen resultaten gevonden');
    });
}); 