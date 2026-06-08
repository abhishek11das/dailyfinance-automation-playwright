import { test, expect } from '@playwright/test';
import LoginPage from '../Pages/LoginPage';
import AddItemsPage from '../Pages/AddItemsPage';
import ProfilePage from '../Pages/ProfilePage';
import RegisterPage from '../Pages/RegisterPage';
import jsonData from '../Utils/userData.json' assert { type: 'json' };
import { generateRandomID, randomFutureDate } from '../Utils/utils';
import { faker } from '@faker-js/faker';
import fs from 'fs';
// Reset password tests removed - related helpers deleted

let login, addItemsPage, profilePage, reg;
let page, context;

// Helper for random food name
function randomFoodName() {
    const foods = [
        'Pizza', 'Burger', 'Sushi', 'Pasta', 'Sandwich', 'Salad', 'Taco', 'Biryani', 'Noodles', 'Dumpling',
        'Steak', 'Curry', 'IceCream', 'Donut', 'Paneer'
    ];
    const randomIndex = Math.floor(Math.random() * foods.length);
    return foods[randomIndex] + '-' + Math.floor(Math.random() * 1000);
}

// Serial describe ensures order
test.describe.serial('Full User Flow', () => {

    async function initPageObjects(page) {
        login = new LoginPage(page);
        addItemsPage = new AddItemsPage(page);
        profilePage = new ProfilePage(page);
        reg = new RegisterPage(page);
    }

    // Only initialize page objects, no login
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await initPageObjects(page);
    });

    // Helper to login when needed
    async function loginLastUser(page) {
        const latestData = jsonData[jsonData.length - 1];
        await login.doLogin(latestData.email, latestData.password, { waitUntil: 'networkidle' });
    }
    // ===== Register Test (Last) =====
    //Test Case 1
    test("User using existing Email", async ({ page }) => {
        await expect(
            page.getByRole('heading', { name: 'Welcome to daily finance' })
        ).toBeVisible();

        reg = new RegisterPage(page)

        const userData = {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: `abhishek@gmail.com`,
            password: faker.internet.password({
                length: 10,
                memorable: false
            }),
            phonenumber: `018${generateRandomID(10000000, 99999999)}`,
            address: faker.location.city()
        };

        await reg.doRegister(userData)

        const toast = page.getByRole('alert');

        // auto-wait + visibility
        await expect(toast).toBeVisible({ timeout: 40000 });

        const msg = await toast.textContent('email address already exists.');
        console.log('Toast message:', msg);
    })
    //Test Case 2
    test("User using mandatory field", async ({ page }) => {
        await expect(
            page.getByRole('heading', { name: 'Welcome to daily finance' })
        ).toBeVisible();

        reg = new RegisterPage(page)

        const userData = {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: `abhishek${generateRandomID(1000, 9999)}@gmail.com`,
            password: faker.internet.password({
                length: 10,
                memorable: false
            }),
            phonenumber: `018${generateRandomID(10000000, 99999999)}`,
        };

        await reg.doRegister(userData)

        const toast = page.getByRole('alert');

        // auto-wait + visibility
        await expect(toast).toBeVisible({ timeout: 40000 });

        const msg = await toast.textContent('successfully!');
        console.log('Toast message:', msg);
    })
    //Test Case 3
    test("User successfully register with all field", async ({ page }) => {
        await expect(
            page.getByRole('heading', { name: 'Welcome to daily finance' })
        ).toBeVisible();

        reg = new RegisterPage(page)

        const userData = {
            firstname: faker.person.firstName(),
            lastname: faker.person.lastName(),
            email: `abhishek${generateRandomID(1000, 9999)}@gmail.com`,
            password: faker.internet.password({
                length: 10,
                memorable: false
            }),
            phonenumber: `018${generateRandomID(10000000, 99999999)}`,
            address: faker.location.city()
        };

        await reg.doRegister(userData)

        const toast = page.getByRole('alert');

        // auto-wait + visibility
        await expect(toast).toBeVisible({ timeout: 40000 });

        const msg = await toast.textContent('successfully!');
        console.log('Toast message:', msg);

        //Save the user data to a JSON file
        jsonData.push(userData)
        fs.writeFileSync('./Utils/userData.json', JSON.stringify(jsonData, null, 2));
    })

    // ===== LOGIN TEST CASES =====
    //Test Case 4
    test('User Login with Invalid Email and Valid Password', async ({ page }) => {
        await expect(
            page.getByRole('heading', { name: 'Welcome to daily finance' })
        ).toBeVisible();

        const userData = () => {
            return {
                email: "abhishek231@gmail.com",
                password: "1234"

            };
        };

        login = new LoginPage(page);

        const { email, password } = userData();

        await login.doLogin(email, password)

        //Assertion
        const actualText = page.getByRole('paragraph');
        const expectedText = "Invalid email or password";
        await expect(actualText).toHaveText(expectedText);
    })

    //Test Case 5
    test('User Login with Valid Email and Invalid Password', async ({ page }) => {
        await expect(
            page.getByRole('heading', { name: 'Welcome to daily finance' })
        ).toBeVisible();

        const userData = () => {
            return {
                email: "abhishek@gmail.com",
                password: "123456"

            };
        };

        login = new LoginPage(page);

        const { email, password } = userData();

        await login.doLogin(email, password)

        //Assertion
        const actualText = page.getByRole('paragraph');
        const expectedText = "Invalid email or password";
        await expect(actualText).toHaveText(expectedText);
    })

    //Test case 6
    test('User Login successfully', async ({ page }) => {
        await expect(
            page.getByRole('heading', { name: 'Welcome to daily finance' })
        ).toBeVisible();

        const latestData = jsonData[jsonData.length - 1]

        login = new LoginPage(page);

        await login.doLogin(latestData.email, latestData.password)

        // 🔥 Dynamic wait (no hard timer)
        await page.waitForLoadState('networkidle');

        //Assertion
        const actualText = page.getByRole('banner');
        const expectedText = "Dashboard";
        await expect(actualText).toHaveText(expectedText);
    })

    // ===== Add Item Tests =====
    //Test case 7
    test("User can reset input", async ({ page }) => {
        // Login first
        await loginLastUser(page);

        await addItemsPage.btnAddCost.click();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        // Generate 1 random items
        const item = {
            itemname: `Item-${randomFoodName()}`,
            amount: `${generateRandomID(100, 999)}`,
            date: randomFutureDate(),
            month: months[Math.floor(Math.random() * months.length)],
            remarks: 'Item 1'
        }

        // Fill the form without clicking Submit
        await addItemsPage.addNewCost(item.itemname, item.amount, item.remarks, item.date, item.month);

        // Click Reset
        await addItemsPage.btnReset.click();
    })

    // Test case 8
