class AddItemsPage {
    constructor(page) {
        this.page = page;

        this.btnAddCost = page.getByRole('button', { name: 'Add Cost' });
        this.txtItem = page.getByRole('textbox', { name: 'Item Name' });
        this.iconPlus = page.getByRole('button', { name: '+' });
        this.txtAmount = page.getByRole('spinbutton', { name: 'Amount' });
        this.purchaseDate = page.getByRole('textbox', { name: 'Purchase Date' })
        this.dropdownMonth = page.getByLabel('Month')
        this.txtRemarks = page.getByRole('textbox', { name: 'Remarks' })
        this.btnSubmit = page.getByRole('button', { name: 'Submit' });
        this.btnReset = page.getByRole('button', { name: 'Reset' });
        this.searchBox = page.getByRole('textbox', { name: 'Search items...' });
        this.linkView = page.getByRole('button', { name: 'View' });
        this.btnEdit = page.getByRole('button', { name: 'Edit' });
        this.btnDelete = page.getByRole('button', { name: 'Delete' });
        this.tableRows = page.locator('tbody tr');
        this.btnUpdate = page.getByRole('button', { name: 'Update' });
        this.btnBack= page.getByRole('button', { name: 'Back' });
        this.tableRows = page.locator('tbody tr');
    }

    async addNewCost(itemname, amount, remarks, date, month) {
        // Check if the form is already open by testing if Item Name textbox is visible
        let itemLocator = this.page.getByRole('textbox', { name: 'Item Name' });
        const isFormOpen = await itemLocator.isVisible().catch(() => false);
        
        // Only click Add Cost button if the form is not already open
        if (!isFormOpen) {
            await this.btnAddCost.click();
            // Re-query itemLocator after DOM changes to avoid stale element reference
            itemLocator = this.page.getByRole('textbox', { name: 'Item Name' });
        }

        // Ensure the Item Name textbox is visible and stable, then fill it.
        await itemLocator.waitFor({ state: 'visible', timeout: 5000 });
        await itemLocator.fill(itemname);

        // Trigger any UI that reveals the Amount field, then wait and fill it.
        await this.iconPlus.click();
        const amountLocator = this.page.getByRole('spinbutton', { name: 'Amount' });
        await amountLocator.waitFor({ state: 'visible', timeout: 10000 });
        await amountLocator.fill(String(amount));

        // Fill Purchase Date and Month with fresh locators and small timeouts.
        const dateLocator = this.page.getByRole('textbox', { name: 'Purchase Date' });
        await dateLocator.waitFor({ state: 'visible', timeout: 5000 });
        await dateLocator.fill(date);

        const monthLocator = this.page.getByLabel('Month');
        await monthLocator.waitFor({ state: 'visible', timeout: 5000 });
        await monthLocator.selectOption({ label: month });

        const remarksLocator = this.page.getByRole('textbox', { name: 'Remarks' });
        await remarksLocator.waitFor({ state: 'visible', timeout: 3000 });
        await remarksLocator.fill(remarks);
    }
}
export default AddItemsPage;