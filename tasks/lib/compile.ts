import { basename } from "https://deno.land/std/path/mod.ts";

interface File {
  path: string;
  content: string;
}

export async function compile(files: File[]): Promise<File[]> {
  const output: File[] = [];

  for (const file of files) {
    const ext = basename(file.path).split('.').pop();
    
    switch (ext) {
      case 'ts':
        // Process TypeScript files
        output.push({
          path: file.path.replace('.ts', '.js'),
          content: await transpileTypeScript(file.content)
        });
        break;
      
      case 'css':
        // Process CSS files
        output.push({
          path: file.path,
          content: await processCSS(file.content)
        });
        break;
      
      default:
        // Copy other files as-is
        output.push(file);
    }
  }

  return output;
}

async function transpileTypeScript(content: string): Promise<string> {
  const { transpile } = await import("https://deno.land/x/typescript@v5.3.3/mod.ts");
  return transpile(content, {
    target: "es2020",
    module: "es2020",
  });
}

async function processCSS(content: string): Promise<string> {
  // Add any CSS processing here if needed
  return content;
}
