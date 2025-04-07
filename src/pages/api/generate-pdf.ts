import type { NextApiRequest, NextApiResponse } from 'next';
import { generateLatexResume, VisibilityOptions } from '../../app/components/resume/latexGenerator';
import type { AppState } from '../../app/components/resume/resumeEditor';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import os from 'os';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure this is a POST request
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  let tempDir: string | null = null;

  try {
    // Extract resumeData and visibilityOptions from the request body
    const { resumeData, visibilityOptions } = req.body;
    let state: AppState;

    // Handle both old and new request formats
    if (resumeData && typeof resumeData === 'object') {
      // New format with separate resumeData and visibilityOptions
      state = resumeData;
    } else {
      // Legacy format where the entire body is the AppState
      state = req.body;
    }

    // Basic validation of the incoming state
    if (!state || typeof state !== 'object' || !state.sections || !state.contact) {
      return res.status(400).json({ message: 'Invalid request body: Incomplete or malformed AppState received.' });
    }

    // 1. Generate LaTeX content using the imported function with visibility options if provided
    const latexContent = generateLatexResume(
      state, 
      visibilityOptions as VisibilityOptions | undefined
    );

    // 2. Create a unique temporary directory for compilation files
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'resume-pdf-'));
    const texFileName = 'resume.tex';
    const pdfFileName = 'resume.pdf';
    const logFileName = 'resume.log';
    const texFilePath = path.join(tempDir, texFileName);
    const pdfFilePath = path.join(tempDir, pdfFileName);
    const logFilePath = path.join(tempDir, logFileName);

    // 3. Write the generated LaTeX content to the .tex file
    await fs.writeFile(texFilePath, latexContent);

    // 4. Run pdflatex command. Running it twice often resolves cross-referencing issues.
    // -interaction=nonstopmode prevents pdflatex from stopping on errors.
    // We run it within the temporary directory (cwd).
    const latexCommand = `/Library/TeX/texbin/pdflatex -interaction=nonstopmode -output-directory="${tempDir}" "${texFilePath}"`;
    try {
        console.log(`Running LaTeX command (Pass 1): ${latexCommand}`);
        await execPromise(latexCommand, { cwd: tempDir });
        console.log(`First pdflatex pass completed in ${tempDir}.`);

        // Check if log file exists after first pass before second pass
        try {
            await fs.access(logFilePath);
        } catch {
            console.warn(`Log file ${logFilePath} not found after first pass. Proceeding with second pass.`);
        }

        console.log(`Running LaTeX command (Pass 2): ${latexCommand}`);
        await execPromise(latexCommand, { cwd: tempDir });
        console.log(`Second pdflatex pass completed in ${tempDir}.`);
    } catch (error: any) {
        console.error('LaTeX compilation error:', error);
        let logContent = 'Could not read log file.';
        try {
            // Attempt to read the log file for debugging info
            logContent = await fs.readFile(logFilePath, 'utf-8');
            console.error('LaTeX Log File Content (Last 1000 chars):');
            console.error(logContent.slice(-1000));
        } catch (logError) {
            console.error('Failed to read log file:', logError);
        }
        
        // Check if a PDF was still produced despite the error
        try {
            await fs.access(pdfFilePath);
            console.log(`PDF file exists despite LaTeX errors. Proceeding with download.`);
            // Continue processing - don't return an error response
        } catch (pdfError) {
            // No PDF was produced, so we have to return an error
            return res.status(500).json({
                message: 'LaTeX compilation failed and no PDF was generated. Check server logs for details.',
                error: error.message || 'Unknown error during compilation.',
                stderr: error.stderr || 'No stderr output.',
                stdout: error.stdout || 'No stdout output.',
                log: logContent.slice(-1000)
            });
        }
    }

    // 5. Verify that the PDF file exists - this is now redundant for the error case but 
    // still needed for the success path
    try {
        await fs.access(pdfFilePath);
        console.log(`PDF file found at ${pdfFilePath}`);
    } catch (err) {
        console.error(`PDF file not found at ${pdfFilePath} after compilation attempts.`);
        let logContent = 'Log file not available or read error.';
        try {
            logContent = await fs.readFile(logFilePath, 'utf-8');
            console.error('LaTeX Log File Content on PDF Not Found (Last 1000 chars):');
            console.error(logContent.slice(-1000));
        } catch { /* ignore log read error */ }

        return res.status(500).json({
            message: 'PDF file not generated after LaTeX compilation. Check server logs.',
            log: logContent.slice(-1000)
        });
    }

    // 6. Read the generated PDF file into a buffer
    const pdfBuffer = await fs.readFile(pdfFilePath);

    // 7. Set HTTP headers for PDF download
    const safeName = state.name?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'resume';
    const downloadFilename = `${safeName}_resume.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadFilename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // 8. Send the PDF buffer as the response
    console.log(`Sending PDF: ${downloadFilename} (${pdfBuffer.length} bytes)`);
    res.status(200).send(pdfBuffer);

  } catch (error: any) {
    // Catch any unexpected errors during the process
    console.error('Unexpected error in /api/generate-pdf:', error);
    res.status(500).json({
        message: 'Failed to generate PDF due to an unexpected server error.',
        error: error.message || 'Unknown error.'
    });
  } finally {
    // 9. Cleanup: Always attempt to remove the temporary directory
    if (tempDir) {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
        console.log(`Successfully cleaned up temporary directory: ${tempDir}`);
      } catch (cleanupError) {
        // Log cleanup errors but don't prevent the response from being sent
        console.error(`Failed to cleanup temporary directory ${tempDir}:`, cleanupError);
      }
    }
  }
}
