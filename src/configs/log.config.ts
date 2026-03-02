import fs from "fs";
import path from "path";

export class LogFile {

  private readonly LOGS_DIR = path.join(__dirname, '..', 'logs');

  private readonly LOG_FILES = [
    'auths.json',
    'tasks.json',
    'teams.json',
    'projects.json',
    'servers.json'
  ];

  private readonly EMPTY_JSON = JSON.stringify([], null, 2);
  private createdFiles: string[] = [];

  /**
   * Creates the log directory and files.
   */
  public create(): void {
    try {

      this.ensureDirectoryExists(this.LOGS_DIR);

      for (const fileName of this.LOG_FILES) {
        const filePath = path.join(this.LOGS_DIR, fileName);
        this.touch(filePath);
      }

      // Log
      if (this.createdFiles.length >= 1) console.log(`\x1b[32m[DEBUG] The required files have been created: ${this.createdFiles}.\x1b[0m`);
    } catch (error) {
      console.error(`\x1b[31m[DEBUG] Error during file operations:\x1b[0m`, error);
    }
  };

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  };

  private touch(filePath: string): void {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, this.EMPTY_JSON, 'utf8');
      this.createdFiles.push(path.basename(filePath));
    }
  };
};