test("User add item", async ({ page }) => {

    // Login first
    await loginLastUser(page);

    addItemsPage = new AddItemsPage(page);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Generate 2 random items
    const items = [
        {
            itemname: `Item-${randomFoodName()}`,
            amount: `${generateRandomID(100, 999)}`,
            date: randomFutureDate(),
            month: months[Math.floor(Math.random() * months.length)],
            remarks: 'Item 1'
        },
        {
            itemname: `Item-${randomFoodName()}`,
            amount: `${generateRandomID(100, 999)}`,
            date: randomFutureDate(),
            month: months[Math.floor(Math.random() * months.length)],
            remarks: 'Item 2'
        }
    ];

    // Add items
    for (const item of items) {

        await addItemsPage.addNewCost(
            item.itemname,
            item.amount,
            item.remarks,
            item.date,
            item.month
        );

        await addItemsPage.btnSubmit.click();

        // Wait for item to appear before proceeding
        await expect(
            page.getByText(item.itemname)
        ).toBeVisible({ timeout: 10000 });
    }

    // Dynamic assertion using text/content
    for (const item of items) {

        const row = page.locator('tbody tr', {
            has: page.locator('td', { hasText: item.itemname })
        }).first();

        await expect(row).toHaveCount(1, { timeout: 10000 });

        const cells = row.locator('td');

        await expect(cells.nth(0)).toHaveText(item.itemname);
        await expect(cells.nth(2)).toHaveText(item.amount);
        await expect(cells.nth(5)).toHaveText(item.remarks);
    }
});
    // //Test case 8
    // test("User add item", async ({ page }) => {
    //     // Login first
    //     await loginLastUser(page);
    //     await addItemsPage.btnAddCost.click();
    //     addItemsPage = new AddItemsPage(page);
    //     const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    //     // Generate 2 random items
    //     const items = [
    //         {
    //             itemname: `Item-${randomFoodName()}`,
    //             amount: `${generateRandomID(100, 999)}`,
    //             date: randomFutureDate(),
    //             month: months[Math.floor(Math.random() * months.length)],
    //             remarks: 'Item 1'
    //         },
    //         {
    //             itemname: `Item-${randomFoodName()}`,
    //             amount: `${generateRandomID(100, 999)}`,
    //             date: randomFutureDate(),
    //             month: months[Math.floor(Math.random() * months.length)],
    //             remarks: 'Item 2'
    //         }
    //     ];

    //     // Add items
    //     for (const item of items) {
    //         await addItemsPage.addNewCost(item.itemname, item.amount, item.remarks, item.date, item.month);
    //         await addItemsPage.btnSubmit.click();
    //     }

    //     // Dynamic assertion using text/content
    //     for (const item of items) {
    //         // Locate the row by item name only
    //         const row = page.locator('tbody tr', {
    //             has: page.locator('td', { hasText: item.itemname })
    //         }).first();

    //         // Wait until row exists
    //         await expect(row).toHaveCount(1, { timeout: 10000 });

    //         // Get all cells in that row
    //         const cells = row.locator('td');

    //         // Assert each detail dynamically
    //         await expect(cells.nth(0)).toHaveText(item.itemname); // Item Name
    //         await expect(cells.nth(2)).toHaveText(item.amount);   // Amount
    //         await expect(cells.nth(5)).toHaveText(item.remarks);  // Remarks
    //     }
    // })
    //Test case 9
    test("User search invalid item", async ({ page }) => {
        // Login first
        await loginLastUser(page);
        // Fill the search box with an invalid item
        await addItemsPage.searchBox.fill('assa');

        // Assert that the table shows "No costs found."
        const noCostsMessage = page.locator('tbody tr', { hasText: 'No costs found.' });
        await expect(noCostsMessage).toHaveText('No costs found.');
    })
    //Test case 10
    test("User search valid item", async ({ page }) => {
        // Login first
        await loginLastUser(page, { timeout: 10000 });

        const firstRow = page.locator('tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 15000 });

        const firstCell = firstRow.locator('td').first();
        const itemName = (await firstCell.innerText()).trim();

        // Safety Check
        expect(itemName.length).toBeGreaterThan(0);
        console.log(`Searching for item: ${itemName}`);

        // ৪. Clear searchbox
        await addItemsPage.searchBox.clear();
        await addItemsPage.searchBox.fill(itemName);

        await page.waitForTimeout(1000);

        // Assertion Check
        const resultCell = page.locator('tbody tr').first().locator('td').first();
        await expect(resultCell).toHaveText(itemName, { timeout: 10000 });
    })

    //Test case 11
// test("User can edit Item", async ({ page }) => {
//     // Login
//     await loginLastUser(page);

//     // Ensure table is loaded
//     await expect(addItemsPage.tableRows.first()).toBeVisible({ timeout: 10000 });

//     // Pick random row
//     const rowCount = await addItemsPage.tableRows.count();
//     expect(rowCount).toBeGreaterThan(0); // safety guard

//     const selectedRow = addItemsPage.tableRows.nth(
//         Math.floor(Math.random() * rowCount)
//     );

//     const uniqueRemark = `TestEdit-${Date.now()}`;

//     // Open edit
//     await selectedRow.locator('text=View').click();
//     await addItemsPage.btnEdit.click();

//     // Update only remark
//     await addItemsPage.txtRemarks.fill(uniqueRemark);

//     // Handle dialog + update click
//     const [dialog] = await Promise.all([
//         page.waitForEvent('dialog'),
//         addItemsPage.btnUpdate.click()
//     ]);

//     expect(dialog.message()).toContain("Cost details updated successfully");
//     await dialog.accept();

//     // Back to list
//     await addItemsPage.btnBack.click();

//     // 🔥 IMPORTANT: wait for table to re-render properly
//     await addItemsPage.tableRows.first().waitFor({ state: 'visible', timeout: 15000 });

//     // ✅ BEST PRACTICE: WAIT FOR THE UPDATED ROW (not count check)
//     const updatedRow = page.locator('tbody tr', {
//         hasText: uniqueRemark
//     });

//     await expect(updatedRow).toBeVisible({ timeout: 15000 });

//     await expect(updatedRow.locator('td')).toContainText(uniqueRemark);
// });
    // //Test case 11
    // test("User can edit Item", async ({ page }) => {
    //     // 1️⃣ Login
    //     await loginLastUser(page);

    //     // Wait until at least 1 row is visible
    //     await expect(addItemsPage.tableRows.first()).toBeVisible({ timeout: 10000 });

    //     // Select Random Row
    //     const rowCount = await addItemsPage.tableRows.count();
    //     const randomIndex = Math.floor(Math.random() * rowCount);
    //     const selectedRow = addItemsPage.tableRows.nth(randomIndex);

    //     // Check Present Data (Optional)
    //     const initialText = await selectedRow.innerText();
    //     console.log("Before Edit:", initialText);

    //     // Go TO Edit Mode
    //     await selectedRow.locator('text=View').click();
    //     await addItemsPage.btnEdit.click();

    //     // New Value Generate
    //     const newAmount = generateRandomID(100, 999).toString();
    //     const uniqueRemark = `TestEdit-${Date.now()}`;

    //     // Alert Handling (It must be set before clicking)
    //     page.once('dialog', async dialog => {
    //         console.log(`Alert Message: ${dialog.message()}`);
    //         await dialog.accept();
    //     });

    //     // Filed Update and Click update
    //     await addItemsPage.txtAmount.fill(newAmount);
    //     await addItemsPage.txtRemarks.fill(uniqueRemark);
    //     await addItemsPage.btnUpdate.click();

    //     // Wait briefly after the alert appears and the processing finishes before clicking the Back button.
    //     await page.waitForTimeout(1000); // Buffer time for the alert to close
    //     await addItemsPage.btnBack.click();

    //     // Dynamic Row Select
    //     const updatedRow = page.locator('tr', { hasText: uniqueRemark });

    //     // Final Assertion
    //     await expect(updatedRow).toBeVisible({ timeout: 15000 });
    //     await expect(updatedRow).toContainText(newAmount);
    //     await expect(updatedRow).toContainText(uniqueRemark);
    // })

    //Test case 12
    test("User can delete Item", async ({ page }) => {
        // Login first
        await loginLastUser(page);

        // Wait until at least 1 row is visible
        await expect(addItemsPage.tableRows.first()).toBeVisible({ timeout: 10000 });

        // Total rows BEFORE delete
        const totalBeforeText = await page.locator('text=Total Rows:').innerText();
        const totalBefore = Number(totalBeforeText.replace(/\D/g, ''));
        console.log("Before delete:", totalBefore);

        // Random row selection
        const randomIndex = Math.floor(Math.random() * totalBefore);
        const selectedRow = addItemsPage.tableRows.nth(randomIndex);

        // Get item name
        const itemName = (await selectedRow.locator('td').first().innerText()).trim();
        expect(itemName).toBeTruthy();

        // Open modal
        await selectedRow.locator('text=View').click();

        // Handle confirmation dialog
        page.once('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm');
            await dialog.accept();
        });

        // Click delete
        await addItemsPage.btnDelete.click();

        // Wait until row count decreases
        await expect(addItemsPage.tableRows)
            .toHaveCount(totalBefore - 1, { timeout: 15000 });

        // Final verification via label
        const totalAfterText = await page.locator('text=Total Rows:').innerText();
        const totalAfter = Number(totalAfterText.replace(/\D/g, ''));
        expect(totalAfter).toBe(totalBefore - 1);
    })

    // ===== Update Profile Test =====
    //Test Case 13
    test("User can update Profile but profile image upload failed", async ({ page }) => {
        // Login first
        await loginLastUser(page);
        // Invlaid FIle
        const imagePath = "./Fixtures/Looking.webp";

        // Profile Edit Mode
        await profilePage.iconProfile.click();
        await profilePage.profileMenuItems.nth(0).click();
        await profilePage.btnEdit.click();

        // Input Fillup and Upload
        await profilePage.chooseFileInput.setInputFiles(imagePath);
        await profilePage.btnUpload.click();

        // Assertion
        await expect(profilePage.errorMsg).toBeVisible({ timeout: 10000 });
        const errorText = await profilePage.errorMsg.textContent();
        expect(errorText).toContain("Failed to upload image.");
    })
    //Test Case 14
    test("User can update Profile", async ({ page }) => {
        // Login first
        await loginLastUser(page);

        const imagePath = "./Fixtures/Spurs.jpg";
        const { uploadMessage } = await profilePage.updateProfile(imagePath);

        const address = faker.location.streetAddress();

        // ২. New input added
        await profilePage.txtAddress.clear();
        await profilePage.txtAddress.fill(address);

        // ৩. Click Save button
        const updateMessage = await profilePage.saveProfile();

        // ৪. Assertions
        expect(uploadMessage).toContain('Image uploaded successfully!');
        expect(updateMessage).toContain('User updated successfully!');

        // ৫. New address check
        await expect(profilePage.txtAddress).toHaveValue(address);
    })
    //Test Case 15
    test("User can logout", async ({ page }) => {
        // Login first
        await loginLastUser(page);
        await profilePage.iconProfile.click();
        await profilePage.profileMenuItems.nth(1).click();

        //Assertion for Logout
        const actualText = page.locator('#root')
        const expectedText = "Login";
        await expect(actualText).toContainText(expectedText);
    })

});

