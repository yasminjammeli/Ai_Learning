const Document = require("../models/Document");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// upload and process document
const uploadDocument = async (req, res) => {
    try {
        
        const file = req.file;
        let contenu = "";

        if (file.mimetype === "application/pdf") {
            const data = await pdfParse(file.buffer);
            contenu = data.text;
        } else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const data = await mammoth.extractRawText({ buffer: file.buffer });
            contenu = data.value;
        } else {
            contenu = file.buffer.toString('utf-8');
        }

        const newDocument = await Document.create({
            titre: file.originalname,
            contenu: contenu,
            type: file.mimetype
        });

        res.status(201).json(newDocument);
    } catch (error) {
        res.status(500).json({ message: "Error uploading document", error: error.message });
    }
};

const getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents", error: error.message });
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDoc = await Document.findByIdAndDelete(id);
        if (!deletedDoc) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json({ message: "Document deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting document", error: error.message });
    }   
};

module.exports = {
    uploadDocument,
    getAllDocuments,
    deleteDocument

};  

