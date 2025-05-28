import express from "express";
import { createNote, deleteNote, getNote, getNote1, updateNote } from "../controller/NoteController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const noteRouter = express.Router();

noteRouter.get("/notes", verifyToken, getNote);
noteRouter.post("/add-note", verifyToken, createNote);
noteRouter.put("/edit-note/:id_note", verifyToken, updateNote);
noteRouter.delete("/delete-note/:id_note", verifyToken, deleteNote);
noteRouter.get("/note/:id_note", verifyToken, getNote1);


export default noteRouter;