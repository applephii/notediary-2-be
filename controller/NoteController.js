import { Note, User } from "../model/Model.js";

// read data
async function getNote(req, res) {
    try {
        //all note
        const userId = req.userId;
        const notes = await Note.findAll({ where: { userId } });
        res.status(200).json(notes);
    } catch (error) {
        // console.log(error.message);
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Failed to fetch notes" });
    }
}

// create data
async function createNote(req, res) {
    try {
        const userId = req.userId;
        await Note.create({ ...req.body, userId });

        res.status(201).json({
            success: true,
            message: "Note is successfully added!"
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "Failed to create note" });
    }
}

// update data
async function updateNote(req, res) {
    try {

        const id = req.params.id_note;
        const userId = req.userId;
        const [updatedRows] = await Note.update(req.body, {
            where: { id, userId },
        });
        if (updatedRows === 0) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        res.status(200).json({
            success: true,
            message: "Note is successfully updated!"
        });
    } catch (error) {
        console.log(error.message);
    }
}

// delete data
async function deleteNote(req, res) {
    try {
        const id = req.params.id_note;
        const userId = req.userId;
        const deletedRows = await Note.destroy({ where: { id, userId } });
        if (deletedRows === 0) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        res.status(200).json({
            success: true,
            message: "Note is successfully deleted!"
        });
    } catch (error) {
        console.log(error.message);
    }
}

// get a note (id)
async function getNote1(req, res) {
    
    
    try {
        const id = req.params.id_note;
        const userId = req.userId;
        const note = await Note.findOne({ where: { id, userId } });
        if (!note) {
            return res.status(404).json({ message: "Note not found or unauthorized" });
        }

        res.status(200).json(note);
    } catch (error) {
        console.log(error.message);
    }
}

export { getNote, createNote, updateNote, deleteNote, getNote1 };