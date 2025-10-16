const  express = require('express');
const multer = require('multer');
const  { uploadDocument, getAllDocuments , deleteDocument } = require('../controllers/documentController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getAllDocuments);
router.delete('/:id', deleteDocument);


module.exports = router;