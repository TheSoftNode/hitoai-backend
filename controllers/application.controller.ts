import multer from 'multer';
import { Request, Response } from 'express';
import path from 'path';
import Email from '../emails/email';
import catchAsync from '../utils/catchAsync';

// Configure multer to store files with the original name in the uploads folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save to the 'uploads/' directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with unique name
    }
});

// Use multer with the customized storage configuration
export const upload = multer({ storage }).single('cv'); // Changed to single('cv')

export const submitApplication = catchAsync(async (req: Request, res: Response) => {
    try {
        const { fullName, email, phone, interests } = req.body;
        const cvFile = req.file; // Changed from req.files to req.file
        console.log(cvFile.fieldname, cvFile.originalname)

        let cvAttachment = null;
        if (cvFile) {
            cvAttachment = {
                ...cvFile,
                path: `${req.protocol}://${req.get('host')}/uploads/${cvFile.filename}`,
            };
        }

        const from = `${fullName}<${email}>`;
        const to = "fstatazizi@gmail.com";

        const data = {
            applicant: { fullName, email, phone, interests },
            cvAttachment
        };

        // Create an instance of your Email class and send the email
        const sendMail = new Email(to, data, from);
        const sendMailToApplicant = new Email(email, data, to);

        // Send the email with CV attachment
        await sendMail.send("new-application.ejs", "New EEP Application", cvAttachment ? [cvAttachment] : []);
        await sendMailToApplicant.send("message-applicant.ejs", "Thank you for applying to EEP 🎉");

        res.status(200).json({
            status: "success",
            message: "Thank you for applying! We'll review your application and get back to you soon."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to submit application." });
    }
});