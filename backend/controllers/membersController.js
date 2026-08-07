const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, '../church_members.xlsx');

// Helper to get workbook
const getWorkbook = () => {
    if (!fs.existsSync(FILE_PATH)) {
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet([]);
        XLSX.utils.book_append_sheet(wb, ws, 'Members');
        return wb;
    }
    return XLSX.readFile(FILE_PATH);
};

// Helper to save workbook
const saveWorkbook = (wb) => {
    XLSX.writeFile(wb, FILE_PATH);
};

// Helper to get members data
const getMembersData = () => {
    const wb = getWorkbook();
    const ws = wb.Sheets['Members'];
    return XLSX.utils.sheet_to_json(ws) || [];
};

// Get all members
exports.getAllMembers = (req, res) => {
    try {
        const members = getMembersData();
        res.json(members);
    } catch (err) {
        console.error('Error fetching members:', err);
        res.status(500).json({ message: 'Failed to fetch members' });
    }
};

// Add new member
exports.addMember = (req, res) => {
    const { name, age, gender, address, phone, email, dob, membershipDate, notes } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const members = getMembersData();
        const newMember = {
            id: Date.now().toString(), // Simple ID generation
            name,
            age: age || '',
            gender: gender || '',
            address: address || '',
            phone: phone || '',
            email: email || '',
            dob: dob || '',
            membershipDate: membershipDate || '',
            notes: notes || '',
            created_at: new Date().toISOString()
        };

        members.push(newMember);

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(members);
        XLSX.utils.book_append_sheet(wb, ws, 'Members');
        saveWorkbook(wb);

        res.status(201).json({
            message: 'Member added successfully to Excel sheet',
            id: newMember.id
        });
    } catch (err) {
        console.error('Error adding member:', err);
        res.status(500).json({ message: 'Failed to add member' });
    }
};

// Update member
exports.updateMember = (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const members = getMembersData();
        const index = members.findIndex(m => m.id.toString() === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Member not found' });
        }

        members[index] = { ...members[index], ...updates };

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(members);
        XLSX.utils.book_append_sheet(wb, ws, 'Members');
        saveWorkbook(wb);

        res.json({ message: 'Member updated successfully in Excel sheet' });
    } catch (err) {
        console.error('Error updating member:', err);
        res.status(500).json({ message: 'Failed to update member' });
    }
};

// Delete member
exports.deleteMember = (req, res) => {
    const { id } = req.params;

    try {
        let members = getMembersData();
        const initialLength = members.length;
        members = members.filter(m => m.id.toString() !== id);

        if (members.length === initialLength) {
            return res.status(404).json({ message: 'Member not found' });
        }

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(members);
        XLSX.utils.book_append_sheet(wb, ws, 'Members');
        saveWorkbook(wb);

        res.json({ message: 'Member deleted successfully from Excel sheet' });
    } catch (err) {
        console.error('Error deleting member:', err);
        res.status(500).json({ message: 'Failed to delete member' });
    }
};
