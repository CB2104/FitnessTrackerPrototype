import type { Context } from "koa";
import { analyzeImage } from "../services/gemini";
import fs from "fs";

export default {
  async analyze(ctx: Context) {
    try {
      const files = ctx.request.files;

      if (!files) {
        console.error("No files object");
        return ctx.badRequest("No files in request");
      }

      let file = files.image || files.file;

      if (Array.isArray(file)) {
        file = file[0];
      }

      if (!file) {
        console.log("Available files:", files);
        return ctx.badRequest("No image uploaded");
      }

      const filePath = file.filepath;

      if (!filePath) {
        console.error("No path found in file object");
        console.log("File object dump:", JSON.stringify(file, null, 2));
        return ctx.badRequest("File path not found");
      }
      if (!fs.existsSync(filePath)) {
        console.error("File does not exist at path:", filePath);
        return ctx.badRequest("File not accessible");
      }

      const result = await analyzeImage(filePath);
      return { data: result };
    } catch (error: any) {
      console.error("=== CONTROLLER ERROR ===");
      console.error("Type:", error.constructor.name);
      console.error("Message:", error.message);
      console.error("Stack:", error.stack);

      return ctx.internalServerError("Analysis failed", {
        error: error.message,
        stack: error.stack,
      });
    }
  },
};
